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

class FunctionABI extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this._handleChange = this._handleChange.bind(this);
        this._handlePayableValue = this._handlePayableValue.bind(this);
        this._handleFallback = this._handleFallback.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }
    _handleChange(input, event) {
        input.value = event.target.value;
    }
    _handlePayableValue(abi, event) {
        abi.payableValue = event.target.value;
    }
    async _handleFallback(abiItem) {
        const { contractName, coinbase, password, instances } = this.props;
        const contract = instances[contractName];
        try {
            const result = await this.helpers.call({ coinbase, password, contract, abiItem });
            this.helpers.showOutput({ address: contract.options.address, data: result });
        } catch(e) {
            console.log(e);
            this.helpers.showPanelError(e);
        }
    }
    async _handleSubmit(methodItem) {
        try {
            const { contractName, coinbase, password, instances } = this.props;
            const contract = instances[contractName];
            let params = [];
            for(input of methodItem.inputs) {
                if(input.value) {
                    params.push(input);
                }
            }
            const result = await this.helpers.call({ coinbase, password, contract, abiItem: methodItem, params });
            this.helpers.showOutput({ address: contract.options.address, data: result });
        } catch (e) {
            console.log(e);
            this.helpers.showPanelError(e);
        }
    }
    render() {
        const { contractName, interfaces } = this.props;
        const ContractABI = interfaces[contractName].interface;
        return (
            <div class="abi-container">
                {
                    ContractABI.map((abi, i) => {
                        if(abi.type === 'function') {
                            return (
                                <div class="function-container">
                                    <form onSubmit={() => { this._handleSubmit(abi) }} key={i}>
                                        <input type="submit" value={abi.name} class="text-subtle call-button" />
                                        {
                                            abi.inputs.map((input, j) => {
                                                return (
                                                    <input
                                                        type="text"
                                                        class="call-button-values"
                                                        placeholder={input.name + ' ' + input.type}
                                                        value={input.value}
                                                        onChange={(event) => this._handleChange(input, event)}
                                                        key={j}
                                                    />
                                                );
                                            })
                                        }
                                        {
                                            abi.payable === true &&
                                            <input
                                                class="call-button-values"
                                                type="number"
                                                placeholder="payable value"
                                                onChange={(event) => this._handlePayableValue(abi, event)}
                                            />
                                        }
                                    </form>
                                </div>
                            );
                        }
                        if(abi.type === 'fallback') {
                            return (
                                <div class="fallback-container">
                                    <form onSubmit={() => { this._handleFallback(abi) }} key={i}>
                                        <button class="btn">fallback</button>
                                        {
                                            abi.payable === true &&
                                            <input
                                                class="call-button-values"
                                                type="number"
                                                placeholder="send ether to contract"
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
};

const mapStateToProps = ({ contract, account }) => {
	const { compiled, interfaces, instances } = contract;
    const { coinbase, password } = account;
	return { compiled, interfaces, instances, coinbase, password };
}

export default connect(mapStateToProps, {})(FunctionABI);
