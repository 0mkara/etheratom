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
import ReactDOM from 'react-dom';
import Web3Helpers from './methods';
import ClientSelector from '../components/ClientSelector';
import TabView from '../components/TabView';
import CoinbaseView from '../components/CoinbaseView';
import CompileBtn from '../components/CompileBtn';
import { SET_ACCOUNTS, SET_COINBASE } from '../actions/types';

export default class View {
	constructor(store, web3) {
		this.Accounts = [];
		this.coinbase = null;
		this.web3 = web3;
		this.store = store;
		this.helpers = new Web3Helpers(this.web3);
	}
	createCompilerOptionsView() {
		ReactDOM.render(<ClientSelector store={this.store} />, document.getElementById('client-options'));
	}
	async createCoinbaseView() {
		try {
			const accounts = await this.web3.eth.getAccounts();
			this.store.dispatch({ type: SET_ACCOUNTS, payload: accounts });
			this.store.dispatch({ type: SET_COINBASE, payload: accounts[0] });
			ReactDOM.render(<CoinbaseView store={this.store} helpers={this.helpers} />, document.getElementById('accounts-list'));
		} catch (e) {
			console.log(e);
			this.helpers.showPanelError('No account exists! Please create one.');
			throw e;
		}
	}
	createButtonsView() {
		ReactDOM.render(<CompileBtn store={this.store} />, document.getElementById('compile_btn'));
	}
	createTabView() {
		ReactDOM.render(<TabView store={this.store} helpers={this.helpers}/>, document.getElementById('tab_view'));
	}
	createTextareaR(text) {
		var textNode;
		this.text = text;
		textNode = document.createElement('pre');
		textNode.textContent = this.text;
		textNode.classList.add('large-code');
		return textNode;
	}
}
