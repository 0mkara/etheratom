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
import Web3Helpers from './methods';
import { combineSource } from '../helpers/compiler-imports';
import { showPanelError } from '../helpers/uiHelpers';
import View from './view';


import {
    RESET_COMPILED,
    SET_COMPILING,
    SET_ERRORS,
    SET_EVENTS,
    SET_SOURCES
} from '../actions/types';
export default class Web3Env {
    constructor(store) {
        this.subscriptions = new CompositeDisposable();
        this.web3Subscriptions = new CompositeDisposable();
        this.saveSubscriptions = new CompositeDisposable();
        this.compileSubscriptions = new CompositeDisposable();

        // binding local functions
        this.checkReduxState = this.checkReduxState.bind(this);
        this.subscribeToWeb3Commands = this.subscribeToWeb3Commands.bind(this);
        this.subscribeToWeb3Events = this.subscribeToWeb3Events.bind(this);

        this.store = store;
        this.helpers = new Web3Helpers(this.store);
        this.havConnection = this.store.getState().clientReducer.clients[0].hasConnection;

        // Subscribing the redux state
        this.store.subscribe(this.checkReduxState);

        // subscribe to transaction through helpers
        this.helpers.subscribeTransaction();
        // subscribe to eth connection through helpers
        this.helpers.subscribeETHconnection();

        this.subscribeToWeb3Commands();
        this.subscribeToWeb3Events();
        this.helpers.checkConnection();
    }

    checkReduxState() {
        this.havConnection = this.store.getState().clientReducer.clients[0].hasConnection;
        let firstCheck = this.store.getState().clientReducer.clients[0].firstTimeCheck;
        if (this.havConnection && firstCheck) {
            this.subscribeToWeb3Events();
        }
    }

    dispose() {
        if (this.subscriptions) {
            this.subscriptions.dispose();
        }
        this.subscriptions = null;

        if (this.saveSubscriptions) {
            this.saveSubscriptions.dispose();
        }
        this.saveSubscriptions = null;

        if (this.web3Subscriptions) {
            this.web3Subscriptions.dispose();
        }
        this.web3Subscriptions = null;
    }
    destroy() {
        if (this.saveSubscriptions) {
            this.saveSubscriptions.dispose();
        }
        this.saveSubscriptions = null;

        if (this.compileSubscriptions) {
            this.compileSubscriptions.dispose();
        }
        this.compileSubscriptions = null;

        if (this.web3Subscriptions) {
            this.web3Subscriptions.dispose();
        }
        this.web3Subscriptions = null;
    }

    // Subscriptions
    subscribeToWeb3Commands() {

        if (!this.web3Subscriptions) {
            return;
        }
        this.web3Subscriptions.add(atom.commands.add('atom-workspace', 'eth-interface:compile', () => {
            if (this.compileSubscriptions) {
                this.compileSubscriptions.dispose();
            }
            this.compileSubscriptions = new CompositeDisposable();
            this.subscribeToCompileEvents();
        }));
    }
    async subscribeToWeb3Events() {
        if (!this.web3Subscriptions) {
            return;
        }
        const state = this.store.getState();
        const { clients } = state.clientReducer;
        const client = clients[0];
        this.view = new View(this.store);
        console.log(client);
        if (!client.hasConnection) {
            this.view.createLoaderView();
            this.view.createButtonsView();
            this.view.createTabView();
            this.view.createVersionSelector();
        } else if (client.hasConnection) {
            this.view.createCoinbaseView();
            this.view.createButtonsView();
            this.view.createTabView();
            this.view.createVersionSelector();
        }
        this.web3Subscriptions.add(atom.workspace.observeTextEditors((editor) => {
            if (!editor || !editor.getBuffer()) {
                return;
            }

            this.web3Subscriptions.add(atom.config.observe('etheratom.compileOnSave', (compileOnSave) => {
                if (this.saveSubscriptions) {
                    this.saveSubscriptions.dispose();
                }
                this.saveSubscriptions = new CompositeDisposable();
                if (compileOnSave) {
                    this.subscribeToSaveEvents();
                }
            }));
        }));
    }

    // Event subscriptions
    subscribeToSaveEvents() {
        if (!this.web3Subscriptions) {
            return;
        }
        this.saveSubscriptions.add(atom.workspace.observeTextEditors((editor) => {
            if (!editor || !editor.getBuffer()) {
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
        if (!this.web3Subscriptions) {
            return;
        }
        this.compileSubscriptions.add(atom.workspace.observeActiveTextEditor((editor) => {
            if (!editor || !editor.getBuffer()) {
                return;
            }
            this.compile(editor);
        }));
    }

    // common functions
    async setSources(editor) {
        const filePath = editor.getPath();
        const filename = filePath.replace(/^.*[\\/]/, '');
        const regexSol = /([a-zA-Z0-9\s_\\.\-\(\):])+(.sol|.solidity)$/g;
        const regexVyp = /([a-zA-Z0-9\s_\\.\-\(\):])+(.vy|.v.py|.vyper.py)$/g;
        if (filePath.match(regexSol) || filePath.match(regexVyp)) {
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
        } else {
            const err = new Error('file type is not recognized as solidity or vyper file');
            console.error(err);
            showPanelError(err);
        }
    }
    async compile(editor) {
        const filePath = editor.getPath();
        const regexVyp = /([a-zA-Z0-9\s_\\.\-\(\):])+(.vy|.v.py|.vyper.py)$/g;
        const regexSol = /([a-zA-Z0-9\s_\\.\-\(\):])+(.sol|.solidity)$/g;
        // Reset redux store
        // this.store.dispatch({ type: SET_COMPILED, payload: null });
        this.store.dispatch({ type: RESET_COMPILED });
        this.store.dispatch({ type: SET_ERRORS, payload: [] });
        this.store.dispatch({ type: SET_EVENTS, payload: [] });

        if (filePath.match(regexSol)) {
            console.log('%c Compiling contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
            this.store.dispatch({ type: SET_COMPILING, payload: true });
            try {
                const state = this.store.getState();
                const { sources } = state.files;
                delete sources['remix_tests.sol'];
                delete sources['tests.sol'];
                // TODO: delete _test files
                for (let filename in sources) {
                    if (/^(.+)(_test.sol)/g.test(filename)) {
                        delete sources[filename];
                    }
                }
                this.helpers.compileWeb3(sources);
                await this.helpers.getGasLimit();
            } catch (e) {
                console.error(e);
                showPanelError(e);
            }
        } else if(filePath.match(regexVyp)) {
            console.log('%c Compiling contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
            this.store.dispatch({ type: SET_COMPILING, payload: true });
            try {
                const state = this.store.getState();
                const { sources } = state.files;
                this.helpers.compileVyper(sources);
            } catch(e) {
                console.error(e);
                showPanelError(e);
            }
        } else {
            const err = new Error('file type is not recognized as solidity or vyper file');
            console.error(err);
            showPanelError(err);
            return;
        }
    }
}
