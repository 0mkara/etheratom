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
import { setInstance, setDeployed } from '../../actions'

class CreateButton extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            constructorParams: undefined,
            coinbase: props.coinbase,
            password: props.password
        }
        this._handleSubmit = this._handleSubmit.bind(this);
    }
    async componentDidMount() {
        const { abi } = this.props;
        inputs = [];
        for (abiObj in abi) {
            if (abi[abiObj].type === "constructor" && abi[abiObj].inputs.length > 0) {
                inputs = abi[abiObj].inputs;
            }
        }
        this.setState({ constructorParams: inputs });
    }
    async _handleSubmit() {
        console.log("%c Submit handle... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        try {
            const { abi, bytecode, contractName, gas, coinbase, password } = this.props;
            const { constructorParams } = this.state;
            console.log(this.props);
            const contractInterface = this.props.interfaces[contractName].interface;
            console.log(contractInterface);
            const constructor = contractInterface.find(interfaceItem => interfaceItem.type === "constructor");
            console.log(constructor);
            const params = [];
            for(input of constructor.inputs) {
                if(input.value) {
                    params.push(input.value);
                }
            }
            console.log(params);

            const contract = await this.helpers.create(coinbase, password, abi, bytecode, params, contractName, gas);
            this.props.setDeployed({ deployed: true });
            this.props.setInstance({ instance: contract });
            //that.setExecutionView(contractName, abi, bytecode, constructorParams, params, contract);
            const contractInstance = await this.helpers.deploy(contract, params);
            contractInstance.on('address', address => {
                contract.options.address = address;
                //that.setExecutionView(contractName, abi, bytecode, constructorParams, params, contract);
            });
            contractInstance.on('transactionHash', transactionHash => {
                contract.transactionHash = transactionHash;
                //that.setExecutionView(contractName, abi, bytecode, constructorParams, params, contract);
            });
            contractInstance.on('error', error => {
                this.helpers.showPanelError(error);
            });
        } catch(e) {
            this.helpers.showPanelError(e);
        }
    }
    render() {
        const { contractName } = this.props;
        return (
            <form onSubmit={this._handleSubmit}>
                <input
                    type="submit"
                    value="Create"
                    ref={contractName}
                    class="btn btn-primary inline-block-tight">
                </input>
            </form>
        );
    }
};

const mapStateToProps = ({ contract, account }) => {
	const { compiled, interfaces } = contract;
    const { coinbase, password } = account;
	return { compiled, interfaces, coinbase, password };
}

export default connect(mapStateToProps, { setDeployed, setInstance })(CreateButton);
