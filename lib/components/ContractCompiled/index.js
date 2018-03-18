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
import ReactJson from 'react-json-view'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import GasInput from '../GasInput'
import InputsForm from '../InputsForm'
import CreateButton from '../CreateButton'
import { addInterface } from '../../actions'

class ContractCompiled extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
        this.state = {
            estimatedGas: 9000000,
            ContractABI: props.interfaces[props.contractName].interface
        }
        this._handleGasChange = this._handleGasChange.bind(this);
        this._handleInput = this._handleInput.bind(this);
    }
    async componentDidMount() {
        const { bytecode } = this.props;
        //const gas = await this.helpers.getGasEstimate(that.coinbase, bytecode);
        //this.setState({ estimatedGas: gas });
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
            <div class="contract-content" key={index}>
                <span class="contract-name inline-block highlight-success">{ contractName }</span>
                <div class="byte-code">
                    <pre class="large-code">{ JSON.stringify(bytecode) }</pre>
                </div>
                <div class="abi-definition">
                    <Tabs>
                        <TabList>
                            <div class="tab_btns">
                                <Tab>
                                    <div class="btn">Interface</div>
                                </Tab>
                                <Tab>
                                    <div class="btn">Interface Object</div>
                                </Tab>
                            </div>
                        </TabList>

                        <TabPanel>
                            <pre class="large-code">{ JSON.stringify(ContractABI) }</pre>
                        </TabPanel>
                        <TabPanel>
                            <ReactJson
                                src={ContractABI}
                                theme="ocean"
                                displayDataTypes={false}
                                name={false}
                                collapsed={3}
                            />
                        </TabPanel>
                    </Tabs>
                </div>
                {
                    ContractABI.map((abi) => {
                        return <InputsForm contractName={contractName} abi={abi} onSubmit={this._handleInput}/>
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
};

const mapStateToProps = ({ contract }) => {
	const { compiled, interfaces } = contract;
	return { compiled, interfaces };
}

export default connect(mapStateToProps, { addInterface })(ContractCompiled);
