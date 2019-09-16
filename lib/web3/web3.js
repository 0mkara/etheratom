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

// web3.js should be use to handle all web3 compilation events
// Every solidity file can be compiled in two ways jsvm and ethereum endpoint
// After every command is invoked compilation endpoint should be chosen
// If JsVM is compilation endpoint VM will be used to compile and execute solidity program

/*eslint no-useless-escape: "warn"*/
import { CompositeDisposable } from 'atom';
import path from 'path';
import Web3 from 'web3';
import Web3Helpers from './methods';
import { combineSource } from '../helpers/compiler-imports';
import { getWeb3Conn } from '../helpers/connectionHandler';
import { showPanelError } from '../helpers/uiHelpers';
import View from './view';

import {
    RESET_COMPILED,
    SET_COMPILING,
    SET_ERRORS,
    ADD_PENDING_TRANSACTION,
    SET_EVENTS,
    SET_GAS_LIMIT,
    SET_SYNC_STATUS,
    SET_SYNCING,
    SET_SOURCES
} from '../actions/types';

export default class Web3Env {
    constructor(store) {
        this.subscriptions = new CompositeDisposable();
        this.web3Subscriptions = new CompositeDisposable();
        this.saveSubscriptions = new CompositeDisposable();
        this.compileSubscriptions = new CompositeDisposable();
        this.store = store;
        this.subscribeToWeb3Commands();
        this.subscribeToWeb3Events();
    }
    dispose() {
        if(this.subscriptions) {
            this.subscriptions.dispose();
        }
        this.subscriptions = null;

        if(this.saveSubscriptions) {
            this.saveSubscriptions.dispose();
        }
        this.saveSubscriptions = null;

        if(this.web3Subscriptions) {
            this.web3Subscriptions.dispose();
        }
        this.web3Subscriptions = null;
    }
    destroy() {
        if(this.saveSubscriptions) {
            this.saveSubscriptions.dispose();
        }
        this.saveSubscriptions = null;

        if(this.compileSubscriptions) {
            this.compileSubscriptions.dispose();
        }
        this.compileSubscriptions = null;

        if(this.web3Subscriptions) {
            this.web3Subscriptions.dispose();
        }
        this.web3Subscriptions = null;
    }

