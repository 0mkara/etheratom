'use babel'

var Account, AtomSolidity, AtomSolidityView, BN, Coinbase, Compiler, CompositeDisposable, EtchComponent, EthJSBlock, EthJSTX, EthJSVM, LineMessageView, MessagePanelView, Password, PlainMessageView, React, ReactDOM, Solc, VM, Web3, ethJSABI, ethJSUtil, fs, path, ref, rpcAddress, useTestRpc, vmAccounts, vmBlockNumber, web3;

AtomSolidityView = require('./ethereum-interface-view');

path = require('path');

fs = require('fs');

CompositeDisposable = require('atom').CompositeDisposable;

React = require('react');

ReactDOM = require('react-dom');

ref = require('atom-message-panel'), MessagePanelView = ref.MessagePanelView, PlainMessageView = ref.PlainMessageView, LineMessageView = ref.LineMessageView;

Web3 = require('web3');

Solc = require('solc');

ethJSUtil = require('ethereumjs-util');

EthJSTX = require('ethereumjs-tx');

EthJSBlock = require('ethereumjs-block');

EthJSVM = require('ethereumjs-vm');

Account = require('ethereumjs-account');

ethJSABI = require('ethereumjs-abi');

Compiler = 'solcjs';

Coinbase = '';

Password = '';

vmAccounts = [];

vmBlockNumber = 1150000;

BN = ethJSUtil.BN;

VM = new EthJSVM({
	activatePrecompiles: true,
	enableHomestead: true
});

rpcAddress = atom.config.get('atom-ethereum-interface.rpcAddress');

useTestRpc = atom.config.get('atom-ethereum-interface.useTestRpc');

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	if (useTestRpc) {
		console.log("Having issues here");
	} else {
		web3 = new Web3(new Web3.providers.HttpProvider(rpcAddress));
	}
}

