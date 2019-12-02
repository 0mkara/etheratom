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
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { execution, init } from 'remix-lib';
import { TransactionDebugger as Debugger } from 'remix-debug';
class RemixDebugger extends React.Component {
    constructor(props) {
        super(props);
    }
    getDebugWeb3() {
        return new Promise((resolve, reject) => {
            execution.executionContext.detectNetwork((error, network) => {
                let web3;
                if (error || !network) {
                    web3 = init.web3DebugNode(execution.executionContext.web3());
                } else {
                    const webDebugNode = init.web3DebugNode(network.name);
                    web3 = !webDebugNode ? execution.executionContext.web3() : webDebugNode;
                }
                init.extendWeb3(web3);
                resolve(web3);
            })
        })
    }
    async _runRemixDebugging(blockNumber, txNumber, tx) {
        let lastCompilationResult;
        if (this.props.compiled) lastCompilationResult = this.props.compiled;
        var api = null;
        let web3 = await this.getDebugWeb3();
        this.debugger = new Debugger({
            web3,
            api,
            compiler: { lastCompilationResult }
        });

        this.debugger.debug(blockNumber, txNumber, tx, () => {
            console.log('debugger detected');
        }).catch((error) => {
            console.error(error);
        })
    }
    render() {
        // const { blockNumber, txNumber, tx } = this.props;
        return (
            <Provider store={this.props.store}>
                <div id="remix-Debugger">
                    <h3>Remix-Debugger</h3>
                    {/*
                        <button className="btn btn-primary inline-block-tight" onClick={() => this._runRemixDebugging(blockNumber, txNumber, tx)}>
                        Run debug
                    </button>
                    */}
                    <button className="btn btn-primary inline-block-tight">
                        Run debug
                    </button>
                </div>
            </Provider>
        );
    }
}

RemixDebugger.propTypes = {
    compiled: PropTypes.object,
    store: PropTypes.any,

};
const mapStateToProps = ({ contract }) => {
    const { compiled } = contract;
    return { compiled };
};
export default connect(mapStateToProps, {})(RemixDebugger);