    // Subscriptions
    subscribeToWeb3Commands() {
        if(!this.web3Subscriptions) {
            return;
        }
        this.web3Subscriptions.add(atom.commands.add('atom-workspace', 'eth-interface:compile', () => {
            if(this.compileSubscriptions) {
                this.compileSubscriptions.dispose();
            }
            this.compileSubscriptions = new CompositeDisposable();
            this.subscribeToCompileEvents();
        }));
    }
    async subscribeToWeb3Events() {
        if(!this.web3Subscriptions) {
            return;
        }
        if(typeof this.web3 !== 'undefined') {
            this.web3 = new Web3(this.web3.currentProvider);
        } else {
            this.web3 = getWeb3Conn();
        }
        this.view = new View(this.store);
        this.helpers = new Web3Helpers(this.store);
        if(Object.is(this.web3.currentProvider.constructor, Web3.providers.WebsocketProvider)) {
            console.log('%c Provider is websocket. Creating subscriptions... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
            // newBlockHeaders subscriber
            /*this.web3.eth.subscribe('newBlockHeaders')
                .on('data', (blocks) => {
                    console.log('%c newBlockHeaders:data ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                    console.log(blocks);
                })
                .on('error', (e) => {
                    console.log('%c newBlockHeaders:error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                    console.log(e);
                });*/
            // pendingTransactions subscriber
            this.web3.eth.subscribe('pendingTransactions')
                .on('data', (transaction) => {
                    /*console.log("%c pendingTransactions:data ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
					console.log(transaction);*/
                    this.store.dispatch({ type: ADD_PENDING_TRANSACTION, payload: transaction });
                })
                .on('error', (e) => {
                    console.log('%c pendingTransactions:error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                    console.log(e);
                });
            // syncing subscription
            this.web3.eth.subscribe('syncing')
                .on('data', (sync) => {
                    console.log('%c syncing:data ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                    console.log(sync);
                    if(typeof(sync) === 'boolean') {
                        this.store.dispatch({ type: SET_SYNCING, payload: sync });
                    }
                    if(typeof(sync) === 'object') {
                        this.store.dispatch({ type: SET_SYNCING, payload: sync.syncing });
                        const status = {
                            currentBlock: sync.status.CurrentBlock,
                            highestBlock: sync.status.HighestBlock,
                            knownStates: sync.status.KnownStates,
                            pulledStates: sync.status.PulledStates,
                            startingBlock: sync.status.StartingBlock
                        };
                        this.store.dispatch({ type: SET_SYNC_STATUS, payload: status });
                    }
                })
                .on('changed', (isSyncing) => {
                    console.log('%c syncing:changed ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                    console.log(isSyncing);
                })
                .on('error', (e) => {
                    console.log('%c syncing:error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                    console.log(e);
                });
        }
        this.checkConnection((error, connection) => {
            if(error) {
                showPanelError(error);
            } else if(connection) {
                this.view.createCoinbaseView();
                this.view.createButtonsView();
                this.view.createTabView();
                this.view.createVersionSelector();
            }
        });
        this.web3Subscriptions.add(atom.workspace.observeTextEditors((editor) => {
            if(!editor || !editor.getBuffer()) {
                return;
            }

            this.web3Subscriptions.add(atom.config.observe('etheratom.compileOnSave', (compileOnSave) => {
                if(this.saveSubscriptions) {
                    this.saveSubscriptions.dispose();
                }
                this.saveSubscriptions = new CompositeDisposable();
                if(compileOnSave) {
                    this.subscribeToSaveEvents();
                }
            }));
        }));
    }

    // Event subscriptions
    subscribeToSaveEvents() {
        if(!this.web3Subscriptions) {
            return;
        }
        this.saveSubscriptions.add(atom.workspace.observeTextEditors((editor) => {
            if(!editor || !editor.getBuffer()) {
                return;
            }

            const bufferSubscriptions = new CompositeDisposable();
            bufferSubscriptions.add(editor.getBuffer().onDidSave((filePath) => {
                this.setSources(editor);
            }));
            bufferSubscriptions.add(editor.getBuffer().onDidDestroy(() => {
                bufferSubscriptions.dispose();
            }));
            this.saveSubscriptions.add(bufferSubscriptions);
        }));
    }
    subscribeToCompileEvents() {
        if(!this.web3Subscriptions) {
            return;
        }
        this.compileSubscriptions.add(atom.workspace.observeTextEditors((editor) => {
            if(!editor || !editor.getBuffer()) {
                return;
            }
            this.compile(editor);
        }));
    }

    // common functions
    checkConnection(callback) {
        let haveConn;
        haveConn = this.web3.currentProvider;
        if(!haveConn) {
            return callback(new Error('Error could not connect to local geth instance!'), null);
        } else {
            return callback(null, true);
        }
    }
    async setSources(editor) {
        const filePath = editor.getPath();
        const filename = filePath.replace(/^.*[\\/]/, '');
        if(filePath.split('.').pop() == 'sol') {
            try {
                const dir = path.dirname(filePath);
                var sources = {};
                sources[filename] = { content: editor.getText() };
                sources = await combineSource(dir, sources);
                this.store.dispatch({ type: SET_SOURCES, payload: sources });
            } catch (e) {
                console.error(e);
                showPanelError(e);
            }
        }
    }
    async compile(editor) {
        const filePath = editor.getPath();
        // Reset redux store
        // this.store.dispatch({ type: SET_COMPILED, payload: null });
        this.store.dispatch({ type: RESET_COMPILED });
        this.store.dispatch({ type: SET_ERRORS, payload: [] });
        this.store.dispatch({ type: SET_EVENTS, payload: [] });

        if(filePath.split('.').pop() == 'sol') {
            console.log('%c Compiling contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
            this.store.dispatch({ type: SET_COMPILING, payload: true });
            try {
                const state = this.store.getState();
                const { sources } = state.files;
                delete sources['remix_tests.sol'];
                delete sources['tests.sol'];
                // TODO: delete _test files
                for(let filename in sources) {
                    if(/^(.+)(_test.sol)/g.test(filename)) {
                        delete sources[filename];
                    }
                }
                this.helpers.compileWeb3(sources);
                const gasLimit = await this.helpers.getGasLimit();
                this.store.dispatch({ type: SET_GAS_LIMIT, payload: gasLimit });
            } catch (e) {
                console.log(e);
                showPanelError(e);
            }
        } else {
            return;
        }
    }
}
