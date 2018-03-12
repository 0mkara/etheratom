'use babel'

import React from 'react'
import ReactDOM from 'react-dom'
import createReactClass from 'create-react-class'
import ReactUpdate from 'react-addons-update'
import ReactJson from 'react-json-view'
import Web3Helpers from './methods'
import TabView from '../components/TabView'

export default class View {
	constructor(store, web3) {
		this.Accounts = [];
		this.coinbase = null;
		this.web3 = web3;
		this.store = store;
		this.helpers = new Web3Helpers(this.web3);
	}
	viewErrors(errors) {
		let errorViews = createReactClass({
			displayName: 'errorList',
			render: () => {
				return React.createElement('ul', {
					htmlFor: 'error-list',
					className: 'error-list error-messages block'
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
		let createCompilerEnvList,
			compilers,
			selectedEnv;
		compilers = [
			{
				compiler: 'solcjs',
				desc: 'Javascript VM'
			}, {
				compiler: 'web3',
				desc: 'Backend ethereum node'
			}
		];
		createCompilerEnvList = createReactClass({
			displayName: 'envList',
			getInitialState: function() {
				return {selectedEnv: atom.config.get('etheratom.executionEnv')};
			},
			_handleChange: function(event) {
				atom.config.set('etheratom.executionEnv', event.target.value);
				this.setState({selectedEnv: event.target.value});
			},
			render: function() {
				var self;
				self = this;
				return React.createElement('div', {
					htmlFor: 'compiler-select'
				}, React.createElement('form', {
					className: 'row'
				}, React.createElement('div', {className: 'icon icon-plug'}), React.createElement('div', {
					className: 'compilers'
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
					}), React.createElement('span', {
						null
					}, compiler.desc));
				}))));
			}
		});
		ReactDOM.render(React.createElement(createCompilerEnvList), document.getElementById('compiler-options'));
	}
	createCoinbaseView() {
		let self;
		self = this;
		this.getAddresses((error, accounts) => {
			if (error) {
				console.error(error);
			} else if (accounts != null) {
				this.coinbase = accounts[0];
				class createAddressList extends React.Component {
					constructor() {
						super();
						this.state = {
							account: accounts[0],
							password: '',
							unlock_style: 'unlock-default'
						};
						this._handleAccChange = this._handleAccChange.bind(this);
						this._handlePasswordChange = this._handlePasswordChange.bind(this);
						this._handleUnlock = this._handleUnlock.bind(this);
						this._linkClick = this._linkClick.bind(this);
					}
					_linkClick(event) {
						atom.clipboard.write(this.state.account);
					}
					_handleAccChange(event) {
						self.coinbase = event.target.value;
						this.setState({ account: event.target.value });
					}
					_handlePasswordChange(event) {
						this.setState({ password: event.target.value });
						// TODO: unless we show some indicator on `Unlock` let password set on change
						self.password = this.state.password;
						if (!((this.state.password.length - 1) > 0)) {
							this.setState({ unlock_style: 'unlock-default' });
						}
					}
					_handleUnlock(event) {
						// TODO: here try to unlock geth backend node using coinbase and password and show result
						self.password = this.state.password;
						if (this.state.password.length > 0) {
							this.setState({unlock_style: 'unlock-active'});
						}
						event.preventDefault();
					}
					render() {
						return React.createElement('div', {
							htmlFor: 'acc-n-pass',
							className: 'content'
						}, React.createElement('div', {
							className: 'row'
						}, React.createElement('div', {
							className: 'icon icon-link btn copy-btn btn-success',
							onClick: this._linkClick
						})
						, React.createElement('select', {
							onChange: this._handleAccChange,
							value: this.state.account
						}, accounts.map(function(account, i) {
							return React.createElement('option', {
								value: account
							}, account);
						}))), React.createElement('form', {
							className: 'row',
							onSubmit: this._handleUnlock
						}, React.createElement('div', {className: 'icon icon-lock'}), React.createElement('input', {
							type: 'password',
							uniqueName: "password",
							placeholder: "Password",
							value: this.state.password,
							onChange: this._handlePasswordChange
						}), React.createElement('input', {
							type: 'submit',
							className: this.state.unlock_style,
							value: 'Unlock'
						})));
					}
				};
				ReactDOM.render(React.createElement(createAddressList), document.getElementById('accounts-list'));
			} else {
				self.helpers.showPanelError("No account exists! Please create one.");
			}
		});
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
	async createTabView() {
		ReactDOM.render(<TabView store={this.store} helpers={this.helpers}/>, document.getElementById('tab_view'));
	}
	setExecutionView(contractName, abiDef, bytecode, constructorParams, params, contract) {
		let self;
		self = this;
		class ContractNameHeader extends React.Component {
			constructor(props) {
				super(props);
			}
			render() {
				return (
					<span class="contract-name inline-block highlight-success">{contractName}</span>
				);
			}
		};
		class ByteCodeText extends React.Component {
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
		class ABIDef extends React.Component {
			constructor(props) {
				super(props);
			}
			render() {
				return (
					<div class="abi-definition">
						<pre class="large-code">{JSON.stringify(abiDef)}</pre>
					</div>
				);
				return React.createElement('div', {
					className: 'abi-definition'
				}, React.createElement('pre', {
					className: 'large-code'
				}, JSON.stringify(abiDef)));
			}
		};
		class MineStat extends React.Component {
			constructor(props) {
				super(props);
			}
			render() {
				if (!contract.options.address) {
					// Waiting to be mined
					return React.createElement('div', {
						id: contractName + '_stat'
					}, React.createElement('div', {
						htmlFor: 'contractStat'
					}, React.createElement('span', {
						className: 'stat-mining stat-mining-align'
					}, 'waiting to be mined '), React.createElement('span', {className: 'loading loading-spinner-tiny inline-block stat-mining-align'})));
				} else if (contract.options.address) {
					return React.createElement('div', {
						id: contractName + '_stat'
					}, React.createElement('div', {
						htmlFor: 'contractStat'
					}, React.createElement('span', {
						className: 'inline-block highlight'
					}, 'Mined at: '), React.createElement('pre', {
						className: 'large-code'
					}, contract.options.address)));
				}
			}
		};
		class TxHash extends React.Component {
			constructor(props) {
				super(props);
			}
			render() {
				return (
					<div id={contractName + '_txHash'}>
						{
							contract.transactionHash &&
							<div>
								<span class="inline-block highlight">Transaction hash:</span>
								<pre class="large-code">{contract.transactionHash}</pre>
							</div>
						}
					</div>
				);
			}
		};
		class InputsForm extends React.Component {
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
		class FunctionABI extends React.Component {
			constructor() {
				super();
				this.state = {
					childFunctions: []
				};
				this._handleChange = this._handleChange.bind(this);
			}
			async componentDidMount() {
				try {
					const childFunctions = await self.helpers.constructFunctions(abiDef);
					this.setState({ childFunctions: childFunctions });
				} catch (e) {
					self.helpers.showPanelError(e);
				}
			}
			_handleChange(interfaceName, type, event) {
				const value = event.target.value;
				let params = { ...this.state.params }
				params[interfaceName] = { type, value }
				this.setState({ params });
			}
			async _handleSubmit(methodItem) {
				console.log("%c Submit handle... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
				// call functions here
				try {
					let params = [];
					if(this.state.params && this.state.params[methodItem.name]) {
						params = await self.helpers.inputsToArray(this.state.params[methodItem.name]);
					}
					const result = await self.helpers.call(self.coinbase, self.password, contract, methodItem, params);
					const outputTypes = await self.helpers.getOutputTypes(methodItem);
					self.helpers.showOutput(contract.options.address, outputTypes, result);
				} catch (e) {
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
							type: 'text',
							onChange: (event) => this._handleChange(childFunction.interface.name, childInput[0], event),
							placeholder: childInput[0] + ' ' + childInput[1],
							className: 'call-button-values'
						});
					}));
				}));
			}
		};
		class ExecutionContent extends React.Component {
			constructor(props) {
				super(props);
			}
			render() {
				return (
					<div class="contract-content">
						<ContractNameHeader />
						<ByteCodeText />
						<ABIDef />
						<TxHash />
						<MineStat />
						<InputsForm />
						<FunctionABI />
					</div>
				);
			}
		};
		ReactDOM.render(React.createElement(ExecutionContent), document.getElementById(contractName));
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
			if (err) {
				return callback('Error no base account!', null);
			} else {
				return callback(null, accounts);
			}
		});
	}
	reset() {
		this.compiledNode = document.getElementById('compiled-code');
		this.errorNode = document.getElementById('compiled-error');
		// Unset earlier compiled code
		while (this.compiledNode.firstChild) {
			this.compiledNode.removeChild(this.compiledNode.firstChild);
		}
		while (this.errorNode.firstChild && this.errorNode.firstChild.firstChild) {
			this.errorNode.firstChild.removeChild(this.errorNode.firstChild.firstChild);
		}
	}
}
