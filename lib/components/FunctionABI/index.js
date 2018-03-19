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
        console.log(interfaces);
        console.log(contractName);
        console.log(interfaces[contractName]);
        const ContractABI = interfaces[contractName].interface;
        try {
            const childFunctions = await this.helpers.constructFunctions(ContractABI);
            this.setState({ childFunctions: childFunctions });
        } catch (e) {
            this.helpers.showPanelError(e);
        }
    }
    _handleChange(interfaceName, type, event) {
        const value = event.target.value;
        let params = { ...this.state.params };
        params[interfaceName] = { type, value };
        this.setState({ params });
    }
    async _handleSubmit(methodItem) {
        console.log("%c Submit handle... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        // call functions here
        try {
            const { contractName, coinbase, password, instances } = this.props;
            const contract = instances[contractName];
            let params = [];
            if(this.state.params && this.state.params[methodItem.name]) {
                params = await this.helpers.inputsToArray(this.state.params[methodItem.name]);
            }
            const result = await this.helpers.call(coinbase, password, contract, methodItem, params);
            const outputTypes = await this.helpers.getOutputTypes(methodItem);
            this.helpers.showOutput(contract.options.address, outputTypes, result);
        } catch (e) {
            this.helpers.showPanelError(e);
        }
    }
    render() {
        return (
            <div class="abi-container">
                {
                    this.state.childFunctions.map((childFunction, i) => {
                        return (
                            <form
                                onSubmit={() => { this._handleSubmit(childFunction.interface) }}
                                key={i}>
                                <input type="submit" value={childFunction.interface.name} class="text-subtle call-button" />
                                {
                                    childFunction.params.map((childInput, j) => {
                                        return (
                                            <input
                                                class="call-button-values"
                                                type="text"
                                                placeholder={childInput[0] + ' ' + childInput[1]}
                                                onChange={(event) => this._handleChange(childFunction.interface.name, childInput[0], event)}
                                            />
                                        );
                                    })
                                }
                            </form>
                        );
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
