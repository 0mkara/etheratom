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

import md5 from 'md5';
import { MessagePanelView, PlainMessageView } from 'atom-message-panel';
import { fork } from 'child_process';
import { setMining } from '../actions';

import {
    SET_COMPILED,
    SET_COMPILING,
    ADD_PENDING_TRANSACTION,
    SET_SYNC_STATUS,
    SET_SYNCING,
    SET_BALANCE,
    SET_CONNECTION_STATUS,
    SET_ACCOUNTS,
    SET_COINBASE,
    SET_GAS_LIMIT,
    SET_GAS_ESTIMATE,
    SET_INSTANCE,
    TEXT_ANALYSIS,
    UPDATE_OPTIONS,
    ADD_TX_HASH,
    SET_DEPLOYED,
    UPDATE_INTERFACE,
    FIRST_TIME_CHECK_ENABLE
} from '../actions/types';


export default class Web3Helpers {
    constructor(store) {
        this.store = store;
        this.jobs = {
            // fileName: { solcWorker, hash }
        };
        this.contract;
        this.web3ProcessHandler = this.web3ProcessHandler.bind(this);
        this.setCoinbase = this.setCoinbase.bind(this);
        this.getCurrentClients = this.getCurrentClients.bind(this);
        this.showPanelError = this.showPanelError.bind(this);
        this.showPanelSuccess = this.showPanelSuccess.bind(this);
        this.hookWeb3ChildProcess = this.createWeb3Connection();
        this.setDefaultAccount = this.setDefaultAccount.bind(this);

        // sending rpc or ws address to create ethereum connection
        const rpcAddress = atom.config.get('etheratom.rpcAddress');
        const websocketAddress = atom.config.get('etheratom.websocketAddress');
        this.hookWeb3ChildProcess.send({ action: 'set_rpc_ws', rpcAddress, websocketAddress });
        // handle the web3 child process responses
        this.web3ProcessHandler();
    }
    /* ================================ Web3js CHILD PROCESS communication START ================================== */
    createWeb3Connection() {
        const pkgPath = atom.packages.resolvePackagePath('etheratom');
        return fork(`${pkgPath}/lib/web3/web3Worker.js`);
    }

    killWeb3Connection() {
        if (this.hookWeb3ChildProcess !== 'undefined') {
            this.hookWeb3ChildProcess.kill();
        } else {
            return;
        }
    }

    subscribeTransaction() {
        this.hookWeb3ChildProcess.send({ action: 'subscribeTransaction' });
    }

    subscribeETHconnection() {
        this.hookWeb3ChildProcess.send({ action: 'ethSubscription' });
    }
    getBalance(coinbase) {
        this.hookWeb3ChildProcess.send({ action: 'get_balances', coinbase });
    }

    async setDefaultAccount(coinbase) {
        this.hookWeb3ChildProcess.send({ action: 'default_account_set', coinbase });
    }
    async getGasEstimate(coinbase, bytecode) {
        this.hookWeb3ChildProcess.send({ action: 'getGasEstimate', coinbase, bytecode });
    }