module.exports = AtomSolidity = {
	atomSolidityView: null,
	modalPanel: null,
	subscriptions: null,
	panelManager: null,
	loaded: null,


	activate: function(state) {
		//this.showPanel()
		this.atomSolidityView = new AtomSolidityView(state.atomSolidityViewState);
		this.modalPanel = atom.workspace.addRightPanel({
			item: this.atomSolidityView.getElement(),
			visible: false
		});
		atom.config.observe('atom-ethereum-interface.rpcAddress', function(newValue) {
			var urlPattern;
			urlPattern = new RegExp('(http)://?');
			if (urlPattern.test(newValue)) {
				return rpcAddress = newValue;
			}
		});
		this.compiled = {};
		this.subscriptions = new CompositeDisposable;
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'eth-interface:compile': (function(_this) {
				return function() {
					return _this.compile();
				};
			})(this)
		}));
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'eth-interface:build': (function(_this) {
				return function() {
					return _this.build();
				};
			})(this)
		}));
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'eth-interface:create': (function(_this) {
				return function() {
					return _this.create();
				};
			})(this)
		}));
		this.load();
		return this.subscriptions.add(atom.commands.add('atom-workspace', {
			'eth-interface:toggle': (function(_this) {
				return function() {
					return _this.toggleView();
				};
			})(this)
		}));
	},
	deactivate: function() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		return this.atomSolidityView.destroy();
	},
	serialize: function() {
		return {
			atomSolidityViewState: this.atomSolidityView.serialize()
		};
	},
	load: function() {
		this.loadVM()
		this.loaded = true
	},
	loadVM: function() {
		if (this.testVM) {
			return this.testVM;
		}
		const { VM } = require('./vm/vm')
		this.testVM = new VM();
		this.subscriptions.add(this.testVM);
		return this.testVM;
	},
	compileVM: function(source, callback) {
		var output, that;
		that = this;
		output = Solc.compile(source, 1);
		return callback(null, output);
	},
	checkConnection: function(callback) {
		var haveConn, that;
		that = this;
		haveConn = {};
		if (useTestRpc === true) {
			haveConn = true;
		} else {
			haveConn = web3.isConnected();
		}
		if (!haveConn) {
			return callback('Error could not connect to local geth instance!', null);
		} else {
			return callback(null, true);
		}
	},
	getAddresses: function(callback) {
		return web3.eth.getAccounts(function(err, accounts) {
			if (err) {
				return callback('Error no base account!', null);
			} else {
				return callback(null, accounts);
			}
		});
	},
	addAccounts: function(keyArr) {
		var accounts, address, key, privateKey, that;
		console.log("Adding accounts");
		that = this;
		accounts = [];
		for (key in keyArr) {
			privateKey = new Buffer(keyArr[key], 'hex');
			address = ethJSUtil.privateToAddress(privateKey).toString('hex');
			VM.stateManager.putAccountBalance(address, '999999999999999000000000000000000', function(error, result) {});
			vmAccounts['0x' + address] = {
				privateKey: privateKey,
				nonce: 0
			};
			accounts.push(address);
		}
		return accounts;
	},
	checkUnlock: function(Coinbase, callback) {
		return console.log("In checkUnlock");
	},
	toggleView: function() {
		if (this.modalPanel.isVisible()) {
			return this.modalPanel.hide();
		} else {
			return this.modalPanel.show();
		}
	},
	showErrorMessage: function(line, message, callback) {
		var messages;
		messages = new MessagePanelView({
			title: 'Solidity compiler messages'
		});
		messages.attach();
		return messages.add(new LineMessageView({
			line: line,
			message: message,
			className: 'red-message'
		}));
	},
	getBaseAccount: function(accounts, callback) {
		var createAddressList, that;
		that = this;
		createAddressList = React.createClass({
			displayName: 'addressList',
			getInitialState: function() {
				return {
					account: accounts[0],
					password: Password
				};
			},
			_handleChange: function(event) {
				console.log(event.target);
				return this.setState({
					account: event.target.value
				});
			},
			_handlePasswordChange: function(event) {
				return this.setState({
					password: event.target.value
				});
			},
			_handlePassword: function(event) {
				event.preventDefault();
				return callback(null, this.state);
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
				})), React.createElement('form', {
					onSubmit: this._handlePassword,
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
		});
		ReactDOM.render(React.createElement(createAddressList), document.getElementById('accounts-list'));
		return callback(null, {
			account: accounts[0],
			password: Password
		});
	},
	chooseCompiler: function(defaultCompiler, callback) {
		var compilers, createCompilerEnvList, that;
		that = this;
		compilers = [{
			compiler: 'solcjs',
			desc: 'Javascript VM'
		}, {
			compiler: 'Web3',
			desc: 'Backend ethereum node'
		}];
		createCompilerEnvList = React.createClass({
			displayName: 'envList',
			getInitialState: function() {
				return {
					compilerValue: compilers[0].compiler === defaultCompiler ? compilers[0].compiler : compilers[1].compiler
				};
			},
			_handleChange: function(event) {
				this.setState({
					compilerValue: event.target.value
				});
				return callback(null, {
					compilerValue: event.target.value
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
						checked: self.state.compilerValue === compiler.compiler
					}, compiler.desc));
				})));
			}
		});
		ReactDOM.render(React.createElement(createCompilerEnvList), document.getElementById('compiler-options'));
		return callback(null, {
			compilerValue: defaultCompiler
		});
	},
	combineSource: function(dir, source, imports) {
		var fn, iline, ir, match, o, subSource, that;
		that = this;
		o = {
			encoding: 'UTF-8'
		};
		ir = /import\ [\'\"](.+)[\'\"]\;/g;
		match = null;
		while ((match = ir.exec(source))) {
			iline = match[0];
			fn = match[1];
			if (imports[fn]) {
				source = source.replace(iline, '');
				continue;
			}
			imports[fn] = 1;
			subSource = fs.readFileSync(dir + "/" + fn, o);
			match.source = that.combineSource(dir, subSource, imports);
			source = source.replace(iline, match.source);
		}
		return source;
	},
	compile: function() {
		var compileButton, dir, editor, filePath, makeButton, source, that;
		that = this;
		editor = atom.workspace.getActiveTextEditor();
		filePath = editor.getPath();
		dir = path.dirname(filePath);
		source = that.combineSource(dir, editor.getText(), {});
		if (!that.modalPanel.isVisible()) {
			that.modalPanel.show();
			compileButton = React.createClass({
				displayName: 'compileButton',
				_handleSubmit: function() {
					return that.compile();
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
			makeButton = React.createClass({
				displayName: 'makeButton',
				_handleSubmit: function() {
					return that.build();
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
		return this.chooseCompiler(Compiler, function(error, callback) {
			var accounts, keyArr;
			if (error) {
				console.error(error);
				return that.showErrorMessage(0, error);
			} else {
				Compiler = callback.compilerValue;
				if (Compiler === 'solcjs') {
					that.vmAccounts = [];
					keyArr = [];
					keyArr.push('3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511');
					keyArr.push('2ac6c190b09897cd8987869cc7b918cfea07ee82038d492abce033c75c1b1d0c');
					keyArr.push('dae9801649ba2d95a21e688b56f77905e5667c44ce868ec83f82e838712a2c7a');
					keyArr.push('d74aa6d18aa79a05f3473dd030a97d3305737cbc8337d940344345c1f6b72eea');
					keyArr.push('71975fbf7fe448e004ac7ae54cad0a383c3906055a65468714156a07385e96ce');
					accounts = that.addAccounts(keyArr);
					return that.getBaseAccount(accounts, function(error, callback) {
						if (error) {
							return console.error(error);
						} else {
							Coinbase = callback.account;
							return that.compileVM(source, function(error, callback) {
								var ContractABI, abiObj, bytecode, contractName, estimatedGas, inputs, results;
								if (error) {
									console.error(error);
									return that.showErrorMessage(0, 'Error could not compile using JavascriptVM');
								} else {
									that.compiled = callback;
									estimatedGas = 300000;
									that.atomSolidityView.destroyPass();
									that.atomSolidityView.destroyCompiled();
									results = [];
									for (contractName in that.compiled.contracts) {
										bytecode = that.compiled.contracts[contractName].bytecode;
										ContractABI = JSON.parse(that.compiled.contracts[contractName]["interface"]);
										inputs = [];
										for (abiObj in ContractABI) {
											if (ContractABI[abiObj].type === "constructor" && ContractABI[abiObj].inputs.length > 0) {
												inputs = ContractABI[abiObj].inputs;
											}
										}
										results.push(that.atomSolidityView.setContractView(contractName, bytecode, ContractABI, inputs, estimatedGas));
									}
									return results;
								}
							});
						}
					});
				} else {
					that.checkConnection(function(error, callback) {
						if (error) {
							console.error(error);
							return that.showErrorMessage(0, error);
						} else {
							return that.getAddresses(function(error, accounts) {
								if (error) {
									console.error(error);
									return that.showErrorMessage(0, error);
								} else {
									return that.getBaseAccount(accounts, function(err, callback) {
										if (err) {
											return console.error(err);
										} else {
											Coinbase = callback.account;
											Password = callback.password;
											web3.eth.defaultAccount = Coinbase;
											console.log("Using coinbase: " + web3.eth.defaultAccount);

											/*
											 * TODO: Handle Compilation asynchronously and handle errors
											 */
											return web3.eth.compile.solidity(source, function(err, callback) {
												var ContractABI, abiObj, bytecode, contractName, estimatedGas, inputs;
												if (err) {
													console.log(err);
												} else {
													that.compiled = callback;
													that.atomSolidityView.destroyCompiled();
													console.log(that.compiled);
													for (contractName in that.compiled) {
														estimatedGas = web3.eth.estimateGas({
															from: web3.eth.defaultAccount,
															data: that.compiled[contractName].code,
															gas: 1000000
														});

														/*
														 * TODO: Use asynchronous call
														web3.eth.estimateGas({from: '0xmyaccout...', data: "0xc6888fa1fffffffffff…..", gas: 500000 }, function(err, result){
														  if(!err && result !=== 500000) { …  }
														 });
														 */
														bytecode = that.compiled[contractName].code;
														ContractABI = that.compiled[contractName].info.abiDefinition;
														inputs = [];
														for (abiObj in ContractABI) {
															if (ContractABI[abiObj].type === "constructor" && ContractABI[abiObj].inputs.length > 0) {
																inputs = ContractABI[abiObj].inputs;
															}
														}
														that.atomSolidityView.setContractView(contractName, bytecode, ContractABI, inputs, estimatedGas);
													}
													if (!that.modalPanel.isVisible()) {
														return that.modalPanel.show();
													}
												}
											});
										}
									});
								}
							});
						}
					});
				}
			}
		});
	},
	build: function() {
		var ContractABI, bytecode, constructVars, contractName, createButton, estimatedGas, i, inputObj, inputVars, results, results1, that, variables;
		that = this;
		constructVars = [];
		i = 0;
		if (Compiler === 'solcjs') {
			results = [];
			for (contractName in this.compiled.contracts) {
				variables = [];
				estimatedGas = 0;
				if (document.getElementById(contractName + '_create')) {
					inputVars = document.getElementById(contractName + '_inputs') ? document.getElementById(contractName + '_inputs').getElementsByTagName('input') : void 0;
					if (inputVars) {
						while (i < inputVars.length) {
							if (inputVars.item(i).getAttribute('id') === contractName + '_gas') {
								estimatedGas = inputVars.item(i).value;
								inputVars.item(i).readOnly = true;
								break;
							}
							inputObj = {
								"varName": inputVars.item(i).getAttribute('id'),
								"varValue": inputVars.item(i).value
							};
							variables[i] = inputObj;
							inputVars.item(i).readOnly = true;
							if (inputVars.item(i).nextSibling.getAttribute('id') === contractName + '_create') {
								break;
							} else {
								i++;
							}
						}
						constructVars[contractName] = {
							'contractName': contractName,
							'inputVariables': variables,
							'estimatedGas': estimatedGas
						};
					}
					createButton = React.createClass({
						displayName: 'createButton',
						_handleSubmit: function() {
							var ContractABI, bytecode;
							bytecode = that.compiled.contracts[Object.keys(this.refs)[0]].bytecode;
							ContractABI = JSON.parse(that.compiled.contracts[Object.keys(this.refs)[0]]["interface"]);
							return that.create(ContractABI, bytecode, constructVars[Object.keys(this.refs)[0]], Object.keys(this.refs)[0], constructVars[Object.keys(this.refs)[0]].estimatedGas);
						},
						render: function() {
							return React.createElement('form', {
								onSubmit: this._handleSubmit
							}, React.createElement('input', {
								type: 'submit',
								value: 'Create',
								ref: contractName,
								className: 'btn btn-primary inline-block-tight'
							}, null));
						}
					});
					results.push(ReactDOM.render(React.createElement(createButton, null), document.getElementById(contractName + '_create')));
				} else {
					results.push(void 0);
				}
			}
			return results;
		} else {
			results1 = [];
			for (contractName in this.compiled) {
				variables = [];
				estimatedGas = 0;
				if (document.getElementById(contractName + '_create')) {
					bytecode = this.compiled[contractName].code;
					ContractABI = this.compiled[contractName].info.abiDefinition;
					inputVars = document.getElementById(contractName + '_inputs') ? document.getElementById(contractName + '_inputs').getElementsByTagName('input') : void 0;
					if (inputVars) {
						while (i < inputVars.length) {
							if (inputVars.item(i).getAttribute('id') === contractName + '_gas') {
								estimatedGas = inputVars.item(i).value;
								inputVars.item(i).readOnly = true;
								break;
							}
							inputObj = {
								"varName": inputVars.item(i).getAttribute('id'),
								"varValue": inputVars.item(i).value
							};
							variables[i] = inputObj;
							inputVars.item(i).readOnly = true;
							if (inputVars.item(i).nextSibling.getAttribute('id') === contractName + '_create') {
								break;
							} else {
								i++;
							}
						}
						constructVars[contractName] = {
							'contractName': contractName,
							'inputVariables': variables,
							'estimatedGas': estimatedGas
						};
					}
					createButton = React.createClass({
						displayName: 'createButton',
						_handleSubmit: function() {
							return that.create(that.compiled[Object.keys(this.refs)[0]].info.abiDefinition, that.compiled[Object.keys(this.refs)[0]].code, constructVars[Object.keys(this.refs)[0]], Object.keys(this.refs)[0], constructVars[Object.keys(this.refs)[0]].estimatedGas);
						},
						render: function() {
							return React.createElement('form', {
								onSubmit: this._handleSubmit
							}, React.createElement('input', {
								type: 'submit',
								value: 'Create',
								ref: contractName,
								className: 'btn btn-primary inline-block-tight'
							}, null));
						}
					});
					results1.push(ReactDOM.render(React.createElement(createButton, null), document.getElementById(contractName + '_create')));
				} else {
					results1.push(void 0);
				}
			}
			return results1;
		}
	},
	prepareEnv: function(contractName, callback) {
		var e;
		if (document.getElementById(this.contractName + '_create')) {
			document.getElementById(this.contractName + '_create').style.visibility = 'hidden';
			if (Compiler !== 'solcjs') {
				document.getElementById(this.contractName + '_stat').innerText = 'transaction sent, waiting for confirmation...';
			}
			return callback(null, true);
		} else {
			e = new Error('Could not parse input');
			return callback(e, null);
		}
	},
	asyncLoop: function(iterations, func, callback) {
		var cycle, done, index;
		index = 0;
		done = false;
		cycle = {
			next: function() {
				if (done) {
					return;
				}
				if (index < iterations) {
					index++;
					return func(cycle);
				} else {
					done = true;
					return callback();
				}
			},
			iteration: function() {
				return index - 1;
			},
			"break": function() {
				done = true;
				return callback();
			}
		};
		cycle.next();
		return cycle;
	},
	constructFunctions: function(contractABI, callback) {
		var contractFunction, k, len, results;
		this.contractABI = contractABI;
		results = [];
		for (k = 0, len = contractABI.length; k < len; k++) {
			contractFunction = contractABI[k];
			if (contractFunction.type = 'function' && contractFunction.name !== null && contractFunction.name !== void 0) {
				results.push(this.createChilds(contractFunction, function(error, childInputs) {
					if (!error) {
						return callback(null, [contractFunction.name, childInputs]);
					} else {
						return callback(null, [null, null]);
					}
				}));
			} else {
				results.push(void 0);
			}
		}
		return results;
	},
	decodeABI: function(contractABI1, callback) {
		var contractFunction, k, len, results;
		this.contractABI = contractABI1;
		results = [];
		for (k = 0, len = contractABI.length; k < len; k++) {
			contractFunction = contractABI[k];
			if (contractFunction.type = 'function' && contractFunction.name !== null && contractFunction.name !== void 0) {
				results.push(this.createChilds(contractFunction, function(error, childInputs) {
					if (!error) {
						return callback(null, [contractFunction.name, childInputs]);
					} else {
						return callback(null, [null, null]);
					}
				}));
			} else {
				results.push(void 0);
			}
		}
		return results;
	},
	createChilds: function(contractFunction, callback) {
		var i, reactElements;
		reactElements = [];
		i = 0;
		if (contractFunction.inputs.length > 0) {
			while (i < contractFunction.inputs.length) {
				reactElements[i] = [contractFunction.inputs[i].type, contractFunction.inputs[i].name];
				i++;
			}
		}
		return callback(null, reactElements);
	},
	constructorsArray: function(abi, constructVars1, callback) {
		var that;
		this.abi = abi;
		this.constructVars = constructVars1;
		that = this;
		return this.asyncLoop(this.abi.length, (function(cycle) {
			if (that.abi[cycle.iteration()].type === "constructor") {
				that.getConstructorIntoArray(that.abi[cycle.iteration()], that.constructVars, function(error, typeArray) {
					return callback(null, typeArray);
				});
			}
			return cycle.next();
		}), function() {});
	},
	getConstructorIntoArray: function(constructorAbi, constructVars1, callback) {
		var inputsArr, that, typesArr;
		this.constructorAbi = constructorAbi;
		this.constructVars = constructVars1;
		that = this;
		typesArr = new Array();
		inputsArr = new Array();
		return this.asyncLoop(this.constructorAbi.inputs.length, (function(cycle) {
			typesArr.push(that.constructorAbi.inputs[cycle.iteration()].type);
			inputsArr.push(that.constructVars.inputVariables[cycle.iteration()].varValue);
			return cycle.next();
		}), function() {
			return callback(null, {
				types: typesArr,
				inputs: inputsArr
			});
		});
	},
	create: function(abi, code, constructVars1, contractName1, estimatedGas) {
		var e, that;
		this.abi = abi;
		this.code = code;
		this.constructVars = constructVars1;
		this.contractName = contractName1;
		this.estimatedGas = estimatedGas;
		that = this;
		if (Compiler === 'solcjs') {
			return this.constructorsArray(this.abi, this.constructVars, function(error, typeArr) {
				var block, buffer, rawTx, tx;
				buffer = ethJSABI.rawEncode(typeArr.types, typeArr.inputs);
				that.code = that.code + buffer.toString('hex');
				rawTx = {
					nonce: '0x' + vmAccounts['0x' + Coinbase].nonce,
					gasPrice: 0x09184e72a000,
					gasLimit: '0x' + estimatedGas,
					data: '0x' + that.code
				};
				tx = new EthJSTX(rawTx);
				tx.sign(vmAccounts['0x' + Coinbase].privateKey);
				block = new EthJSBlock({
					header: {
						timestamp: new Date().getTime() / 1000 | 0,
						number: that.vmBlockNumber
					},
					transactions: [],
					uncleHeaders: []
				});
				return that.prepareEnv(this.contractName, function(err, callback) {
					var constructorS, i, k, len, ref1;
					if (err) {
						return console.error(err);
					} else {
						constructorS = [];
						ref1 = that.constructVars.inputVariables;
						for (k = 0, len = ref1.length; k < len; k++) {
							i = ref1[k];
							constructorS.push(i.varValue);
						}
						return VM.stateManager.getAccount(Coinbase, function(error, account) {
							var balance, userAccount;
							if (account.exists === true) {
								userAccount = new Account(account);
								balance = userAccount.balance.toString();
								if (balance > tx.getUpfrontCost().toString()) {
									return that.exeVM(block, tx, function(error, result) {
										var functionABI, myContract;
										if (error) {
											console.error(error);
											that.showErrorMessage(508, error);
										} else if (result.createdAddress) {
											myContract = result;
											document.getElementById(that.contractName + '_stat').innerText = 'JavascriptVM code executed!';
											document.getElementById(that.contractName + '_stat').setAttribute('class', 'icon icon-zap');
											document.getElementById(that.contractName + '_address').innerText = '0x' + myContract.createdAddress.toString('hex');
											document.getElementById(that.contractName + '_address').setAttribute('class', 'icon icon-key');
											functionABI = React.createClass({
												displayName: 'callFunctions',
												getInitialState: function() {
													return {
														childFunctions: []
													};
												},
												componentDidMount: function() {
													var self;
													self = this;
													return that.constructFunctions(that.abi, function(error, childFunctions) {
														if (!error) {
															self.state.childFunctions.push(childFunctions);
															return self.forceUpdate();
														}
													});
												},
												_handleChange: function(childFunction, event) {
													return this.setState({
														value: event.target.value
													});
												},
												_handleSubmit: function(childFunction, event) {
													var self;
													self = this;
													return that.typesToArray(this.refs, childFunction, function(error, argTypArray) {
														if (!error) {
															return that.argsToArray(self.refs, childFunction, function(error, argArray) {
																if (!error) {
																	that.callVM(myContract, that.abi, childFunction, argTypArray, argArray);
																	return ++vmBlockNumber;
																}
															});
														}
													});
												},
												render: function() {
													var self;
													self = this;
													return React.createElement('div', {
														htmlFor: 'contractFunctions'
													}, this.state.childFunctions.map(function(childFunction, i) {
														return React.createElement('form', {
															onSubmit: self._handleSubmit.bind(this, childFunction[0]),
															key: i,
															ref: childFunction[0]
														}, React.createElement('input', {
															type: 'submit',
															readOnly: 'true',
															value: childFunction[0],
															className: 'text-subtle call-button'
														}), childFunction[1].map(function(childInput, j) {
															return React.createElement('input', {
																tye: 'text',
																handleChange: self._handleChange,
																name: childInput[0],
																placeholder: childInput[0] + ' ' + childInput[1],
																className: 'call-button-values'
															});
														}));
													}));
												}
											});
											return ReactDOM.render(React.createElement(functionABI), document.getElementById(that.contractName + '_call'));
										}
									});
								}
							}
						});
					}
				});
			});
		} else {
			this.estimatedGas = this.estimatedGas > 0 ? this.estimatedGas : 1000000;
			if (Password === '') {
				e = new Error('Empty password');
				console.error("Empty password");
				this.showErrorMessage(0, "No password provided");
				return;
			}
			return this.prepareEnv(this.contractName, function(err, callback) {
				var constructorS, i, k, len, ref1;
				if (err) {
					return console.error(err);
				} else {
					web3.eth.defaultAccount = Coinbase;
					console.log("Using coinbase: " + web3.eth.defaultAccount);
					constructorS = [];
					ref1 = that.constructVars.inputVariables;
					for (k = 0, len = ref1.length; k < len; k++) {
						i = ref1[k];
						constructorS.push(i.varValue);
					}
					web3.personal.unlockAccount(web3.eth.defaultAccount, Password);
					return web3.eth.contract(that.abi)["new"](constructorS.toString(), {
						data: that.code,
						from: web3.eth.defaultAccount,
						gas: that.estimatedGas
					}, function(err, contract) {
						var contractStat, functionABI, myContract;
						if (err) {
							console.error(err);
							that.showErrorMessage(129, err);
						} else if (contract.address) {
							myContract = contract;
							console.log('address: ' + myContract.address);
							document.getElementById(that.contractName + '_stat').innerText = 'Mined!';
							document.getElementById(that.contractName + '_stat').setAttribute('class', 'icon icon-zap');
							document.getElementById(that.contractName + '_address').innerText = myContract.address;
							document.getElementById(that.contractName + '_address').setAttribute('class', 'icon icon-key');
							functionABI = React.createClass({
								displayName: 'callFunctions',
								getInitialState: function() {
									return {
										childFunctions: []
									};
								},
								componentDidMount: function() {
									var self;
									self = this;
									return that.constructFunctions(that.abi, function(error, childFunctions) {
										if (!error) {
											self.state.childFunctions.push(childFunctions);
											return self.forceUpdate();
										}
									});
								},
								_handleChange: function(childFunction, event) {
									return this.setState({
										value: event.target.value
									});
								},
								_handleSubmit: function(childFunction, event) {
									return that.argsToArray(this.refs, childFunction, function(error, argArray) {
										if (!error) {
											return that.call(myContract, childFunction, argArray);
										}
									});
								},
								render: function() {
									var self;
									self = this;
									return React.createElement('div', {
										htmlFor: 'contractFunctions'
									}, this.state.childFunctions.map(function(childFunction, i) {
										return React.createElement('form', {
											onSubmit: self._handleSubmit.bind(this, childFunction[0]),
											key: i,
											ref: childFunction[0]
										}, React.createElement('input', {
											type: 'submit',
											readOnly: 'true',
											value: childFunction[0],
											className: 'text-subtle call-button'
										}), childFunction[1].map(function(childInput, j) {
											return React.createElement('input', {
												tye: 'text',
												handleChange: self._handleChange,
												placeholder: childInput[0] + ' ' + childInput[1],
												className: 'call-button-values'
											});
										}));
									}));
								}
							});
							return ReactDOM.render(React.createElement(functionABI), document.getElementById(that.contractName + '_call'));
						} else if (!contract.address) {
							contractStat = React.createClass({
								render: function() {
									return React.createElement('div', {
										htmlFor: 'contractStat'
									}, React.createElement('span', {
										className: 'inline-block highlight'
									}, 'TransactionHash: '), React.createElement('pre', {
										className: 'large-code'
									}, contract.transactionHash), React.createElement('span', {
										className: 'stat-mining stat-mining-align'
									}, 'waiting to be mined '), React.createElement('span', {
										className: 'loading loading-spinner-tiny inline-block stat-mining-align'
									}));
								}
							});
							ReactDOM.render(React.createElement(contractStat), document.getElementById(that.contractName + '_stat'));
							return console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
						}
					});
				}
			});
		}
	},
	showOutput: function(address, output) {
		var messages;
		messages = new MessagePanelView({
			title: 'Solidity compiler output'
		});
		messages.attach();
		address = 'Contract address: ' + address;
		output = 'Contract output: ' + output;
		messages.add(new PlainMessageView({
			message: address,
			className: 'green-message'
		}));
		return messages.add(new PlainMessageView({
			message: output,
			className: 'green-message'
		}));
	},
	typesToArray: function(reactElements1, childFunction1, callback) {
		var that, types;
		this.reactElements = reactElements1;
		this.childFunction = childFunction1;
		that = this;
		types = new Array();
		return this.asyncLoop(this.reactElements[this.childFunction].childNodes.length, (function(cycle) {
			if (that.reactElements[that.childFunction][cycle.iteration()].type !== 'submit') {
				types.push(that.reactElements[that.childFunction][cycle.iteration()].name);
			}
			return cycle.next();
		}), function() {
			return callback(null, types);
		});
	},
	argsToArray: function(reactElements1, childFunction1, callback) {
		var args, that;
		this.reactElements = reactElements1;
		this.childFunction = childFunction1;
		that = this;
		args = new Array();
		return this.asyncLoop(this.reactElements[this.childFunction].childNodes.length, (function(cycle) {
			if (that.reactElements[that.childFunction][cycle.iteration()].type !== 'submit') {
				args.push(that.reactElements[that.childFunction][cycle.iteration()].value);
			}
			return cycle.next();
		}), function() {
			return callback(null, args);
		});
	},
	checkArray: function(_arguments, callback) {
		this["arguments"] = _arguments;
		return callback(null, this["arguments"]);
	},
	call: function(myContract1, functionName, _arguments) {
		var that;
		this.myContract = myContract1;
		this.functionName = functionName;
		this["arguments"] = _arguments;
		that = this;
		return this.checkArray(this["arguments"], function(error, args) {
			var result;
			if (!error) {
				if (args.length > 0) {
					web3.personal.unlockAccount(web3.eth.defaultAccount, Password);
					result = that.myContract[that.functionName].apply(this, args);
				} else {
					web3.personal.unlockAccount(web3.eth.defaultAccount, Password);
					result = that.myContract[that.functionName]();
				}
				return that.showOutput(that.myContract.address, result);
			}
		});
	},
	callVM: function(myContract1, abi, functionName, argTypes, _arguments) {
		var that, to;
		this.myContract = myContract1;
		this.abi = abi;
		this.functionName = functionName;
		this.argTypes = argTypes;
		this["arguments"] = _arguments;
		that = this;
		to = that.myContract.createdAddress.toString('hex');
		return this.checkVMAccExists(to, function(error, status) {
			var block, buffer, rawTx, tx;
			if (status === true) {
				buffer = Buffer.concat([ethJSABI.methodID(that.functionName, that.argTypes), ethJSABI.rawEncode(that.argTypes, that["arguments"])]).toString('hex');
				rawTx = {
					nonce: '0x' + vmAccounts['0x' + Coinbase].nonce++,
					gasPrice: 0x09184e72a000,
					gasLimit: 0x300000,
					to: '0x' + to,
					data: '0x' + buffer
				};
				tx = new EthJSTX(rawTx);
				block = new EthJSBlock({
					header: {
						timestamp: new Date().getTime() / 1000 | 0,
						number: vmBlockNumber
					},
					transactions: [],
					uncleHeaders: []
				});
				return that.exeVM(block, tx, function(error, result) {
					if (error) {
						console.error(error);
						return that.showErrorMessage(508, error);
					} else {
						return that.getOutputTypes(that.abi, that.functionName, function(error, outputTypes) {
							var outputBuffer;
							outputBuffer = ethJSABI.rawDecode(outputTypes, result.vm["return"]);
							outputBuffer = ethJSABI.stringify(outputTypes, outputBuffer);
							return that.showOutput('0x' + that.myContract.createdAddress.toString('hex'), outputBuffer);
						});
					}
				});
			}
		});
	},
	checkVMAccExists: function(address1, callback) {
		var that;
		this.address = address1;
		that = this;
		return VM.stateManager.getAccount('0x' + this.address, function(error, account) {
			return callback(null, account.exists);
		});
	},
	getOutputTypes: function(abi, functionName, callback) {
		var that;
		this.abi = abi;
		this.functionName = functionName;
		that = this;
		return this.asyncLoop(this.abi.length, (function(cycle) {
			if (that.abi[cycle.iteration()].name === that.functionName) {
				that.outputTypestoArray(that.abi[cycle.iteration()], function(error, outputTypes) {
					return callback(null, outputTypes);
				});
			}
			return cycle.next();
		}), function() {});
	},
	outputTypestoArray: function(funcAbi, callback) {
		var that, types;
		this.funcAbi = funcAbi;
		that = this;
		types = new Array();
		return this.asyncLoop(this.funcAbi.outputs.length, (function(cycle) {
			types.push(that.funcAbi.outputs[cycle.iteration()].type);
			return cycle.next();
		}), function() {
			return callback(null, types);
		});
	},
	exeVM: function(block1, tx1, callback) {
		var that;
		this.block = block1;
		this.tx = tx1;
		that = this;
		that.tx.sign(vmAccounts['0x' + Coinbase].privateKey);
		return VM.runTx({
			block: that.block,
			tx: that.tx,
			skipBalance: true,
			skipNonce: true
		}, function(error, result) {
			if (!error) {
				return callback(null, result);
			}
		});
	},
	toggle: function() {
		if (this.modalPanel.isVisible()) {
			return this.modalPanel.hide();
		} else {
			return this.modalPanel.show();
		}
	},

	// Panel - Thanks to go-plus[https://github.com/joefitzgerald/go-plus] for building this awesome panel
	showPanel() {
		if (this.statusbar) {
			this.getPanelManager().showStatusBar()
		}
		this.getPanelManager().setActivated()
	},
	getPanelManager() {
		if (this.panelManager) {
			return this.panelManager
		}

		this.panelManager = new PanelManager(() => {
			if (this.statusbar) {
				return this.statusbar
			}
			return false
		})
		if (this.subscriptions) {
			this.subscriptions.add(this.panelManager)
		}
		return this.panelManager
	}
};
