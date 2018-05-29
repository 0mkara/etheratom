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
import InputsForm from '../InputsForm';
import FunctionABI from '../FunctionABI';

class ContractExecution extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
    }
    render() {
        const { contractName, bytecode, index, instances, interfaces } = this.props;
        const contract = instances[contractName];
        const ContractABI = interfaces[contractName].interface;
        return (
            <div class="contract-content" key={index}>
                <span class="contract-name inline-block highlight-success">{contractName}</span>
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
                                collapsed={2}
                            />
                        </TabPanel>
                    </Tabs>
                </div>
                {
                    contract.transactionHash &&
                    <div id={contractName + '_txHash'}>
                        <span class="inline-block highlight">Transaction hash:</span>
                        <pre class="large-code">{contract.transactionHash}</pre>
                    </div>
                }
                {
                    !contract.options.address &&
                    <div id={contractName + '_stat'}>
                        <span class="stat-mining stat-mining-align">waiting to be mined</span>
                        <span class="loading loading-spinner-tiny inline-block stat-mining-align"></span>
                    </div>
                }
                {
                    contract.options.address &&
                    <div id={contractName + '_stat'}>
                        <span class="inline-block highlight">Mined at:</span>
                        <pre class="large-code">{contract.options.address}</pre>
                    </div>
                }
                {
                    ContractABI.map((abi) => {
                        return <InputsForm contractName={contractName} abi={abi} />;
                    })
                }
                <FunctionABI contractName={contractName} helpers={this.helpers} />
            </div>
        );
    }
};

const mapStateToProps = ({ contract }) => {
    const { interfaces, instances } = contract;
    return { interfaces, instances };
};

export default connect(mapStateToProps, {})(ContractExecution);
