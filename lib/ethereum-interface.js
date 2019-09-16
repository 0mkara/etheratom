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
import { AtomSolidityView } from './ethereum-interface-view';
import Web3Env from './web3/web3';
import configureStore from './helpers/configureStore';
import { CompositeDisposable } from 'atom';

export class Etheratom {
    constructor(props) {
        this.subscriptions = new CompositeDisposable();
        this.atomSolidityView = new AtomSolidityView();
        this.modalPanel = null;
        this.loaded = false;
        this.store = configureStore();
    }
    activate() {
        require('atom-package-deps').install('etheratom', true)
            .then(function() {
                console.log('All dependencies installed, good to go');
            });
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'eth-interface:toggle': ((_this) => {
                return function() {
                    _this.toggleView();
                };
            })(this),
            'eth-interface:activate': ((_this) => {
                return function() {
                    _this.toggleView();
                };
            })(this)
        }));
        this.modalPanel = atom.workspace.addRightPanel({
            item: this.atomSolidityView.getElement(),
            visible: false
        });
        // Initiate env
        this.load();
    }
    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.atomSolidityView.destroy();
    }
    load() {
        this.loadWeb3();
        this.loaded = true;
    }
    loadWeb3() {
        if (this.Web3Interface) {
            return this.Web3Interface;
        }
        this.Web3Interface = new Web3Env(this.store);
        this.subscriptions.add(this.Web3Interface);
        return this.Web3Interface;
    }
    toggleView() {
        if (this.modalPanel.isVisible()) {
            return this.modalPanel.hide();
        } else {
            return this.modalPanel.show();
        }
    }
}