    web3ProcessHandler() {
        this.hookWeb3ChildProcess.on('message', message => {
            console.log('%c New Message:', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', message);
            if (message.hasOwnProperty('transaction')) {
                this.store.dispatch({ type: ADD_PENDING_TRANSACTION, payload: message.transaction });
                if (message.hasOwnProperty('transactionRecipt')) {
                    this.store.dispatch({ type: TEXT_ANALYSIS, payload: message });
                }
            } else if (message.hasOwnProperty('isBooleanSync')) {
                this.store.dispatch({ type: 'set_syncing', payload: message['isBooleanSync'] });
            } else if (message.hasOwnProperty('isObjectSync')) {
                const sync = message['isObjectSync'];
                this.store.dispatch({ type: SET_SYNCING, payload: sync.syncing });
                const status = {
                    currentBlock: sync.status.CurrentBlock,
                    highestBlock: sync.status.HighestBlock,
                    knownStates: sync.status.KnownStates,
                    pulledStates: sync.status.PulledStates,
                    startingBlock: sync.status.StartingBlock
                };
                this.store.dispatch({ type: SET_SYNC_STATUS, payload: status });
            } else if (message.hasOwnProperty('syncStarted') && message['syncStarted']) {
                console.log('%c syncing:data ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
            } else if (message.hasOwnProperty('isSyncing')) {
                console.log('%c syncing:changed ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                this.store.dispatch({ type: SET_SYNC_STATUS, payload: message['isSyncing'] });
            } else if (message.hasOwnProperty('ethBalance')) {
                this.store.dispatch({ type: SET_BALANCE, payload: message['ethBalance'] });
            } else if (message.hasOwnProperty('hasConnection')) {
                let clients = this.getCurrentClients();
                clients[0].hasConnection = message['hasConnection'];
                this.store.dispatch({ type: SET_CONNECTION_STATUS, payload: clients });
                clients[0].firstTimeCheck = false;
                this.store.dispatch({ type: FIRST_TIME_CHECK_ENABLE, payload: clients });
            }
            else if (message.hasOwnProperty('isWsProvider')) {
                let clients = this.getCurrentClients();
                clients[0].isWsProvider = message['isWsProvider'];
                this.store.dispatch({ type: 'is_ws_provider', payload: clients });
            }
            else if (message.hasOwnProperty('isHttpProvider')) {
                let clients = this.getCurrentClients();
                clients[0].isHttpProvider = message['isHttpProvider']
                this.store.dispatch({ type: 'is_http_provider', payload: clients });
            }
            else if (message.hasOwnProperty('accounts')) {
                this.store.dispatch({ type: SET_ACCOUNTS, payload: message.accounts });
                this.store.dispatch({ type: SET_COINBASE, payload: message.accounts[0] });
            }
            else if (message.hasOwnProperty('getAccountsForNodeSubmit')) {
                let clients = this.getCurrentClients();
                try {
                    this.store.dispatch({ type: SET_ACCOUNTS, payload: message.getAccountsForNodeSubmit });
                    this.store.dispatch({ type: SET_COINBASE, payload: message.getAccountsForNodeSubmit[0] });
                    if (message['node_type'] === 'node_ws') {
                        this.showPanelSuccess('Connection Re-established with Web socket');
                        clients[0].isWsProvider = true;
                        clients[0].isHttpProvider = false;
                        this.store.dispatch({ type: 'is_ws_provider', payload: clients });
                    } else if (message['node_type'] === 'node_rpc') {
                        this.showPanelSuccess('Connection Re-established with rpc');
                        clients[0].isHttpProvider = true;
                        clients[0].isWsProvider = false;
                        this.store.dispatch({ type: 'is_http_provider', payload: clients });
                    }
                }
                catch (e) {
                    if (message['node_type'] === 'node_ws') {
                        this.showPanelError('Error with RPC value. Please check again');
                    } else if (message['node_type'] === 'node_rpc') {
                        this.showPanelError('Error with Web Socket value. Please check again');
                    }
                    this.store.dispatch({ type: SET_ACCOUNTS, payload: [] });
                    this.store.dispatch({ type: SET_COINBASE, payload: '0x00' });
                    setMining(false);
                }

            }
            else if (message.hasOwnProperty('isMining')) {
                setMining(message['isMining']);
            }
            else if (message.hasOwnProperty('getHashrate')) {
                this.store.dispatch({ type: 'set_hash_rate', payload: message['getHashrate'] });
            }
            else if (message.hasOwnProperty('gasLimit')) {
                this.store.dispatch({ type: SET_GAS_LIMIT, payload: message['gasLimit'] });
            } else if (message.hasOwnProperty('options')) {
              const options = message['options'];
              const contractName = message['contractName'];
              this.store.dispatch({ type: UPDATE_OPTIONS, payload: { contractName, options } });
              if(options.address) {
                this.store.dispatch({ type: SET_DEPLOYED, payload: { contractName, deployed: true } });
              }
            }
            else if (message.hasOwnProperty('transactionHash')) {
                const transactionHash = message['transactionHash'];
                const contractName = message['contractName'];
                this.store.dispatch({ type: ADD_TX_HASH, payload: { transactionHash, contractName } });
                this.store.dispatch({ type: SET_DEPLOYED, payload: { contractName, deployed: true } });
            } else if (message.hasOwnProperty('txReceipt')) {
                // console.log(message['txReceipt']);
            } else if (message.hasOwnProperty('confirmationNumber')) {
                // console.log(message['confirmationNumber']);
            } else if (message.hasOwnProperty('logsEvents')) {
                // console.log(message['logsEvents']);
            } else if (message.hasOwnProperty('dataEvents')) {
                // console.log(message.hasOwnProperty('dataEvents'));
            } else if (message.hasOwnProperty('changedEvent')) {
                // console.log(message['changedEvent']);
            } else if (message.hasOwnProperty('gasEstimate')) {
                const gasEstimate = message['gasEstimate'];
                this.store.dispatch({ type: SET_GAS_ESTIMATE, payload: { gasEstimate } });
            } else if (message.hasOwnProperty('contractObject')) {
                this.contract = message['contractObject']['contract'];
                const instance = message['contractObject']['contract'];
                const contractName = message['contractObject']['contractName'];
                this.store.dispatch({ type: SET_INSTANCE, payload: { contractName, instance } });
            } else if (message.hasOwnProperty('jsonInterface')) {
              const contractName = message['contractName'];
              const jsonInterface = message['jsonInterface'];
              this.store.dispatch({ type: UPDATE_INTERFACE, payload: { contractName, interface: jsonInterface } });
            } else if (message.hasOwnProperty('callResult')) {
                const address = message['address'];
                const data = message['callResult'];
                this.showOutput({ address, data });
            } else if (message.hasOwnProperty('transactionHashonSend')) {
                this.showTransaction({ head: 'Transaction hash:', data: message['transactionHashonSend'] });
            } else if (message.hasOwnProperty('txReciptonSend')) {
                this.showTransaction({ head: 'Transaction recipt:', data: message['txReciptonSend'] });
            } else if (message.hasOwnProperty('error')) {
                console.log('%c Error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', message);
                this.showPanelError(message.error);
            }
        });
    }

    getCurrentClients() {
        let clients = [
            {
                provider: this.store.getState().clientReducer.clients[0].provider,
                desc: this.store.getState().clientReducer.clients[0].desc,
                hasConnection: this.store.getState().clientReducer.clients[0].hasConnection,
                firstTimeCheck: this.store.getState().clientReducer.clients[0].firstTimeCheck,
                isWsProvider: this.store.getState().clientReducer.clients[0].isWsProvider,
                isHttpProvider: this.store.getState().clientReducer.clients[0].isHttpProvider
            }
        ];
        return clients;
    }

    async checkConnection() {
        this.hookWeb3ChildProcess.send({ action: 'check_connection' });
    }

    async isWsProvider() {
        this.hookWeb3ChildProcess.send({ action: 'isWsProvider' });
    }
    async isHttpProvider() {
        this.hookWeb3ChildProcess.send({ action: 'isHttpProvider' });
    }
    // WEB3 JS CHILD PROCESS END ==========================================================================================
    createWorker(fn) {
        const pkgPath = atom.packages.resolvePackagePath('etheratom');
        return fork(`${pkgPath}/lib/web3/worker.js`);
    }

    createVyperWorker(fn) {
        const pkgPath = atom.packages.resolvePackagePath('etheratom');
        return fork(`${pkgPath}/lib/web3/vyp-worker.js`);
    }

    async compileWeb3(sources) {
        let fileName = Object.keys(sources).find(key => {
            return /\.sol/.test(key);
        });
        let hashId = md5(sources[fileName].content);
        if (this.jobs[fileName]) {
            if (this.jobs[fileName].hashId === hashId || this.jobs[fileName].hashId === undefined) {
                this.jobs[fileName].wasBusy = true;
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
                if (m.compiled) {
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

    async compileVyper(sources) {
		// TODO: vyper compiler code goes bellow, as follows
        const vyperWorker = this.createVyperWorker();

		vyperWorker.on('message', (m) => {
			if (m.compiled) {
                this.store.dispatch({ type: SET_COMPILED, payload: JSON.parse(m.compiled) });
                this.store.dispatch({ type: SET_COMPILING, payload: false });
			}
        });
        vyperWorker.send({
			command: 'compile',
			source: sources,
			version: this.version
		});
    }

    async setCoinbase(coinbase) {
        this.hookWeb3ChildProcess.send({ action: 'set_coinbase', coinbase });
    }

    async getSyncStat() {
        this.hookWeb3ChildProcess.send({ action: 'sync_stat' });
    }
    async create(args) {
        console.log('%c Creating contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        this.hookWeb3ChildProcess.send({ action: 'create', argumentsForCreate: args });
    }

    async call(args) {
        console.log('%c Web3 calling functions... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        try {
            this.hookWeb3ChildProcess.send({ action: 'callDeployedContract', argumentsForCall: args });
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    async send(to, amount, password) {
        let params = { to, amount, password };
        this.hookWeb3ChildProcess.send({ action: 'sendTransaction', params });
    }
    async funcParamsToArray(contractFunction) {
        if (contractFunction && contractFunction.inputs.length > 0) {
            const inputElements = await Promise.all(contractFunction.inputs.map(async(input) => {
                return [input.type, input.name];
            }));
            return inputElements;
        }
        return [];
    }
    async inputsToArray(paramObject) {
        this.hookWeb3ChildProcess.send({ action: 'inputsToArray', paramObject });
    }
    showPanelError(err_message) {
        let messages;
        messages = new MessagePanelView({ title: 'Etheratom report' });
        messages.attach();
        messages.add(new PlainMessageView({ message: err_message, className: 'red-message' }));
    }
    showPanelSuccess(err_message) {
        let messages;
        messages = new MessagePanelView({ title: 'Etheratom report' });
        messages.attach();
        messages.add(new PlainMessageView({ message: err_message, className: 'green-message' }));
    }
    showOutput({ ...args }) {
        const address = args.address;
        const data = args.data;
        const messages = new MessagePanelView({ title: 'Etheratom output' });
        messages.attach();
        messages.add(new PlainMessageView({
            message: 'Contract address: ' + address,
            className: 'green-message'
        }));
        if (data instanceof Object) {
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
    showTransaction({ ...args }) {
        const head = args.head;
        const data = args.data;
        const messages = new MessagePanelView({ title: 'Etheratom output' });
        messages.attach();
        messages.add(new PlainMessageView({
            message: head,
            className: 'green-message'
        }));
        if (data instanceof Object) {
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
        this.hookWeb3ChildProcess.send({ action: 'getTxAnalysis', txHash });
    }
    // Gas Limit
    async getGasLimit() {
        this.hookWeb3ChildProcess.send({ action: 'getGasLimit' });
    }
    async getAccounts() {
        this.hookWeb3ChildProcess.send({ action: 'getAccounts' });
    }
    async getAccountsForNodeSubmit(node_string, node_url) {
        this.hookWeb3ChildProcess.send({ action: 'getAccountsForNodeSubmit', node_type: node_string, node_url });
    }
    async getMining() {
        this.hookWeb3ChildProcess.send({ action: 'getMiningStatus' });
    }
    async getHashrate() {
        this.hookWeb3ChildProcess.send({ action: 'getHashrateStatus' });
    }
}
