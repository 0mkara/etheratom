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

// methods.js are collection of various functions used to execute calls on web3
import Solc from 'solc'
import Web3 from 'web3'
import ethJSABI from 'ethereumjs-abi'
import EthJSTX from 'ethereumjs-tx'
import EventEmitter from 'events'
import { MessagePanelView, PlainMessageView, LineMessageView } from 'atom-message-panel'

export default class Web3Helpers {
	constructor(web3) {
		this.web3 = web3;
	}
	async compileWeb3(sources) {
		// compile solidity using solcjs
		// sources have Compiler Input JSON sources format
		// https://solidity.readthedocs.io/en/develop/using-the-compiler.html#compiler-input-and-output-json-description
		try {
			const outputSelection = {
				// Enable the metadata and bytecode outputs of every single contract.
				"*": {
					"*": [ "abi", "evm.bytecode.object", "devdoc", "userdoc", "evm.gasEstimates" ]
				}
			};
			const settings = {
				optimizer: { enabled: true, runs: 500 },
				evmVersion: "byzantium",
				outputSelection
			};
			const input = { language: "Solidity", sources, settings };
			const output = await Solc.compileStandardWrapper(JSON.stringify(input));
			return JSON.parse(output);
		} catch (e) {
			throw e;
		}
	}
	async getGasEstimate(coinbase, bytecode) {
		if(!coinbase) {
			const error = new Error('No coinbase selected!');
			throw error;
		}
		try {
			this.web3.eth.defaultAccount = coinbase;
			const gasEstimate = await this.web3.eth.estimateGas({
				from: this.web3.eth.defaultAccount,
				data: '0x' + bytecode,
			});
			return gasEstimate;
		} catch (e) {
			throw e;
		}
	}
	async create(coinbase, password, abi, code, contractName, estimatedGas) {
		console.log("%c Creating contract... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
		if(!coinbase) {
			const error = new Error('No coinbase selected!');
			throw error;
		}
		this.web3.eth.defaultAccount = coinbase;
		try {
			if(password) {
				const unlocked = await this.web3.eth.personal.unlockAccount(coinbase, password);
			}
			try {
				const gasPrice = await this.web3.eth.getGasPrice();
				const contract = await new this.web3.eth.Contract(abi, {
					from: this.web3.eth.defaultAccount,
					data: '0x' + code,
					gas: this.web3.utils.toHex(9000000),
					gasPrice: this.web3.utils.toHex(gasPrice)
				});
				return contract;
			} catch (e) {
				console.log(e);
				throw e;
			}
		} catch (e) {
			console.log(e);
			throw e;
		}
	}
	async deploy(contract, params) {
		console.log("%c Deploying contract... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
		class ContractInstance extends EventEmitter {};
		const contractInstance = new ContractInstance();
		try {
			params = params.map(param => {
				return param.type.endsWith('[]') ? param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',') : param.value;
			});
			const gasPrice = await this.web3.eth.getGasPrice();
			contract.deploy({
				arguments: params
			})
			.send({
				from: this.web3.eth.defaultAccount,
				gas: this.web3.utils.toHex(9000000),
				gasPrice: this.web3.utils.toHex(gasPrice)
			})
			.on('transactionHash', transactionHash => {
				contractInstance.emit('transactionHash', transactionHash);
			})
			.on('receipt', txReceipt => {
				contractInstance.emit('receipt', txReceipt);

			})
			.on('confirmation', confirmationNumber => {
				contractInstance.emit('confirmation', confirmationNumber);
			})
			.on('error', error => {
				contractInstance.emit('error', error);
			})
			.then(instance => {
				contractInstance.emit('address', instance.options.address);
				contractInstance.emit('instance', instance);
			})
			return contractInstance;
		} catch (e) {
			console.log(e);
			throw e;
		}
	}
	async call(coinbase, password, contract, methodItem, params) {
		console.log("%c Web3 calling functions... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
		this.web3.eth.defaultAccount = coinbase;
		try {
			if(methodItem.constant === false || methodItem.payable === true) {
				if(password) {
					await this.web3.eth.personal.unlockAccount(coinbase, password);
				}
				if(params.length > 0) {
					const result = await contract.methods[methodItem.name](params).send({ from: coinbase });
					return result;
				}
				const result = await contract.methods[methodItem.name]().send({ from: coinbase });
				return result;
			}
			if(params.length > 0) {
				const result = await contract.methods[methodItem.name](params).call({ from: coinbase });
				return result;
			}
			const result = await contract.methods[methodItem.name]().call({ from: coinbase });
			return result;
		}
		catch(error) {
			console.log(error);
			this.showPanelError(error);
		}
	}
	async constructFunctions(contractABI) {
		const that = this;
		const functionItems = await contractABI.filter((abiObj) => {
			return abiObj.type === 'function';
		});
		const results = await Promise.all(functionItems.map(async (functionItem) => {
			return { interface: functionItem, params: await that.funcParamsToArray(functionItem) };
		}));
		return results;
	}
	async funcParamsToArray(contractFunction) {
		if(contractFunction && contractFunction.inputs.length > 0) {
			const inputElements = await Promise.all(contractFunction.inputs.map(async (input) => {
				return [input.type, input.name];
			}));
			return inputElements;
		}
		return [];
	}
	async inputsToArray(paramObject) {
		if(paramObject.type.endsWith('[]')) {
			return paramObject.value.split(',').map(val => this.web3.utils.toHex(val.trim()));
		}
		return this.web3.utils.toHex(paramObject.value);
	}
	createChilds(contractFunction, callback) {
		let i,
			reactElements;
		reactElements = [];
		i = 0;
		if (contractFunction.inputs.length > 0) {
			while (i < contractFunction.inputs.length) {
				reactElements[i] = [contractFunction.inputs[i].type, contractFunction.inputs[i].name];
				i++;
			}
		}
		callback(null, reactElements);
	}
	async typesToArray(reactElements, methodName) {
		let types = await Promise.all();
	}
	showPanelError(err_message) {
		let messages;
		messages = new MessagePanelView({ title: 'Etheratom report' });
		messages.attach();
		messages.add(new PlainMessageView({ message: err_message, className: 'red-message' }));
	}
	showOutput(address, outputTypes, result) {
		let messages,
			outputBuffer;
		messages = new MessagePanelView({ title: 'Etheratom output' });
		messages.attach();
		messages.add(new PlainMessageView({
			message: 'Contract address: ' + address,
			className: 'green-message'
		}));
		if(result instanceof Object) {
			messages.add(new PlainMessageView({
				message: 'Contract output: ' + JSON.stringify(result),
				className: 'green-message'
			}));
			return;
		}
		messages.add(new PlainMessageView({
			message: 'Contract output: ' + result,
			className: 'green-message'
		}));
		return;
	}
	async getOutputTypes(functionItem) {
		const outputTypes = await Promise.all(functionItem.outputs.map(async (outputItem) => {
			return outputItem.type;
		}));
		return outputTypes;
	}

	// Transaction analysis
	async getTxAnalysis(txHash) {
		try {
			const transaction = await this.web3.eth.getTransaction(txHash);
			const transactionRecipt = await this.web3.eth.getTransactionReceipt(txHash);
			return { transaction, transactionRecipt };
		} catch(e) {
			throw e;
		}
	}
}
