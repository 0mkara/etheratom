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
// import { fork } from 'child_process';
import { execution, init } from 'remix-lib';
// import ErrorView from '../ErrorView';
// import { setErrors, resetErrors } from '../../actions';
import { TransactionDebugger as Debugger } from 'remix-debug';
class RemixDebugger extends React.Component {
    constructor(props) {
        super(props);
    }
    // createWorker(fn) {
    //     const pkgPath = atom.packages.resolvePackagePath('etheratom');
    //     return fork(`${pkgPath}/lib/web3/debugWorker.js`);
    // }
    getDebugWeb3() {
        return new Promise((resolve, reject) => {
            execution.executionContext.detectNetwork((error, network) => {
                let web3
                if (error || !network) {
                    web3 = init.web3DebugNode(execution.executionContext.web3())
                } else {
                    const webDebugNode = init.web3DebugNode(network.name)
                    web3 = !webDebugNode ? execution.executionContext.web3() : webDebugNode
                }
                init.extendWeb3(web3)
                resolve(web3)
            })
        })
    }
    async _runRemixDebugging(blockNumber, txNumber, tx) {
        // if (this.debugger) this.unLoad()
        console.log("gggggggggggggggggggg", blockNumber, "hhhhhhhhhhhhhh", txNumber, "fffffffffffffffff", tx);
        
        let lastCompilationResult
        if (this.props.compiled) lastCompilationResult = this.props.compiled
        var api = null;
        let web3 = await this.getDebugWeb3()
        this.debugger = new Debugger({
            web3,
            api,
            compiler: { lastCompilationResult }
        })

        this.debugger.debug(blockNumber, txNumber, tx, () => {
            console.log("debugger detected");
        }).catch((error) => {
            console.log("error detected", error);
        })
    }
    render() {
        console.log("hhhhhhhhhhhhhhh", this.props.compiled)
        var txNumber = "0xf628cd91d7d835061fe8a8d28d222821e7f7e6964a24dc3e819572172e67f269";
        var blockNumber = null;
        var tx = null;
        return (
            <Provider store={this.props.store}>
                <div id="remix-Debugger">
                    <h3>Remix-Debugger</h3>
                    <button className="btn btn-primary inline-block-tight" onClick={() => this._runRemixDebugging(blockNumber, txNumber, tx)}>
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
