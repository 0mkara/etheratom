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
import React from 'react'
import { connect } from 'react-redux'
import { setCoinbase, setPassword } from '../../actions'

class CoinbaseView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coinbase: props.accounts[0],
            password: '',
            accounts: props.accounts,
            unlock_style: 'unlock-default'
        };
        this._handleAccChange = this._handleAccChange.bind(this);
        this._handlePasswordChange = this._handlePasswordChange.bind(this);
        this._handleUnlock = this._handleUnlock.bind(this);
        this._linkClick = this._linkClick.bind(this);
    }
    _linkClick(event) {
        const { coinbase } = this.state;
        atom.clipboard.write(coinbase);
    }
    _handleAccChange(event) {
        const coinbase = event.target.value;
        this.props.setCoinbase(coinbase);
        this.setState({ coinbase });
    }
    _handlePasswordChange(event) {
        const password = event.target.value
        this.setState({ password });
        // TODO: unless we show some indicator on `Unlock` let password set on change
        if (!((password.length - 1) > 0)) {
            this.setState({ unlock_style: 'unlock-default' });
        }
    }
    _handleUnlock(event) {
        // TODO: here try to unlock geth backend node using coinbase and password and show result
        const { password } = this.state;
        if (password.length > 0) {
            this.props.setPassword({ password });
            this.setState({ unlock_style: 'unlock-active' });
        }
        event.preventDefault();
    }
    render() {
        const { coinbase, password, accounts } = this.state;
        return (
            <div for="acc-n-pass" class="content">
                <div class="row">
                    <div class="icon icon-link btn copy-btn btn-success" onClick={this._linkClick}></div>
                    <select onChange={this._handleAccChange} value={this.state.coinbase}>
                        {
                            accounts.map((account, i) => {
                                return (
                                    <option value={account}>{account}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <form class="row" onSubmit={this._handleUnlock}>
                    <div class="icon icon-lock"></div>
                    <input
                        type="password" placeholder="Password"
                        value={password}
                        onChange={this._handlePasswordChange}
                    />
                    <input
                        type="submit"
                        class={this.state.unlock_style}
                        value="Unlock"
                    />
                </form>
            </div>
        );
    }
};

const mapStateToProps = ({ account }) => {
	const { coinbase, password, accounts } = account;
	return { coinbase, password, accounts };
}

export default connect(mapStateToProps, { setCoinbase, setPassword })(CoinbaseView);
