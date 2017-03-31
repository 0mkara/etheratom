'use babel'

import React from 'react'
import ReactDOM from 'react-dom'
import Web3Helpers from './methods'

export default class View {
	constructor(web3) {
		this.Accounts = [];
		this.coinbase = null;
		this.web3 = web3;
		this.helpers = new Web3Helpers(this.web3);
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
		let createAddressList, self;
		self = this;
		this.getAddresses((error, accounts) => {
			if(error) {
				console.error(error);
			} else {
				this.coinbase = accounts[0];
				class createAddressList extends React.Component {
					constructor() {
						super();
						this.state = { account: accounts[0], password: '' };
						this._handleAccChange = this._handleAccChange.bind(this);
						this._handlePasswordChange = this._handlePasswordChange.bind(this);
						this._handleUnlock = this._handleUnlock.bind(this);
					}
					_handleAccChange(event) {
						self.coinbase = event.target.value;
						this.setState({ account: event.target.value });
					}
					_handlePasswordChange(event) {
						this.setState({ password: event.target.value });
						// TODO: unless we show some indicator on `Unlock` let password set on change
						self.password = this.state.password;
					}
					_handleUnlock(event) {
						// TODO: here try to unlock geth backend node using coinbase and password and show result
						self.password = this.state.password;
						event.preventDefault();
					}
					render() {
						return React.createElement('div', {
							htmlFor: 'acc-n-pass',
							className: 'icon icon-link'
						}, React.createElement('select', {
							onChange: this._handleAccChange,
							value: this.state.account
						}, accounts.map(function(account, i) {
							return React.createElement('option', {
								value: account
							}, account);
						})), React.createElement('form', {
							onSubmit: this._handleUnlock,
							className: 'icon icon-lock'
						}, React.createElement('input', {
							type: 'password',
							uniqueName: "password",
							placeholder: "Password",
							value: this.state.password,
							onChange: this._handlePasswordChange
						}), React.createElement('input', {
							type: 'submit',
							value: 'Unlock'
						})));
					}
				};
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
				return atom.commands.dispatch(workspaceElement, 'eth-interface:make');
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
		//ReactDOM.render(React.createElement(makeButton, null), document.getElementById('make_btn'));
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
	setContractView(contractName, bytecode, abiDef, constructorParams, estimatedGas) {
		// Make view Reactive
		let params, compiledNode, cNode, att, self;
		self = this;
		params = [];
		compiledNode = document.getElementById('compiled-code');
		cNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = contractName;
		cNode.classList.add('contract-container');
		cNode.setAttributeNode(att);

		/*createStat = document.createElement('div');
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
		cNode.appendChild(callButton);*/
		this.compiledNode.appendChild(cNode);

		// Create contract view with react
		class contractNameHeader extends React.Component {
			constructor() {
				super();
			}
			render() {
				return React.createElement('span', {
					className: 'contract-name inline-block highlight-success'
				}, contractName);
			}
		};
		class byteCodeText extends React.Component {
			constructor() {
				super();
			}
			render() {
				return React.createElement('div', {
					className: 'byte-code'
				}, React.createElement('pre', {
					className: 'large-code'
				}, JSON.stringify(bytecode)));
			}
		};
		class abi_def extends React.Component {
			constructor() {
				super();
			}
			render() {
				return React.createElement('div', {
					className: 'abi-definition'
				}, React.createElement('pre', {
					className: 'large-code'
				}, JSON.stringify(abiDef)));
			}
		};
		class inputsForm extends React.Component {
			constructor() {
				super();
				this._handleChange = this._handleChange.bind(this);
			}
			_handleChange(event) {
				params[event.target.id] = event.target.value;
			}
			render() {
				return React.createElement('div', {
					id: contractName + '_inputs'
				}, constructorParams.map((input, i) => {
					return React.createElement('form', {
						key: i,
						ref: input.name
					}, React.createElement('button', {
						className: 'input text-subtle'
					}, input.name), React.createElement('input', {
						onChange: this._handleChange,
						id: input.name,
						type: 'text',
						className: 'inputs',
						placeholder: input.type
					}));
				}));
			}
		};
		class estmGas extends React.Component {
			constructor() {
				super();
				this.state = { estimatedGas: estimatedGas };
				this._handleChange = this._handleChange.bind(this);
			}
			_handleChange(event) {
				estimatedGas = event.target.value;
				this.setState({ estimatedGas: event.target.value });
			}
			render() {
				return React.createElement('form', {
					className: 'gas-estimate-form'
				}, React.createElement('button', {
					className: 'input text-subtle'
				}, 'Estimated Gas'), React.createElement('input', {
					onChange: this._handleChange,
					id: contractName + '_gas',
					type: 'number',
					className: 'inputs',
					value: this.state.estimatedGas
				}));
			}
		};
		class executeButton extends React.Component {
			constructor() {
				super();
				this._handleSubmit = this._handleSubmit.bind(this);
			}
			_handleSubmit() {
				console.log(self.helpers);
				self.helpers.create(self.coinbase, self.password, abiDef, bytecode, params, contractName, estimatedGas)
					.then((success) => {
						console.log("Resolved");
					})
			}
			render() {
				return React.createElement('form', {
					onSubmit: this._handleSubmit
				}, React.createElement('input', {
					type: 'submit',
					value: 'Create',
					ref: contractName,
					className: 'btn btn-primary inline-block-tight'
				}, null));
			}
		};

		// Add all elements to contract-content and finally render DOM
		class compiledCodeContent extends React.Component {
			constructor() {
				super();
			}
			render() {
				return React.createElement(
					'div', { className: 'contract-content' },
					React.createElement(contractNameHeader),
					React.createElement(byteCodeText),
					React.createElement(abi_def),
					React.createElement(inputsForm),
					React.createElement(estmGas),
					React.createElement(executeButton)
				);
			}
		};
		ReactDOM.render(React.createElement(compiledCodeContent), document.getElementById(contractName));
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
