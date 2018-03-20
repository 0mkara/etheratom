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
        this.state = {
            childFunctions: []
        };
        this._handleChange = this._handleChange.bind(this);
    }
    async componentDidMount() {
        const { contractName, interfaces } = this.props;
        const ContractABI = interfaces[contractName].interface;
        try {
            const childFunctions = await this.helpers.constructFunctions(ContractABI);
            this.setState({ childFunctions: childFunctions });
        } catch (e) {
            this.helpers.showPanelError(e);
        }
    }
    _handleChange(input, event) {
        input.value = event.target.value;
    }
    async _handleSubmit(methodItem) {
        console.log("%c Call contract function... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        console.log(methodItem);
        try {
            const { contractName, coinbase, password, instances } = this.props;
            const contract = instances[contractName];
            let params = [];
            for(input of methodItem.inputs) {
                if(input.value) {
                    params.push(input);
                }
            }
            console.log("%c Calling function... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
            const result = await this.helpers.call(coinbase, password, contract, methodItem, params);
            const outputTypes = await this.helpers.getOutputTypes(methodItem);
            this.helpers.showOutput(contract.options.address, outputTypes, result);
        } catch (e) {
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
                                <form onSubmit={() => { this._handleSubmit(abi) }} key={i} >
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
                                                />
                                            );
                                        })
                                    }
                                </form>
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
