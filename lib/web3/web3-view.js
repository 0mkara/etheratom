'use babel'

import React from 'react'
import ReactDOM from 'react-dom'

export default class View {
	constructor(web3) {
		this.Accounts = [];
		this.coinbase = null;
		this.web3 = web3;
	}
	viewErrors(errors) {
		let errorViews = React.createClass({
			displayName: 'errorList',
			render: () => {
				return React.createElement('ul', {
					htmlFor: 'error-list',
					className: 'error-list error-messages block',
				}, errors.map((error) => {
					return React.createElement('li', {
						className: 'list-item'
					}, React.createElement('span', {
						className: 'icon icon-alert'
					}, error));
				}));
			}
		});
		ReactDOM.render(React.createElement(errorViews), document.getElementById('compiled-error'));
	}
	createCompilerOptionsView() {
		let createCompilerEnvList, compilers, selectedEnv;
		compilers = [{
			compiler: 'solcjs',
			desc: 'Javascript VM'
		}, {
			compiler: 'web3',
			desc: 'Backend ethereum node'
		}];
		createCompilerEnvList = React.createClass({
			displayName: 'envList',
			getInitialState: function() {
				return {
					selectedEnv: atom.config.get('etheratom.executionEnv')
				};
			},
			_handleChange: function(event) {
				atom.config.set('etheratom.executionEnv', event.target.value);
				this.setState({
					selectedEnv: event.target.value
				});
			},
			render: function() {
				var self;
				self = this;
				return React.createElement('div', {
					htmlFor: 'compiler-select'
				}, React.createElement('form', {
					className: 'icon icon-plug'
				}, compilers.map(function(compiler, i) {
					return React.createElement('label', {
						className: 'input-label inline-block highlight'
					}, React.createElement('input', {
						type: 'radio',
						uniqueName: "compilerOpt",
						className: 'input-radio',
						value: compiler.compiler,
						onChange: self._handleChange,
						checked: self.state.selectedEnv === compiler.compiler
					}, compiler.desc));
				})));
			}
		});
		ReactDOM.render(React.createElement(createCompilerEnvList), document.getElementById('compiler-options'));
	}
	createCoinbaseView() {
		let createAddressList;
		this.getAddresses((error, accounts) => {
			if(error) {
				console.error(error);
			} else {
				createAddressList = React.createClass({
					displayName: 'addressList',
					getInitialState: function() {
						return {
							account: accounts[0]
						};
					},
					_handleChange: function(event) {
						this.coinbase = event.target.value;
						return this.setState({
							account: this.coinbase
						});
					},
					render: function() {
						return React.createElement('div', {
							htmlFor: 'acc-n-pass',
							className: 'icon icon-link'
						}, React.createElement('select', {
							onChange: this._handleChange,
							value: this.state.account
						}, accounts.map(function(account, i) {
							return React.createElement('option', {
								value: account
							}, account);
						})));
					}
				});
				ReactDOM.render(React.createElement(createAddressList), document.getElementById('accounts-list'));
			}
		});
	}
	createButtonsView() {
		let workspaceElement = atom.views.getView(atom.workspace);
		let compileButton = React.createClass({
			displayName: 'compileButton',
			_handleSubmit: function() {
				return atom.commands.dispatch(workspaceElement, 'eth-interface:compile');
			},
			render: function() {
				return React.createElement('form', {
					onSubmit: this._handleSubmit
				}, React.createElement('input', {
					type: 'submit',
					value: 'Compile',
					className: 'btn btn-success'
				}, null));
			}
		});
		let makeButton = React.createClass({
			displayName: 'makeButton',
			_handleSubmit: function() {
				return atom.commands.dispatch(workspaceElement, 'eth-interface:build');
			},
			render: function() {
				return React.createElement('form', {
					onSubmit: this._handleSubmit
				}, React.createElement('input', {
					type: 'submit',
					value: 'Make',
					className: 'btn btn-warning'
				}, null));
			}
		});
		ReactDOM.render(React.createElement(compileButton, null), document.getElementById('compile_btn'));
		ReactDOM.render(React.createElement(makeButton, null), document.getElementById('make_btn'));
	}
	viewCompiled(compiled) {
		for(contractName in compiled) {
			let estimatedGas = this.web3.eth.estimateGas({
				from: this.web3.eth.defaultAccount,
				data: compiled[contractName].code,
				gas: 1000000
			});
			let bytecode = compiled[contractName].code;
			let ContractABI = compiled[contractName].info.abiDefinition;
			let inputs = [];
			for(abiObj in ContractABI) {
				if(ContractABI[abiObj].type === "constructor" && ContractABI[abiObj].inputs.length > 0) {
					inputs = ContractABI[abiObj].inputs;
				}
			}
			this.setContractView(contractName, bytecode, ContractABI, inputs, estimatedGas);
		}
	}
	setContractView(name, bc, abiDef, inputs, estimatedGas) {
		// Make view Reactive
		let att, bcNode, buttonText, bytecode, cNode, callButton, cnameNode, contractABI, contractName, createAddr, createButton, createStat, estimatedGasInput, input, inputText, inputsNode, lineBr, messageNode, textNode, title, varName;
		this.name = name;
		this.bytecode = bc;
		this.abiDef = abiDef;
		this.inputs = inputs;
		this.estimatedGas = estimatedGas;
		contractName = this.name;
		bytecode = JSON.stringify(this.bytecode);
		contractABI = JSON.stringify(this.abiDef);
		this.compiledNode = document.getElementById('compiled-code');

		cNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = contractName;
		cNode.classList.add('contract-display');
		cNode.setAttributeNode(att);

		cnameNode = document.createElement('span');
		cnameNode.classList.add('contract-name');
		cnameNode.classList.add('inline-block');
		cnameNode.classList.add('highlight-success');

		title = document.createTextNode(contractName);
		cnameNode.appendChild(title);
		cNode.appendChild(cnameNode);

		bcNode = document.createElement('div');
		bcNode.classList.add('byte-code');

		textNode = this.createTextareaR(bytecode);
		bcNode.appendChild(textNode);
		cNode.appendChild(bcNode);

		messageNode = document.createElement('div');
		messageNode.classList.add('abi-definition');

		textNode = this.createTextareaR(contractABI);
		messageNode.appendChild(textNode);
		cNode.appendChild(messageNode);

		inputsNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = contractName + '_inputs';
		inputsNode.setAttributeNode(att);
		for(input in this.inputs) {
			buttonText = document.createElement('button');
			buttonText.classList.add('input');
			buttonText.classList.add('text-subtle');
			varName = document.createTextNode(this.inputs[input].name);
			buttonText.appendChild(varName);
			inputsNode.appendChild(buttonText);
			inputText = document.createElement('input');
			att = document.createAttribute('id');
			att.value = this.inputs[input].name;
			inputText.setAttributeNode(att);
			inputText.setAttribute('type', 'text');
			inputText.classList.add('inputs');
			inputText.setAttribute('value', this.inputs[input].type);
			inputsNode.appendChild(inputText);
			lineBr = document.createElement('br');
			inputsNode.appendChild(lineBr);
		}
		cNode.appendChild(inputsNode);

		buttonText = document.createElement('button');
		buttonText.classList.add('input');
		buttonText.classList.add('text-subtle');

		varName = document.createTextNode("Estimated Gas");
		buttonText.appendChild(varName);
		inputsNode.appendChild(buttonText);

		estimatedGasInput = document.createElement('input');
		att = document.createAttribute('id');
		att.value = contractName + '_gas';
		estimatedGasInput.setAttributeNode(att);
		estimatedGasInput.setAttribute('type', 'number');
		estimatedGasInput.classList.add('inputs');
		estimatedGasInput.setAttribute('value', this.estimatedGas);
		inputsNode.appendChild(estimatedGasInput);

		createButton = document.createElement('div');
		att = document.createAttribute('id');
		att.value = contractName + '_create';
		createButton.setAttributeNode(att);
		inputsNode.appendChild(createButton);

		createStat = document.createElement('div');
		att = document.createAttribute('id');
		att.value = contractName + '_stat';
		createStat.setAttributeNode(att);
		cNode.appendChild(createStat);

		createAddr = document.createElement('div');
		att = document.createAttribute('id');
		att.value = contractName + '_address';
		createAddr.setAttributeNode(att);
		att = document.createAttribute('class');
		att.value = contractName;
		createAddr.setAttributeNode(att);
		cNode.appendChild(createAddr);

		callButton = document.createElement('div');
		att = document.createAttribute('id');
		att.value = contractName + '_call';
		callButton.setAttributeNode(att);
		cNode.appendChild(callButton);
		this.compiledNode.appendChild(cNode);
		return;
	}
	createTextareaR(text) {
		var textNode;
		this.text = text;
		textNode = document.createElement('pre');
		textNode.textContent = this.text;
		textNode.classList.add('large-code');
		return textNode;
	}
	getAddresses(callback) {
		return this.web3.eth.getAccounts(function(err, accounts) {
			if(err) {
				return callback('Error no base account!', null);
			} else {
				return callback(null, accounts);
			}
		});
	}
	reset() {
		this.compiledNode = document.getElementById('compiled-code');
		// Unset earlier compiled code
		while(this.compiledNode.firstChild) {
			this.compiledNode.removeChild(this.compiledNode.firstChild);
		}
	}
}
