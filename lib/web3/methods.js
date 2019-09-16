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

// methods.js are collection of various functions used to execute calls on web3

import EventEmitter from 'events';
import md5 from 'md5';
import { MessagePanelView, PlainMessageView } from 'atom-message-panel';
import { fork } from 'child_process';
import { getWeb3Conn } from '../helpers/connectionHandler';

import {
    SET_COMPILED,
    SET_COMPILING
} from '../actions/types';


export default class Web3Helpers {
    constructor(store) {
        this.web3 = getWeb3Conn();
        this.store = store;
        this.jobs = {
            // fileName: { solcWorker, hash }
        };
    }
    createWorker(fn) {
        const pkgPath = atom.packages.resolvePackagePath('etheratom');
        return fork(`${pkgPath}/lib/web3/worker.js`);
    }
    async compileWeb3(sources) {
        let fileName = Object.keys(sources).find(key => {
            return /\.sol/.test(key);
        });

        let hashId = md5(sources[fileName].content);

        if (this.jobs[fileName]) {
            if (this.jobs[fileName].hashId === hashId || this.jobs[fileName].hashId === undefined) {
                this.jobs[fileName].wasBusy = true;
                console.log(hashId);
                console.error(`Job in progress for ${fileName}`);
                return;
            }

            this.jobs[fileName].solcWorker.kill();
            console.error(`Killing older job for ${fileName}`);
        } else {
            this.jobs[fileName] = { hashId };
        }

        // compile solidity using solcjs
        // sources have Compiler Input JSON sources format
        // https://solidity.readthedocs.io/en/develop/using-the-compiler.html#compiler-input-and-output-json-description
        try {
            const outputSelection = {
                // Enable the metadata and bytecode outputs of every single contract.
                '*': {
                    '': ['legacyAST'],
                    '*': ['abi', 'evm.bytecode.object', 'devdoc', 'userdoc', 'evm.gasEstimates']
                }
            };
            const settings = {
                optimizer: { enabled: true, runs: 500 },
                evmVersion: 'byzantium',
                outputSelection
            };
            const input = { language: 'Solidity', sources, settings };
            const solcWorker = this.createWorker();
            this.jobs[fileName].solcWorker = solcWorker;

            const requiredSolcVersion = atom.config.get('etheratom.versionSelector');

            solcWorker.send({ command: 'compile', payload: input, version: requiredSolcVersion });

            solcWorker.on('message', m => {
                if(m.compiled) {
                    this.store.dispatch({ type: SET_COMPILED, payload: JSON.parse(m.compiled) });
                    this.store.dispatch({ type: SET_COMPILING, payload: false });
                    this.jobs[fileName].successHash = hashId;

                    solcWorker.kill();
                }
            });
            solcWorker.on('error', e => console.error(e));
            solcWorker.on('exit', (code, signal) => {
                if (this.jobs[fileName].wasBusy && hashId !== this.jobs[fileName].successHash) {
                    this.store.dispatch({ type: SET_COMPILING, payload: true });
                } else {
                    this.store.dispatch({ type: SET_COMPILING, payload: false });
                    this.jobs[fileName] = false;
                }
                console.log('%c Compile worker process exited with ' + `code ${code} and signal ${signal}`, 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
            });
        } catch (e) {
            throw e;
        }
    }
    async getGasEstimate(coinbase, bytecode) {
        if(!coinbase) {
            const error = new Error('No coinbase selected!');
            throw error;
        }
        try {
            this.web3.eth.defaultAccount = coinbase;
            const gasEstimate = await this.web3.eth.estimateGas({
                from: this.web3.eth.defaultAccount,
                data: '0x' + bytecode,
            });
            return gasEstimate;
        } catch (e) {
            throw e;
        }
    }
    async setCoinbase(coinbase) {
        try {
            this.web3.eth.defaultAccount = coinbase;
        } catch(e) {
            throw e;
        }
    }
    async getBalance(coinbase) {
        if(!coinbase) {
            const error = new Error('No coinbase selected!');
            throw error;
        }
        try {
            const weiBalance = await this.web3.eth.getBalance(coinbase);
            const ethBalance = await this.web3.utils.fromWei(weiBalance, 'ether');
            return ethBalance;
        } catch(e) {
            throw e;
        }
    }
    async getSyncStat() {
        try {
            return this.web3.eth.isSyncing();
        } catch(e) {
            throw e;
        }
    }
    async create({...args}) {
        console.log('%c Creating contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        const coinbase = args.coinbase;
        const password = args.password;
        const abi = args.abi;
        const code = args.bytecode;
        const gasSupply = args.gas;

        if(!coinbase) {
            const error = new Error('No coinbase selected!');
            throw error;
        }
        this.web3.eth.defaultAccount = coinbase;
        try {
            if(password) {
                await this.web3.eth.personal.unlockAccount(coinbase, password);
            }
            try {
                const gasPrice = await this.web3.eth.getGasPrice();
                const contract = await new this.web3.eth.Contract(abi, {
                    from: this.web3.eth.defaultAccount,
                    data: '0x' + code,
                    gas: this.web3.utils.toHex(gasSupply),
                    gasPrice: this.web3.utils.toHex(gasPrice)
                });
                return contract;
            } catch (e) {
                console.log(e);
                throw e;
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    async deploy(contract, params) {
        console.log('%c Deploying contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        class ContractInstance extends EventEmitter {}
        const contractInstance = new ContractInstance();
        try {
            params = params.map(param => {
                return param.type.endsWith('[]') ? param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',') : param.value;
            });
            contract.deploy({
                arguments: params
            })
                .send({
                    from: this.web3.eth.defaultAccount
                })
                .on('transactionHash', transactionHash => {
                    contractInstance.emit('transactionHash', transactionHash);
                })
                .on('receipt', txReceipt => {
                    contractInstance.emit('receipt', txReceipt);

                })
                .on('confirmation', confirmationNumber => {
                    contractInstance.emit('confirmation', confirmationNumber);
                })
                .on('error', error => {
                    contractInstance.emit('error', error);
                })
                .then(instance => {
                    contractInstance.emit('address', instance.options.address);
                    contractInstance.emit('instance', instance);
                });
            return contractInstance;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    async call({...args}) {
        console.log('%c Web3 calling functions... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        const coinbase = args.coinbase;
        const password = args.password;
        const contract = args.contract;
        const abiItem = args.abiItem;
        var params = args.params || [];

        this.web3.eth.defaultAccount = coinbase;
        try {
            // Prepare params for call
            params = params.map(param => {
                if(param.type.endsWith('[]')) {
                    return param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',');
                }
                if(param.type.indexOf('int') > -1) {
                    return new this.web3.utils.BN(param.value);
                }
                return param.value;
            });

            // Handle fallback
            if(abiItem.type === 'fallback') {
                if(password) {
                    await this.web3.eth.personal.unlockAccount(coinbase, password);
                }
                const result = await this.web3.eth.sendTransaction({
                    from: coinbase,
                    to: contract.options.address,
                    value: abiItem.payableValue || 0
                });
                return result;
            }

            if(abiItem.constant === false || abiItem.payable === true) {
                if(password) {
                    await this.web3.eth.personal.unlockAccount(coinbase, password);
                }
                if(params.length > 0) {
                    const result = await contract.methods[abiItem.name](...params).send({ from: coinbase, value: abiItem.payableValue });
                    return result;
                }
                const result = await contract.methods[abiItem.name]().send({ from: coinbase, value: abiItem.payableValue });
                return result;
            }
            if(params.length > 0) {
                const result = await contract.methods[abiItem.name](...params).call({ from: coinbase });
                return result;
            }
            const result = await contract.methods[abiItem.name]().call({ from: coinbase });
            return result;
        }
        catch(e) {
            console.log(e);
            throw e;
        }
    }
    async send(to, amount, password) {
        return new Promise((resolve, reject) => {
            try {
                const coinbase = this.web3.eth.defaultAccount;
                if(password) {
                    this.web3.eth.personal.unlockAccount(coinbase, password);
                }
                this.web3.eth.sendTransaction({
                    from: coinbase,
                    to: to,
                    value: amount
                })
                    .on('transactionHash', txHash => {
                        this.showTransaction({ head: 'Transaction hash:', data: txHash });
                    })
                    .then(txRecipt => {
                        resolve(txRecipt);
                    })
                    .catch(e => {
                        reject(e);
                    });
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }
    async funcParamsToArray(contractFunction) {
        if(contractFunction && contractFunction.inputs.length > 0) {
            const inputElements = await Promise.all(contractFunction.inputs.map(async(input) => {
                return [input.type, input.name];
            }));
            return inputElements;
        }
        return [];
    }
    async inputsToArray(paramObject) {
        if(paramObject.type.endsWith('[]')) {
            return paramObject.value.split(',').map(val => this.web3.utils.toHex(val.trim()));
        }
        return this.web3.utils.toHex(paramObject.value);
    }
    showPanelError(err_message) {
        let messages;
        messages = new MessagePanelView({ title: 'Etheratom report' });
        messages.attach();
        messages.add(new PlainMessageView({ message: err_message, className: 'red-message' }));
    }
    showOutput({...args}) {
        const address = args.address;
        const data = args.data;
        const messages = new MessagePanelView({ title: 'Etheratom output' });
        messages.attach();
        messages.add(new PlainMessageView({
            message: 'Contract address: ' + address,
            className: 'green-message'
        }));
        if(data instanceof Object) {
            const rawMessage = `<h6>Contract output:</h6><pre>${JSON.stringify(data, null, 4)}</pre>`;
            messages.add(new PlainMessageView({
                message: rawMessage,
                raw: true,
                className: 'green-message'
            }));
            return;
        }
        messages.add(new PlainMessageView({
            message: 'Contract output: ' + data,
            className: 'green-message'
        }));
        return;
    }
    showTransaction({...args}) {
        const head = args.head;
        const data = args.data;
        const messages = new MessagePanelView({ title: 'Etheratom output' });
        messages.attach();
        messages.add(new PlainMessageView({
            message: head,
            className: 'green-message'
        }));
        if(data instanceof Object) {
            const rawMessage = `<pre>${JSON.stringify(data, null, 4)}</pre>`;
            messages.add(new PlainMessageView({
                message: rawMessage,
                raw: true,
                className: 'green-message'
            }));
            return;
        }
        messages.add(new PlainMessageView({
            message: data,
            className: 'green-message'
        }));
        return;
    }
    // Transaction analysis
    async getTxAnalysis(txHash) {
        try {
            const transaction = await this.web3.eth.getTransaction(txHash);
            const transactionRecipt = await this.web3.eth.getTransactionReceipt(txHash);
            return { transaction, transactionRecipt };
        } catch(e) {
            throw e;
        }
    }
    // Gas Limit
    async getGasLimit() {
        try {
            const block = await this.web3.eth.getBlock('latest');
            return block.gasLimit;
        } catch(e) {
            throw e;
        }
    }
    async getAccounts() {
        try {
            return await this.web3.eth.getAccounts();
        } catch (e) {
            throw e;
        }
    }
    async getMining() {
        try {
            return await this.web3.eth.isMining();
        } catch (e) {
            throw e;
        }
    }
    async getHashrate() {
        try {
            return await this.web3.eth.getHashrate();
        } catch (e) {
            throw e;
        }
    }
    async updateWeb3() {
        try {
            this.web3 = getWeb3Conn();
        } catch (e) {
            throw e;
        }
    }
}
