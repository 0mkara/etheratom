'use babel'

import React from 'react'
import ReactDOM from 'react-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import createReactClass from 'create-react-class'
import ReactUpdate from 'react-addons-update'
import ReactJson from 'react-json-view'
import Web3Helpers from './methods'

export default class View {
	constructor(web3) {
		this.Accounts = [];
		this.coinbase = null;
		this.web3 = web3;
		this.helpers = new Web3Helpers(this.web3);
	}
	setCompiled(compiled) {
		this.compiled = compiled;
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
		let workspaceElement = atom.views.getView(atom.workspace);
		const that = this;
		let params = [];
		class InputsForm extends React.Component {
			constructor(props) {
				super(props);
				this._handleChange = this._handleChange.bind(this);
			}
			_handleChange(event) {
				params[event.target.id] = { value: event.target.value, type: event.target.placeholder };
			}
			render() {
				const { contractName, abi } = this.props;
				return (
					<div id={contractName + '_inputs'}>
						{
							abi.type === "constructor" &&
							abi.inputs.map((input, i) => {
								return (
									<form key={i}>
										<button class="input text-subtle">{ input.name }</button>
										<input id={i} type="text" class="inputs" placeholder={input.type} onChange={this._handleChange}></input>
									</form>
								);
							})
						}
					</div>
				);
			}
		};
		class GasInput extends React.Component {
			constructor(props) {
				super(props);
				this.state = {
					gas: 4700000
				};
				this._handleChange = this._handleChange.bind(this);
			}
			_handleChange(event) {
				estimatedGas = event.target.value;
				this.setState({ gas: event.target.value });
			}
			render() {
				return (
					<form class="gas-estimate-form">
						<button class="input text-subtle">Gas</button>
						<input
							id={contractName + '_gas'}
							type="number"
							class="inputs"
							value={this.state.gas}
							onChange={this._handleChange}>
						</input>
					</form>
				);
			}
		};
		class CreateButton extends React.Component {
			constructor(props) {
				super(props);
				this._handleSubmit = this._handleSubmit.bind(this);
			}
			async _handleSubmit() {
				console.log("%c Submit handle... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
			}
			render() {
				return (
					<form onSubmit={this._handleSubmit}>
						<input
							type="submit"
							value="Create"
							ref={contractName}
							class="btn btn-primary inline-block-tight">
						</input>
					</form>
				);
			}
		};
		class CompiledContract extends React.Component {
			constructor(props) {
				super(props);
			}
			render() {
				const { compiled } = that;
				if(compiled) {
					return (
						<div id="compiled-code" class="compiled-code">
							{
								Object.keys(compiled.contracts).map((contractName, index) => {
									const bytecode = compiled.contracts[contractName].bytecode;
									const ContractABI = JSON.parse(compiled.contracts[contractName]["interface"]);
									return (
										<div class="contract-content" key={index}>
											<span class="contract-name inline-block highlight-success">{ contractName }</span>
											<div class="byte-code">
												<pre class="large-code">{ JSON.stringify(bytecode) }</pre>
											</div>
											<div class="abi-definition">
												<pre class="large-code">{ JSON.stringify(ContractABI) }</pre>
											</div>
											{
												ContractABI.map((abi) => {
													return <InputsForm contractName={contractName} abi={abi} />
												})
											}
											<GasInput contractName={contractName} />
											<CreateButton contractName={contractName} />
										</div>
									)
								})
							}
						</div>
					);
				}
				return (
					<div id="compiled-code" class="compiled-code"></div>
				);
			}
		}
		class tabView extends React.Component {
			constructor(props) {
				super(props);
				this.state = {
					txHash: undefined,
					txAnalysis: undefined
				}
				this._handleTxHashChange = this._handleTxHashChange.bind(this);
				this._handleTxHashSubmit = this._handleTxHashSubmit.bind(this);
			}
			_handleTxHashChange(event) {
				this.setState({ txHash: event.target.value });
			}
			async _handleTxHashSubmit() {
				const { txHash } = this.state;
				try {
					const txAnalysis = await that.helpers.getTxAnalysis(txHash);
					console.log(txAnalysis);
					this.setState({ txAnalysis });
				} catch (e) {
					console.log(e);
				}
			}
			render() {
				return (
					<Tabs>
						<TabList>
							<div class="tab_btns">
								<Tab>
									<div class="btn copy-btn btn-primary">Compiled code</div>
								</Tab>
								<Tab>
									<div class="btn copy-btn btn-primary">Transaction analyzer</div>
								</Tab>
							</div>
						</TabList>

						<TabPanel>
							<CompiledContract />
						</TabPanel>
						<TabPanel>
							<div class="block">
								<form onSubmit={this._handleTxHashSubmit}>
									<div class="inline-block">
										<input type="text" name="txhash" value={this.state.txHash} onChange={this._handleTxHashChange} placeholder="Transaction hash" class="input-search" />
									</div>
									<div class="inline-block">
										<input type="submit" value="Analyze" class="btn btn-success" />
									</div>
								</form>
							</div>
							{
								(this.state.txAnalysis && this.state.txAnalysis.transaction) &&
								<div class="block">
									<h2 class="block highlight-info tx-header">Transaction</h2>
									<ReactJson
										src={this.state.txAnalysis.transaction}
										theme="solarized"
									 	displayDataTypes={false}
										name={false}
									/>
								</div>
							}
							{
								(this.state.txAnalysis && this.state.txAnalysis.transaction) &&
								<div class="block">
									<h2 class="block highlight-info tx-header">Transaction receipt</h2>
									<ReactJson
										src={this.state.txAnalysis.transactionRecipt}
										theme="solarized"
									 	displayDataTypes={false}
										name={false}
									/>
								</div>
							}
						</TabPanel>
					</Tabs>
				);
			}
		}
		ReactDOM.render(React.createElement(tabView, null), document.getElementById('tab_view'));
	}
	async viewCompiled(compiled) {
		const self = this;
		for (contractName in compiled.contracts) {
			let bytecode = compiled.contracts[contractName].bytecode;
			let ContractABI = JSON.parse(compiled.contracts[contractName]["interface"]);
			let estimatedGas = 4700000;
			inputs = [];
			for (abiObj in ContractABI) {
				estimatedGas = await self.helpers.getGasEstimate(self.coinbase, bytecode)
				if (ContractABI[abiObj].type === "constructor" && ContractABI[abiObj].inputs.length > 0) {
					inputs = ContractABI[abiObj].inputs;
				}
			}
			this.setContractView(contractName, bytecode, ContractABI, inputs, estimatedGas);
		}
	}
	setContractView(contractName, bytecode, abiDef, constructorParams, estimatedGas) {
		// Make view Reactive
		let params,
			compiledNode,
			cNode,
			att,
			self;
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
				params[event.target.id] = { value: event.target.value, type: event.target.placeholder };
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
						id: i,
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
				this.state = {
					estimatedGas: estimatedGas
				};
				this._handleChange = this._handleChange.bind(this);
			}
			_handleChange(event) {
				estimatedGas = event.target.value;
				this.setState({estimatedGas: event.target.value});
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
					const contract = await self.helpers.create(self.coinbase, self.password, abiDef, bytecode, params, contractName, estimatedGas);
					self.setExecutionView(contractName, abiDef, bytecode, constructorParams, params, contract);
					const contract_deployed = await self.helpers.deploy(contract, params);
					contract.options.address = contract_deployed.options.address
					self.setExecutionView(contractName, abiDef, bytecode, constructorParams, params, contract);
				} catch(e) {
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
				return React.createElement('div', {
					className: 'contract-content'
				}, React.createElement(contractNameHeader), React.createElement(byteCodeText), React.createElement(abi_def), React.createElement(inputsForm), React.createElement(estmGas), React.createElement(executeButton));
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
		class executionContent extends React.Component {
			constructor() {
				super();
			}
			render() {
				return React.createElement('div', {
					className: 'contract-content'
				}, React.createElement(contractNameHeader), React.createElement(byteCodeText), React.createElement(abi_def), React.createElement(mineStat), React.createElement(inputsForm), React.createElement(functionABI));
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
