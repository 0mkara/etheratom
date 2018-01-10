'use babel'

import EthJSVM from 'ethereumjs-vm'
import ethJSUtil from 'ethereumjs-util'
import React from 'react'
import createReactClass from 'create-react-class'
import ReactDOM from 'react-dom'
import VmHelpers from './methods'

export default class View {
	constructor(vm) {
		this.vmAccounts = [];
		this.coinbase = null;
		this.vm = vm;
		this.helpers = new VmHelpers(this.vm, this.vmAccounts);
	}
	viewErrors(errors) {
		let errorViews = createReactClass({
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
		createCompilerEnvList = createReactClass({
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
				},
					React.createElement('form', {
						className: 'row'
					},
						React.createElement('div', {
							className: 'icon icon-plug'
						}),
						React.createElement('div', {
							className: 'compilers'
						},
							compilers.map(function(compiler, i) {
								return React.createElement('label', {
									className: 'input-label inline-block highlight'
								}, React.createElement('input', {
									type: 'radio',
									uniqueName: "compilerOpt",
									className: 'input-radio',
									value: compiler.compiler,
									onChange: self._handleChange,
									checked: self.state.selectedEnv === compiler.compiler
								}), React.createElement('span', {
									null
								}, compiler.desc));
							})
						)
					)
				)
			}
		});
		ReactDOM.render(React.createElement(createCompilerEnvList), document.getElementById('compiler-options'));
	}
	createCoinbaseView() {
		let keyArr, accounts, self;
		self = this;
		keyArr = [];
		keyArr.push('3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511');
		keyArr.push('2ac6c190b09897cd8987869cc7b918cfea07ee82038d492abce033c75c1b1d0c');
		keyArr.push('dae9801649ba2d95a21e688b56f77905e5667c44ce868ec83f82e838712a2c7a');
		keyArr.push('d74aa6d18aa79a05f3473dd030a97d3305737cbc8337d940344345c1f6b72eea');
		keyArr.push('71975fbf7fe448e004ac7ae54cad0a383c3906055a65468714156a07385e96ce');
		accounts = self.addAccounts(keyArr);
		// 1st account is default VM account
		self.coinbase = accounts[0];
		class createAddressList extends React.Component {
			constructor() {
				super();
				this.state = { account: accounts[0] };
				this._handleAccChange = this._handleAccChange.bind(this);
				this._linkClick = this._linkClick.bind(this);
			}
			_linkClick(event) {
				atom.clipboard.write(this.state.account);
			}
			_handleAccChange(event) {
				self.coinbase = event.target.value;
				this.setState({ account: self.coinbase });
			}
			render() {
				return (
					React.createElement('div', {
						htmlFor: 'acc-n-pass',
					},
						React.createElement('div', {
							className: 'row'
						},
							React.createElement('div', {
								className: 'icon icon-link btn copy-btn btn-success',
								onClick: this._linkClick
							}),
							React.createElement('select', {
								onChange: this._handleAccChange,
								value: this.state.account
							}, accounts.map(function(account, i) {
								return React.createElement('option', {
									value: account
								}, account);
							}))
						)
					)
				)
			}
		};
		ReactDOM.render(React.createElement(createAddressList), document.getElementById('accounts-list'));
	}
	createButtonsView() {
		let workspaceElement = atom.views.getView(atom.workspace);
		let compileButton = createReactClass({
			displayName: 'compileButton',
			_handleSubmit: function() {
				return atom.commands.dispatch(workspaceElement, 'eth-interface:compile');
			},
			render: function() {
				return React.createElement('form', {
					className: 'row',
					onSubmit: this._handleSubmit
				}, React.createElement('input', {
					type: 'submit',
					value: 'Compile',
					className: 'btn copy-btn btn-success'
				}, null));
			}
		});
		ReactDOM.render(React.createElement(compileButton, null), document.getElementById('compile_btn'));
	}
	addAccounts(keyArr) {
		let accounts, address, key, privateKey, that;
		accounts = [];
		for(key in keyArr) {
			privateKey = new Buffer(keyArr[key], 'hex');
			address = ethJSUtil.privateToAddress(privateKey).toString('hex');
			this.vm.stateManager.putAccountBalance(address, '999999999999999000000000000000000', function(error, result) {});
			this.vmAccounts['0x' + address] = {
				privateKey: privateKey,
				nonce: 0
			};
			accounts.push(address);
		}
		return accounts;
	}
	viewCompiled(compiled) {
		for(contractName in compiled.contracts) {
			let bytecode = compiled.contracts[contractName].bytecode;
			let ContractABI = JSON.parse(compiled.contracts[contractName]["interface"]);
			let estimatedGas = 4700000;
			inputs = [];
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
		compiledNode.appendChild(cNode);

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
			async _handleSubmit() {
				try {
					const contract = await self.helpers.create(self.coinbase, abiDef, bytecode, params, contractName, estimatedGas);
					self.setExecutionView(contractName, abiDef, bytecode, constructorParams, params, contract);
				}
				catch(e) {
					self.helpers.showPanelError(e);
				}
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
	}
	setExecutionView(contractName, abiDef, bytecode, constructorParams, params, contract) {
		let self;
		self = this;
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
		class mineStat extends React.Component {
			constructor() {
				super();
			}
			render() {
				if(!contract.createdAddress) {
					// Waiting to be mined
					error = new Error('VM code executed but contract address not found.');
					self.helpers.showPanelError(error);
				} else if(contract.createdAddress) {
					return React.createElement('div', {
						id: contractName + '_stat'
					}, React.createElement('div', {
						htmlFor: 'contractStat'
					}, React.createElement('span', {
						className: 'inline-block highlight'
					}, 'Mined at: '), React.createElement('pre', {
						className: 'large-code'
					}, '0x' + contract.createdAddress.toString('hex'))));
				}
			}
		};
		class inputsForm extends React.Component {
			constructor() {
				super();
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
						id: input.name,
						type: 'text',
						className: 'inputs',
						placeholder: input.type,
						value: params[input.name],
						readOnly: true
					}));
				}));
			}
		};
		class functionABI extends React.Component {
			constructor() {
				super();
				this.state = { childFunctions: [] };
				this._handleChange = this._handleChange.bind(this);
			}
			async componentDidMount() {
				try {
					const childFunctions = JSON.stringify(await self.helpers.constructFunctions(abiDef))
					this.setState({ childFunctions: JSON.parse(childFunctions) });
				} catch (e) {
					self.helpers.showPanelError(e);
				}
			}
			_handleChange(event) {
				this.setState({ value: event.target.value });
			}
			async _handleSubmit(methodItem) {
				try {
					// TODO: get input params into array if no params set empty
					const params = await self.helpers.inputsToArray(this.refs, methodItem.name);
					const result = await self.helpers.call(self.coinbase, contract, abiDef, methodItem, params);
					const outputTypes = await self.helpers.getOutputTypes(methodItem);
					self.helpers.showOutput(contract.createdAddress.toString('hex'), outputTypes, result);
				} catch(e) {
					console.log(e);
					self.helpers.showPanelError(e);
				}
			}
			render() {
				return React.createElement('div', {
					htmlFor: 'contractFunctions'
				}, this.state.childFunctions.map((childFunction, i) => {
					return React.createElement('form', {
						onSubmit: this._handleSubmit.bind(this, childFunction.interface),
						key: i,
						ref: childFunction.interface.name
					}, React.createElement('input', {
						type: 'submit',
						value: childFunction.interface.name,
						className: 'text-subtle call-button'
					}), childFunction.params.map((childInput, j) => {
						return React.createElement('input', {
							name: childInput[0],
							tye: 'text',
							handleChange: this._handleChange,
							placeholder: childInput[0] + ' ' + childInput[1],
							className: 'call-button-values'
						});
					}));
				}));
			}
		};
		class executionContent extends React.Component {
			constructor() {
				super();
			}
			render() {
				return React.createElement(
					'div', { className: 'contract-content' },
					React.createElement(contractNameHeader),
					React.createElement(byteCodeText),
					React.createElement(abi_def),
					React.createElement(mineStat),
					React.createElement(inputsForm),
					React.createElement(functionABI)
				);
			}
		};
		ReactDOM.render(React.createElement(executionContent), document.getElementById(contractName));
	}
	createTextareaR(text) {
		var textNode;
		this.text = text;
		textNode = document.createElement('pre');
		textNode.textContent = this.text;
		textNode.classList.add('large-code');
		return textNode;
	}
	reset() {
		this.compiledNode = document.getElementById('compiled-code');
		// Unset earlier compiled code
		while(this.compiledNode.firstChild) {
			this.compiledNode.removeChild(this.compiledNode.firstChild);
		}
	}
}
