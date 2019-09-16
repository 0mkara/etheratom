'use babel'
// Copyright 2018 Etheratom Authors
// This file is part of Etheratom.

// Etheratom is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Etheratom is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Etheratom.  If not, see <http://www.gnu.org/licenses/>.
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setCoinbase, setPassword } from '../../actions';



class CoinbaseView extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        // const { balance } = props;
        this.state = {
            coinbase: props.accounts[0],
            password: '',
            toAddress: '',
            unlock_style: 'unlock-default',
            amount: 0
        };
        this._handleAccChange = this._handleAccChange.bind(this);
        this._handlePasswordChange = this._handlePasswordChange.bind(this);
        this._handleUnlock = this._handleUnlock.bind(this);
        this._linkClick = this._linkClick.bind(this);
        this._refreshBal = this._refreshBal.bind(this);
    }
    async componentDidMount() {
        const { coinbase } = this.state;

        this.helpers.setDefaultAccount(coinbase);
        this.helpers.getBalance(coinbase);
    }

    async componentDidUpdate(prevProps, prevState) {
        const { coinbase } = this.state;
        if (this.state.coinbase !== prevState.coinbase) {
            this.helpers.setDefaultAccount(coinbase);
            this.helpers.getBalance(coinbase);
        }
    }

    async componentWillReceiveProps() {
        if (this.props.accounts[0]) {
            this.setState({ coinbase: this.props.accounts[0] });
        }
        // this.setState({ balance: this.props.store.getState().account.balance });
    }
    _linkClick(event) {
        const { coinbase } = this.state;
        atom.clipboard.write(coinbase);
    }
    async _handleAccChange(event) {
        const coinbase = event.target.value;
        const { setCoinbase } = this.props;
        this.helpers.setDefaultAccount(coinbase);
        this.helpers.getBalance(coinbase);
        setCoinbase(coinbase);
        this.setState({ coinbase });
    }
    _handlePasswordChange(event) {
        const password = event.target.value;
        this.setState({ password });
        // TODO: unless we show some indicator on `Unlock` let password set on change
        if (!(password.length - 1 > 0)) {
            this.setState({ unlock_style: 'unlock-default' });
        }
    }
    _handleUnlock(event) {
        // TODO: here try to unlock geth backend node using coinbase and password and show result
        const { password, coinbase } = this.state;
        const { setCoinbase, setPassword } = this.props;
        if (password.length > 0) {
            setPassword({ password });
            setCoinbase(coinbase);
            // TODO: Set web3.eth.defaultAccount on unlock
            this.helpers.setCoinbase(coinbase);
            this.setState({ unlock_style: 'unlock-active' });
        }
        event.preventDefault();
    }
    async _refreshBal() {
        const { coinbase } = this.state;
        await this.helpers.getBalance(coinbase);
        this.setState({ balance: this.props.store.getState().account.balance });
    }
    render() {
        const { password, unlock_style } = this.state;
        const { balance, accounts, coinbase } = this.props;

        return (
            <div className="content">
                {accounts.length > 0 && (
                    <div className="row">
                        <div
                            className="icon icon-link btn copy-btn btn-success"
                            onClick={this._linkClick}
                        />
                        <select
                            onChange={this._handleAccChange}
                            value={coinbase}
                        >
                            {accounts.map((account, i) => {
                                return (
                                    <option key={i} value={account}>
                                        {account}
                                    </option>
                                );
                            })
                            }
                        </select>
                        <button onClick={this._refreshBal} className="btn"> {balance} ETH </button>
                    </div>
                )}
                {accounts.length > 0 && (
                    <form className="row" onSubmit={this._handleUnlock}>
                        <div className="icon icon-lock" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={this._handlePasswordChange}
                        />
                        <input
                            type="submit"
                            className={unlock_style}
                            value="Unlock"
                        />
                    </form>
                )}
            </div>
        );
    }
}

CoinbaseView.propTypes = {
    helpers: PropTypes.any.isRequired,
    accounts: PropTypes.arrayOf(PropTypes.string),
    setCoinbase: PropTypes.function,
    store: PropTypes.any,
    balance: PropTypes.any,
    coinbase: PropTypes.any,
    setPassword: PropTypes.function
};

const mapStateToProps = ({ account }) => {
    const { coinbase, password, accounts, balance } = account;
    return { coinbase, password, accounts, balance };
};

export default connect(mapStateToProps, { setCoinbase, setPassword })(CoinbaseView);
