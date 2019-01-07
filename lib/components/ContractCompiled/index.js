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
import ReactJson from 'react-json-view';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import GasInput from '../GasInput';
import InputsForm from '../InputsForm';
import CreateButton from '../CreateButton';
import PropTypes from 'prop-types';
import { addInterface } from '../../actions';

class ContractCompiled extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            estimatedGas: 9000000,
            ContractABI: props.interfaces[props.contractName].interface
        };
        this._handleGasChange = this._handleGasChange.bind(this);
        this._handleInput = this._handleInput.bind(this);
    }
    async componentDidMount() {
        try {
            const { coinbase, bytecode } = this.props;
            const gas = await this.helpers.getGasEstimate(coinbase, bytecode);
            this.setState({ estimatedGas: gas });
        } catch (e) {
            console.log(e);
            this.helpers.showPanelError(e);
        }
    }
    _handleGasChange(event) {
        this.setState({ estimatedGas: event.target.value });
    }
    _handleInput() {
        const { contractName } = this.props;
        const { ContractABI } = this.state;
        this.props.addInterface({ contractName, ContractABI });
    }
    render() {
        const { contractName, bytecode, index } = this.props;
        const { estimatedGas, ContractABI } = this.state;
        return (
            <div className="contract-content" key={index}>
                <span className="contract-name inline-block highlight-success">{ contractName }</span>
                <div className="byte-code">
                    <pre className="large-code">{ JSON.stringify(bytecode) }</pre>
                </div>
                <div className="abi-definition">
                    <Tabs>
                        <TabList>
                            <div className="tab_btns">
                                <Tab>
                                    <div className="btn">Interface</div>
                                </Tab>
                                <Tab>
                                    <div className="btn">Interface Object</div>
                                </Tab>
                            </div>
                        </TabList>

                        <TabPanel>
                            <pre className="large-code">{ JSON.stringify(ContractABI) }</pre>
                        </TabPanel>
                        <TabPanel>
                            <ReactJson
                                src={ContractABI}
                                theme="chalk"
                                displayDataTypes={false}
                                name={false}
                                collapsed={2}
                                collapseStringsAfterLength={32}
                                iconStyle="triangle"
                            />
                        </TabPanel>
                    </Tabs>
                </div>
                {
                    ContractABI.map((abi, i) => {
                        return <InputsForm key={i} contractName={contractName} abi={abi} onSubmit={this._handleInput}/>;
                    })
                }
                <GasInput contractName={contractName} gas={estimatedGas} onChange={this._handleGasChange} />
                {
                    <CreateButton
                        contractName={contractName}
                        bytecode={bytecode}
                        abi={ContractABI}
                        gas={estimatedGas}
                        helpers={this.helpers}
                    />
                }
            </div>
        );
    }
}
ContractCompiled.propTypes = {
    helpers: PropTypes.any.isRequired,
    interfaces: PropTypes.object,
    contractName: PropTypes.string,
    addInterface: PropTypes.func,
    bytecode: PropTypes.string,
    index: PropTypes.number,
    coinbase: PropTypes.string,
};
const mapStateToProps = ({ account, contract }) => {
    const { compiled, interfaces } = contract;
    const { coinbase } = account;
    return { compiled, interfaces, coinbase };
};

export default connect(mapStateToProps, { addInterface })(ContractCompiled);
