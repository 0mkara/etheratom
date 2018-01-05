'use babel'
// methods.js are collection of various functions used to execute calls on web3
import Solc from 'solc'
import ethJSABI from 'ethereumjs-abi'
import EthJSTX from 'ethereumjs-tx'
import EthJSBlock from 'ethereumjs-block'
import Account from 'ethereumjs-account'
import { MessagePanelView, PlainMessageView, LineMessageView } from 'atom-message-panel'

export default class VmHelpers {
	constructor(vm, vmAccounts) {
		this.vm = vm;
		this.vmBlockNumber = 1150000;
		this.vmAccounts = vmAccounts;
	}
	async compileVM(source) {
		try {
			const output = await Solc.compile(source, 1);
			return output;
		} catch (e) {
			throw e;
		}
	}
	async create(coinbase, abi, code, constructorParams, contractName, estimatedGas) {
		if(coinbase) {
			try {
				const paramsArray = await this.constructorParamsToArray(abi, constructorParams);

				return new Promise((resolve, reject) => {
					let block, buffer, rawTx, tx;
					if(paramsArray.inputs.length > 0) {
						buffer = ethJSABI.rawEncode(paramsArray.types, paramsArray.inputs);
						code = code + buffer.toString('hex');
					}
					rawTx = {
						nonce: '0x' + this.vmAccounts['0x' + coinbase].nonce,
						gasPrice: 0x09184e72a000,
						gasLimit: '0x' + estimatedGas,
						data: '0x' + code
					};
					tx = new EthJSTX(rawTx);
					tx.sign(this.vmAccounts['0x' + coinbase].privateKey);
					block = new EthJSBlock({
						header: {
							timestamp: new Date().getTime() / 1000 | 0,
							number: this.vmBlockNumber
						},
						transactions: [],
						uncleHeaders: []
					});

					this.vm.stateManager.getAccount('0x' + coinbase, (error, account) => {
						if (error) {
							reject(error);
							return;
						}
						if(account.exists === true) {
							const userAccount = new Account(account);
							const balance = userAccount.balance.toString();
							if(balance > tx.getUpfrontCost().toString()) {
								this.exeVM(coinbase, block, tx, (error, result) => {
									if(error) {
										reject(error);
										return;
									} else {
										resolve(result);
										return;
									}
								});
							}
						} else {
							// TODO: if we run above code for first time in VM
							// 0xca35b7d915458ef540ade6068dfe2f44e8fa733c does not exists but
							// ca35b7d915458ef540ade6068dfe2f44e8fa733c exists
							// temporary workaround try once again without '0x'
							this.vm.stateManager.getAccount(coinbase, (error, account) => {
								if (error) {
									reject(error);
									return;
								}
								if(account.exists === true) {
									const userAccount = new Account(account);
									const balance = userAccount.balance.toString();
									if(balance > tx.getUpfrontCost().toString()) {
										this.exeVM(coinbase, block, tx, (error, result) => {
											if(error) {
												reject(error);
												return;
											} else {
												resolve(result);
												return;
											}
										});
									}
								} else {
									error = new Error("Account doesn't exists!");
									reject(error);
									return;
								}
							});
						}
					})
				})
			} catch(e) {
				throw(e);
			}
		} else {
			throw(new Error("Coinbase not selected"));
		}
	}
	call(coinbase, myContract, abi, methodName, argTypes, params, callback) {
		let to, result, buffer, block;
		to = myContract.createdAddress.toString('hex');
		this.vm.stateManager.getAccount('0x' + coinbase, (error, account) => {
			if(error) {
				callback(error);
			} else if(account.exists == true) {
				buffer = Buffer.concat([ethJSABI.methodID(methodName, argTypes), ethJSABI.rawEncode(argTypes, params)]).toString('hex');
				rawTx = {
					nonce: '0x' + this.vmAccounts['0x' + coinbase].nonce++,
					gasPrice: 0x09184e72a000,
					gasLimit: 0x300000,
					to: '0x' + to,
					data: '0x' + buffer
				};
				tx = new EthJSTX(rawTx);
				block = new EthJSBlock({
					header: {
						timestamp: new Date().getTime() / 1000 | 0,
						number: this.vmBlockNumber
					},
					transactions: [],
					uncleHeaders: []
				});
				this.exeVM(coinbase, block, tx, (error, result) => {
					if(error) {
						callback(error);
					} else {
						callback(null, result);
					}
				});
			} else {
				// TODO: be more clear about errors
				error = new Error("Account doesn't exists!");
				callback(error);
			}
		});
	}
	exeVM(coinbase, block, tx, callback) {
		tx.sign(this.vmAccounts['0x' + coinbase].privateKey);
		this.vm.runTx({
			block: block,
			tx: tx,
			skipBalance: true,
			skipNonce: true
		}, (error, result) => {
			if(error) {
				callback(error);
			} else if(result.vm.exceptionError) {
				var error = new Error(result.vm.exceptionError);
				callback(error);
			} else {
				callback(null, result);
			}
		});
		++this.vmBlockNumber;
	}
	constructFunctions(contractABI, callback) {
		let contractFunction, k, len, results;
		results = [];
		for(k = 0, len = contractABI.length; k < len; k++) {
			contractFunction = contractABI[k];
			if(contractFunction.type = 'function' && contractFunction.name !== null && contractFunction.name !== void 0) {
				results.push(this.createChilds(contractFunction, (error, childInputs) => {
					if(!error) {
						callback(null, [contractFunction.name, childInputs]);
					} else {
						callback(null, [null, null]);
					}
				}));
			} else {
				results.push(void 0);
			}
		}
	}
	createChilds(contractFunction, callback) {
		let i, reactElements;
		reactElements = [];
		i = 0;
		if(contractFunction.inputs.length > 0) {
			while(i < contractFunction.inputs.length) {
				reactElements[i] = [contractFunction.inputs[i].type, contractFunction.inputs[i].name];
				i++;
			}
		}
		callback(null, reactElements);
	}
	typesToArray(reactElements, methodName, callback) {
		let types;
		types = new Array();
		this.asyncLoop(reactElements[methodName].childNodes.length, ((cycle) => {
			if(reactElements[methodName][cycle.iteration()].type !== 'submit') {
				types.push(reactElements[methodName][cycle.iteration()].name);
			}
			cycle.next();
		}), () => {
			callback(null, types);
		});
	}
	argsToArray(reactElements, methodName, callback) {
		let args;
		args = new Array();
		this.asyncLoop(reactElements[methodName].childNodes.length, ((cycle) => {
			if(reactElements[methodName][cycle.iteration()].type !== 'submit') {
				args.push(reactElements[methodName][cycle.iteration()].value);
			}
			cycle.next();
		}), () => {
			callback(null, args);
		});
	}
	async constructorParamsToArray(abi, constructorParams) {
		const that = this;
		const constructorItem = await abi.filter((abiObj) => {
			return abiObj.type === 'constructor';
		});
		const typeArray = await that.paramsToArray(constructorItem[0], constructorParams);
		return typeArray;
	}
	async paramsToArray(interfaceItem, constructorParams) {
		let typesArr = new Array();
		let inputsArr = new Array();
		for (let i = 0; i < interfaceItem.inputs.length; i++) {
			typesArr.push(interfaceItem.inputs[i].type);
			inputsArr.push(constructorParams[interfaceItem.inputs[i].name] || '');
		}
		return { types: typesArr, inputs: inputsArr };
	}
	showPanelError(err_message) {
		let messages;
		messages = new MessagePanelView({
			title: 'Etheratom report'
		});
		messages.attach();
		messages.add(new PlainMessageView({
			message: err_message,
			className: 'red-message'
		}));
	}
	showOutput(address, outputTypes, result) {
		let messages, outputBuffer;
		messages = new MessagePanelView({
			title: 'Etheratom output'
		});
		messages.attach();
		messages.add(new PlainMessageView({
			message: 'Contract address: ' + address,
			className: 'green-message'
		}));
		// result.vm.return is undefined after kill
		if(result.vm.return) {
			outputBuffer = ethJSABI.rawDecode(outputTypes, result.vm.return);
			outputBuffer = ethJSABI.stringify(outputTypes, outputBuffer);
			messages.add(new PlainMessageView({
				message: 'Contract output: ' + outputBuffer,
				className: 'green-message'
			}));
		}
	}
	getOutputTypes(abi, methodName, callback) {
		this.asyncLoop(abi.length, ((cycle) => {
			if(abi[cycle.iteration()].name === methodName) {
				this.outputTypestoArray(abi[cycle.iteration()], (error, outputTypes) => {
					callback(null, outputTypes);
				});
			}
			cycle.next();
		}), () => {});
	}
	outputTypestoArray(funcAbi, callback) {
		let types;
		types = new Array();
		this.asyncLoop(funcAbi.outputs.length, ((cycle) => {
			types.push(funcAbi.outputs[cycle.iteration()].type);
			cycle.next();
		}), () => {
			callback(null, types);
		});
	}
	asyncLoop(iterations, func, callback) {
		let cycle, done, index;
		index = 0;
		done = false;
		cycle = {
			next: function() {
				if(done) {
					return;
				}
				if(index < iterations) {
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
			break: function() {
				done = true;
				return callback();
			}
		};
		cycle.next();
		return cycle;
	}
}
