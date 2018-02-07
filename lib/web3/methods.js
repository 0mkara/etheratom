'use babel'
// methods.js are collection of various functions used to execute calls on web3
import Solc from 'solc'
import Web3 from 'web3'
import ethJSABI from 'ethereumjs-abi'
import EthJSTX from 'ethereumjs-tx'
import {MessagePanelView, PlainMessageView, LineMessageView} from 'atom-message-panel'

export default class Web3Helpers {
	constructor(web3) {
		this.web3 = web3;
	}
	async compileWeb3(source) {
		// compile solidity using solcjs
		try {
			const output = await Solc.compile(source, 1);
			return output;
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
	async create(coinbase, password, abi, code, constructorParams, contractName, estimatedGas) {
		console.log("%c Deploying contract... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
		if(!coinbase) {
			const error = new Error('No coinbase selected!');
			throw error;
		}
		if (coinbase) {
			this.web3.eth.defaultAccount = coinbase;
			try {
				if(password) {
					const unlocked = await this.web3.eth.personal.unlockAccount(coinbase, password);
				}
				constructorParams = constructorParams.map(param => {
					return param.type.endsWith('[]') ? param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',') : param.value;
				});
				try {
					const gasPrice = await this.web3.eth.getGasPrice();
					const contract = await new this.web3.eth.Contract(abi, constructorParams, {
						from: this.web3.eth.defaultAccount,
						data: '0x' + code,
						gas: this.web3.utils.toHex(9000000),
						gasPrice: this.web3.utils.toHex(20000000000)
					});
					return contract;
				} catch (e) {
					throw e;
				}
			} catch (e) {
				throw e;
			}
		}
	}
	async deploy(contract, params) {
		try {
			params = params.map(param => {
				return param.type.endsWith('[]') ? param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',') : param.value;
			});
			contract = await contract.deploy({ arguments: params });
			const contractInstance = await contract.send({
				from: this.web3.eth.defaultAccount,
				gas: this.web3.utils.toHex(9000000),
				gasPrice: this.web3.utils.toHex(20000000000)
			});
			// TODO: handle transactionHash https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#deploy
			// .on('transactionHash', function(transactionHash){ ... })
			return contractInstance;
		} catch (e) {
			throw e;
		}
	}
	async call(coinbase, password, contract, methodItem, params) {
		console.log("%c Web3 calling functions... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
		console.log(contract);
		console.log(methodItem);
		console.log(params);
		this.web3.eth.defaultAccount = coinbase;
		try {
			// need to make calls work for
			// with args
			// without args
			// payable
			// non payable
			if(methodItem.constant === false || methodItem.payable === true) {
				if(params.length > 0) {
					const result = await contract.methods[methodItem.name](params).send({ from: coinbase });
					console.log(result);
					return result;
				}
				const result = await contract.methods[methodItem.name]().send({ from: coinbase });
				console.log(result);
				return result;
			}
			if(params.length > 0) {
				const result = await contract.methods[methodItem.name](params).call({ from: coinbase });
				console.log(result);
				return result;
			}
			const result = await contract.methods[methodItem.name]().call({ from: coinbase });
			console.log(result);
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
		console.log(paramObject);
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
		messages = new MessagePanelView({title: 'Etheratom report'});
		messages.attach();
		messages.add(new PlainMessageView({message: err_message, className: 'red-message'}));
	}
	showOutput(address, outputTypes, result) {
		let messages,
			outputBuffer;
		messages = new MessagePanelView({title: 'Etheratom output'});
		messages.attach();
		messages.add(new PlainMessageView({
			message: 'Contract address: ' + address,
			className: 'green-message'
		}));
		messages.add(new PlainMessageView({
			message: 'Contract output: ' + result,
			className: 'green-message'
		}));
	}
	async getOutputTypes(functionItem) {
		const outputTypes = await Promise.all(functionItem.outputs.map(async (outputItem) => {
			return outputItem.type;
		}));
		return outputTypes;
	}
}
