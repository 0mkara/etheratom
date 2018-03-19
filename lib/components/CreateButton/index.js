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
import { setInstance, setDeployed, addNewEvents } from '../../actions'

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
        try {
            const { abi, bytecode, contractName, gas, coinbase, password } = this.props;
            const { constructorParams } = this.state;
            const contractInterface = this.props.interfaces[contractName].interface;
            const constructor = contractInterface.find(interfaceItem => interfaceItem.type === "constructor");
            const params = [];
            if(constructor) {
                for(input of constructor.inputs) {
                    if(input.value) {
                        params.push(input);
                    }
                }
            }

            const contract = await this.helpers.create(coinbase, password, abi, bytecode, contractName, gas);
            this.props.setInstance({ contractName, instance: Object.assign({}, contract) });

            const contractInstance = await this.helpers.deploy(contract, params);
            this.props.setDeployed({ contractName, deployed: true });
            contractInstance.on('address', address => {
                contract.options.address = address;
                this.props.setInstance({ contractName, instance: Object.assign({}, contract) });
            });
            contractInstance.on('transactionHash', transactionHash => {
                contract.transactionHash = transactionHash;
                this.props.setInstance({ contractName, instance: Object.assign({}, contract) });
            });
            contractInstance.on('instance', instance => {
                instance.events.allEvents({ fromBlock: 'latest' })
                    .on('logs', (logs) => {
                        this.props.addNewEvents({ payload: logs });
                    })
                    .on('data', (data) => {
                        this.props.addNewEvents({ payload: data });
                    })
                    .on('changed', (changed) => {
                        this.props.addNewEvents({ payload: changed });
                    })
                    .on('error', (error) => {
                        console.log(error);
                    })
            });
            contractInstance.on('error', error => {
                this.helpers.showPanelError(error);
            });
        } catch(e) {
            console.log(e);
            this.helpers.showPanelError(e);
        }
    }
    render() {
        const { contractName } = this.props;
        return (
            <form onSubmit={this._handleSubmit}>
                <input
                    type="submit"
                    value="Deploy to blockchain"
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

export default connect(mapStateToProps, { setDeployed, setInstance, addNewEvents })(CreateButton);
