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
import TabView from '../components/TabView';
import CoinbaseView from '../components/CoinbaseView';
import VersionSelector from '../components/VersionSelector';
import CompileBtn from '../components/CompileBtn';
import { SET_ACCOUNTS, SET_COINBASE } from '../actions/types';
import LoaderView from '../components/LoaderView';

export default class View {
    constructor(store) {
        this.Accounts = [];
        this.coinbase = null;
        this.store = store;
        this.helpers = new Web3Helpers(this.store);
    }
    async createCoinbaseView() {
        try {
            await this.helpers.getAccounts();
            ReactDOM.render(<CoinbaseView store={this.store} helpers={this.helpers} />, document.getElementById('accounts-list'));
        } catch (e) {
            console.log(e);
            this.helpers.showPanelError('No account exists! Please create one.');
            this.store.dispatch({ type: SET_ACCOUNTS, payload: [] });
            this.store.dispatch({ type: SET_COINBASE, payload: '0x00' });
            ReactDOM.render(<CoinbaseView store={this.store} helpers={this.helpers} />, document.getElementById('accounts-list'));

            throw e;
        }
    }
    createButtonsView() {
        ReactDOM.render(
        <div>
            <CompileBtn store={this.store} />
            <label style={{marginTop: '5px'}}><b>Ctrl-S</b> to save and compile</label>
        </div>,
        document.getElementById('compile_btn'));
    }
    createTabView() {
        ReactDOM.render(<TabView store={this.store} helpers={this.helpers} />, document.getElementById('tab_view'));
    }
    createVersionSelector() {
        ReactDOM.render(<VersionSelector store={this.store} />, document.getElementById('version_selector'));
    }
    createLoaderView() {
        ReactDOM.render(<LoaderView store={this.store} />, document.getElementById('loader'));
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
