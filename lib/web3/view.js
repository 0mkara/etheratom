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
import React from 'react'
import ReactDOM from 'react-dom'
import createReactClass from 'create-react-class'
import ReactUpdate from 'react-addons-update'
import ReactJson from 'react-json-view'
import Web3Helpers from './methods'
import TabView from '../components/TabView'
import CoinbaseView from '../components/CoinbaseView'
import CompileBtn from '../components/CompileBtn'
import ErrorView from '../components/ErrorView'
import { SET_ACCOUNTS, SET_COINBASE } from '../actions/types'

export default class View {
	constructor(store, web3) {
		this.Accounts = [];
		this.coinbase = null;
		this.web3 = web3;
		this.store = store;
		this.helpers = new Web3Helpers(this.web3);
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
	async createCoinbaseView() {
		try {
			const accounts = await this.web3.eth.getAccounts();
			this.store.dispatch({ type: SET_ACCOUNTS, payload: accounts });
			this.store.dispatch({ type: SET_COINBASE, payload: accounts[0] });
			ReactDOM.render(<CoinbaseView store={this.store} helpers={this.helpers} />, document.getElementById('accounts-list'));
		} catch (e) {
			this.helpers.showPanelError("No account exists! Please create one.");
			throw e;
		}
	}
	createButtonsView() {
		ReactDOM.render(<CompileBtn store={this.store} />, document.getElementById('compile_btn'));
	}
	createTabView() {
		ReactDOM.render(<TabView store={this.store} helpers={this.helpers}/>, document.getElementById('tab_view'));
	}
	createErrorView() {
		ReactDOM.render(<ErrorView store={this.store} />, document.getElementById('compiled-error'));
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
	async getAddresses(callback) {
		return this.web3.eth.getAccounts(function(err, accounts) {
			if (err) {
				return callback('Error no base account!', null);
			} else {
				return callback(null, accounts);
			}
		});
	}
}
