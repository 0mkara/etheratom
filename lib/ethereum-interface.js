'use babel'
import AtomSolidityView from './ethereum-interface-view'
import { CompositeDisposable } from 'atom'
import Web3Env from './web3/web3'

module.exports = AtomSolidity = {
	atomSolidityView: null,
	modalPanel: null,
	subscriptions: null,
	loaded: null,

	activate(state) {
		require('atom-package-deps').install('etheratom', showPrompt = true)
			.then(function() {
				console.log('All dependencies installed, good to go')
			})
		this.atomSolidityView = new AtomSolidityView(state.atomSolidityViewState);
		this.subscriptions = new CompositeDisposable;
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
		this.subscriptions = new CompositeDisposable;
		// Initiate env
		this.load();
	},
	deactivate() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.atomSolidityView.destroy();
	},
	serialize() {
		return {
			atomSolidityViewState: this.atomSolidityView.serialize()
		};
	},
	load() {
		this.loadVM()
		this.loadWeb3()
		this.loaded = true
	},
	loadVM() {
		if(this.testVM) {
			return this.testVM;
		}
		const { VMEnv } = require('./vm/vm')
		this.testVM = new VMEnv();
		this.subscriptions.add(this.testVM);
		return this.testVM;
	},
	loadWeb3() {
		if(this.Web3Interface) {
			return this.Web3Interface;
		}
		this.Web3Interface = new Web3Env();
		this.subscriptions.add(this.Web3Interface);
		return this.Web3Interface;
	},
	toggleView() {
		if(this.modalPanel.isVisible()) {
			return this.modalPanel.hide();
		} else {
			return this.modalPanel.show();
		}
	}
};
