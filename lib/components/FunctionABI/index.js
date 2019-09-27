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
import { updateInterface } from '../../actions';

class FunctionABI extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this._handleChange = this._handleChange.bind(this);
        this._handlePayableValue = this._handlePayableValue.bind(this);
        this._handleFallback = this._handleFallback.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }
    _handleChange(i, j, event) {
        const { contractName, contracts } = this.props;
        const ContractABI = contracts[contractName].options.jsonInterface;
        const input = ContractABI[i].inputs[j];
        input.value = event.target.value;
        ContractABI[i].inputs[j] = Object.assign({}, input);
        this.props.updateInterface({ contractName, ContractABI });
    }
    _handlePayableValue(abi, event) {
        abi.payableValue = event.target.value;
    }
    async _handleFallback(abiItem) {
        const { contractName, coinbase, password, contracts } = this.props;
        const contract = contracts[contractName];
        try {
            this.helpers.call({ coinbase, password, contract, abiItem });
        } catch (e) {
            console.log(e);
            this.helpers.showPanelError(e);
        }
    }
    async _handleSubmit(methodItem) {
        try {
            const { contractName, coinbase, password, contracts } = this.props;
            const contract = contracts[contractName];
            let params = [];
            for (let input of methodItem.inputs) {
                if (input.value) {
                    params.push(input);
                }
            }
            this.helpers.call({ coinbase, password, contract, abiItem: methodItem, params });
        } catch (e) {
            console.error(e);
            this.helpers.showPanelError(e);
        }
    }
    render() {
        const { contractName, interfaces } = this.props;
        const ContractABI = interfaces[contractName].interface;
        return (
            <div className="abi-container">
                {
                    ContractABI.map((abi, i) => {
                        if (abi.type === 'function') {
                            return (
                                <div key={i} className="function-container">
                                    <form key={i} onSubmit={() => this._handleSubmit(abi)}>
                                        <input key={i} type="submit" value={abi.name} className="text-subtle call-button" />
                                        {
                                            abi.inputs.map((input, j) => {
                                                return (
                                                    <input
                                                        type="text"
                                                        className="call-button-values"
                                                        placeholder={input.name + ' ' + input.type}
                                                        value={input.value}
                                                        onChange={(event) => this._handleChange(i, j, event)}
                                                        key={j}
                                                    />
                                                );
                                            })
                                        }
                                        {
                                            abi.payable === true &&
                                            <input
                                                className="call-button-values"
                                                type="number"
                                                placeholder="payable value in wei"
                                                onChange={(event) => this._handlePayableValue(abi, event)}
                                            />
                                        }
                                    </form>
                                </div>
                            );
                        }
                        if (abi.type === 'fallback') {
                            return (
                                <div className="fallback-container">
                                    <form key={i} onSubmit={() => { this._handleFallback(abi); }}>
                                        <button className="btn">fallback</button>
                                        {
                                            abi.payable === true &&
                                            <input
                                                className="call-button-values"
                                                type="number"
                                                placeholder="send wei to contract"
                                                onChange={(event) => this._handlePayableValue(abi, event)}
                                            />
                                        }
                                    </form>
                                </div>
                            );
                        }
                    })
                }
            </div>
        );
    }
}

FunctionABI.propTypes = {
    helpers: PropTypes.any.isRequired,
    contractName: PropTypes.string,
    interfaces: PropTypes.object,
    updateInterface: PropTypes.func,
    coinbase: PropTypes.string,
    password: PropTypes.string,
    instances: PropTypes.object,
    contracts: PropTypes.object
};

const mapStateToProps = ({ contract, account }) => {
    const { compiled, interfaces, contracts } = contract;
    const { coinbase, password } = account;
    return { compiled, interfaces, contracts, coinbase, password };
};

export default connect(mapStateToProps, { updateInterface })(FunctionABI);
