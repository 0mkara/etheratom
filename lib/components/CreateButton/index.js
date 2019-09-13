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
import { setInstance, setDeployed, addNewEvents } from '../../actions';

class CreateButton extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            constructorParams: undefined,
            coinbase: props.coinbase,
            password: props.password,
            atAddress: undefined
        };
        this._handleAtAddressChange = this._handleAtAddressChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }
    async componentDidMount() {
        const { abi } = this.props;
        var inputs = [];
        for (let abiObj in abi) {
            if (abi[abiObj].type === 'constructor' && abi[abiObj].inputs.length > 0) {
                inputs = abi[abiObj].inputs;
            }
        }
        this.setState({ constructorParams: inputs });
    }
    async _handleAtAddressChange(event) {
        this.setState({ atAddress: event.target.value });
    }
    async _handleSubmit() {
        try {
            const { abi, bytecode, contractName, gas, coinbase, password } = this.props;
            const { atAddress } = this.state;
            const contractInterface = this.props.interfaces[contractName].interface;
            const constructor = contractInterface.find(interfaceItem => interfaceItem.type === 'constructor');
            const params = [];
            if (constructor) {
                for (let input of constructor.inputs) {
                    if (input.value) {
                        params.push(input);
                    }
                }
            }
            await this.helpers.create({ coinbase, password, atAddress, abi, bytecode, contractName, params, gas });
        } catch (e) {
            console.error(e);
            this.helpers.showPanelError(e);
        }
    }
    render() {
        const { contractName } = this.props;
        return (
            <form onSubmit={this._handleSubmit} className="padded">
                <input
                    type="submit"
                    value="Deploy to blockchain"
                    ref={contractName}
                    className="btn btn-primary inline-block-tight">
                </input>
                <input
                    type="text" placeholder="at:" className="inputs"
                    value={this.state.atAddress}
                    onChange={this._handleAtAddressChange}>
                </input>
            </form>
        );
    }
}

CreateButton.propTypes = {
    helpers: PropTypes.any.isRequired,
    coinbase: PropTypes.string,
    password: PropTypes.oneOfType([PropTypes.string, PropTypes.boolean]),
    interfaces: PropTypes.object,
    setInstance: PropTypes.func,
    setDeployed: PropTypes.func,
    addNewEvents: PropTypes.func,
    contractName: PropTypes.string,
    abi: PropTypes.object,
    bytecode: PropTypes.string,
    gas: PropTypes.number,
};

const mapStateToProps = ({ contract, account }) => {
    const { compiled, interfaces } = contract;
    const { coinbase, password } = account;
    return { compiled, interfaces, coinbase, password };
};

export default connect(mapStateToProps, { setDeployed, setInstance, addNewEvents })(CreateButton);
