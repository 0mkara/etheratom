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
import { CompositeDisposable } from 'atom'
import path from 'path'
import fs from 'fs'
import Web3 from 'web3'
import { connect } from 'react-redux'
import Web3Helpers from './methods'
import { combineSource } from '../helpers/compiler-imports'
import View from './view'
import { SET_COMPILED } from '../actions/types'

export default class Web3Env {
	constructor(store) {
		this.subscriptions = new CompositeDisposable();
		this.web3Subscriptions = new CompositeDisposable();
		this.saveSubscriptions = new CompositeDisposable();
		this.compileSubscriptions = new CompositeDisposable();
		this.store = store;
		this.observeConfig();
	}
	dispose() {
		if(this.subscriptions) {
			this.subscriptions.dispose()
		}
		this.subscriptions = null

		if(this.saveSubscriptions) {
			this.saveSubscriptions.dispose()
		}
		this.saveSubscriptions = null

		if(this.web3Subscriptions) {
			this.web3Subscriptions.dispose()
		}
		this.web3Subscriptions = null
	}
	destroy() {
		if(this.saveSubscriptions) {
			this.saveSubscriptions.dispose()
		}
		this.saveSubscriptions = null

		if(this.compileSubscriptions) {
			this.compileSubscriptions.dispose()
		}
		this.compileSubscriptions = null

		if(this.web3Subscriptions) {
			this.web3Subscriptions.dispose()
		}
		this.web3Subscriptions = null
	}
	observeConfig() {
		this.subscriptions.add(atom.config.observe('etheratom.executionEnv', (executionEnv) => {
			if(this.web3Subscriptions) {
				this.destroy();
			}
			this.web3Subscriptions = new CompositeDisposable();
			if(executionEnv == 'web3') {
				this.subscribeToWeb3Commands();
				this.subscribeToWeb3Events();
			} else {
				return;
			}
		}));
		this.subscriptions.add(atom.config.onDidChange('etheratom.executionEnv', (envChange) => {
			if(envChange.newValue !== 'web3') {
				this.destroy();
			}
			if(envChange.newValue == 'web3') {
				if(this.web3Subscriptions) {
					this.web3Subscriptions.dispose();
				}
				this.web3Subscriptions = new CompositeDisposable();
				this.subscribeToWeb3Commands();
				this.subscribeToWeb3Events();
			}
		}));
	}

	// Subscriptions
	subscribeToWeb3Commands() {
		if(!this.web3Subscriptions) {
			return
		}
		this.web3Subscriptions.add(atom.commands.add('atom-workspace', 'eth-interface:compile', () => {
			if(this.compileSubscriptions) {
				this.compileSubscriptions.dispose();
			}
			this.compileSubscriptions = new CompositeDisposable();
			this.subscribeToCompileEvents();
		}));
		this.web3Subscriptions.add(atom.commands.add('atom-workspace', 'eth-interface:make', () => {
			this.subscribeToMakeEvents();
		}));
	}
	subscribeToWeb3Events() {
		if(!this.web3Subscriptions) {
			return
		}
		rpcAddress = atom.config.get('etheratom.rpcAddress');
		if(typeof this.web3 !== 'undefined') {
			this.web3 = new Web3(this.web3.currentProvider);
		} else {
			this.web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(rpcAddress));
			this.helpers = new Web3Helpers(this.web3);
		}
		this.view = new View(this.store, this.web3);
		this.checkConnection((error, connection) => {
			if(error) {
				this.helpers.showPanelError(error);
			} else if(connection) {
				this.view.createCompilerOptionsView();
				this.view.createCoinbaseView();
				this.view.createButtonsView();
				this.view.createTabView();
			}
		});
		this.web3Subscriptions.add(atom.workspace.observeTextEditors((editor) => {
			if(!editor || !editor.getBuffer()) {
				return
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
			return
		}
		this.saveSubscriptions.add(atom.workspace.observeTextEditors((editor) => {
			if(!editor || !editor.getBuffer()) {
				return
			}

			const bufferSubscriptions = new CompositeDisposable()
			bufferSubscriptions.add(editor.getBuffer().onDidSave((filePath) => {
				this.compile(editor)
			}))
			bufferSubscriptions.add(editor.getBuffer().onDidDestroy(() => {
				bufferSubscriptions.dispose()
			}))
			this.saveSubscriptions.add(bufferSubscriptions)
		}));
	}
	subscribeToCompileEvents() {
		if(!this.web3Subscriptions) {
			return
		}
		this.compileSubscriptions.add(atom.workspace.observeTextEditors((editor) => {
			if(!editor || !editor.getBuffer()) {
				return
			}
			this.compile(editor);
		}));
	}
	subscribeToMakeEvents() {
		if(!this.compileSubscriptions) {
			return
		}
		this.make(this.compiled);
	}

	// common functions
	checkConnection(callback) {
		let haveConn;
		haveConn = this.web3.currentProvider;
		if(!haveConn) {
			return callback('Error could not connect to local geth instance!', null);
		} else {
			return callback(null, true);
		}
	}
	async compile(editor) {
		this.view.reset();
		const filePath = editor.getPath();
		const filename = filePath.replace(/^.*[\\\/]/, '');

		if(filePath.split('.').pop() == 'sol') {
			console.log("%c Compiling contract... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
			const dir = path.dirname(filePath);
			const source = await combineSource(dir, editor.getText());
			try {
				const compiled = await this.helpers.compileWeb3(source);
				this.store.dispatch({ type: SET_COMPILED, payload: compiled });
				if(compiled.errors) {
					this.view.viewErrors(compiled.errors);
				} else {
					this.compiled = compiled;
				}
			} catch (e) {
				this.helpers.showPanelError(e);
			}
		} else {
			return;
		}
	}
}
