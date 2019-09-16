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
import PropTypes from 'prop-types';

class ContractExecution extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
    }
    render() {
        const { contractName, bytecode, index, contracts } = this.props;
        const contractOptions = contracts[contractName].options;
        const transactionHash = contracts[contractName].transactionHash;
        const ContractABI = contracts[contractName].options.jsonInterface;
        return (
            <div className="contract-content" key={index}>
                <span className="contract-name inline-block highlight-success">{contractName}</span>
                <div className="byte-code">
                    <pre className="large-code">{JSON.stringify(bytecode)}</pre>
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
                            <pre className="large-code">{JSON.stringify(ContractABI)}</pre>
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
                    transactionHash &&
                    <div id={contractName + '_txHash'}>
                        <span className="inline-block highlight">Transaction hash:</span>
                        <pre className="large-code">{transactionHash}</pre>
                    </div>
                }
                {
                    !contractOptions.address &&
                    <div id={contractName + '_stat'}>
                        <span className="stat-mining stat-mining-align">waiting to be mined</span>
                        <span className="loading loading-spinner-tiny inline-block stat-mining-align"></span>
                    </div>
                }
                {
                    contractOptions.address &&
                    <div id={contractName + '_stat'}>
                        <span className="inline-block highlight">Mined at:</span>
                        <pre className="large-code">{contractOptions.address}</pre>
                    </div>
                }
                {
                    ContractABI.map((abi, i) => {
                        return <InputsForm contractName={contractName} abi={abi} key={i} />;
                    })
                }
                <FunctionABI contractName={contractName} helpers={this.helpers} />
            </div>
        );
    }
}

ContractExecution.propTypes = {
    helpers: PropTypes.any.isRequired,
    contractName: PropTypes.string,
    bytecode: PropTypes.string,
    index: PropTypes.number,
    instances: PropTypes.any,
    contracts: PropTypes.any,
    interfaces: PropTypes.object
};

const mapStateToProps = ({ contract }) => {
    const { contracts } = contract;
    return { contracts };
};

export default connect(mapStateToProps, {})(ContractExecution);
