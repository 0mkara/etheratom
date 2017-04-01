'use babel'
// methods.js are collection of various functions used to execute calls on web3

import Web3 from 'web3'

export default class Web3Helpers {
	constructor(web3) {
		this.web3 = web3;
	}
	compileWe3(source, callback) {
		this.web3.eth.compile.solidity(source, (err, output) => {
			if(err) {
				console.log(err);
			} else {
				callback(null, output);
			}
		});
	}
	create(coinbase, password, abi, code, constructorParams, contractName, estimatedGas, callback) {
		return new Promise((resolve, reject) => {
			if(coinbase && password) {
				this.web3.eth.defaultAccount = coinbase;
				this.web3.personal.unlockAccount(this.web3.eth.defaultAccount, password);
				this.web3.eth.contract(abi)["new"](constructorParams.toString(), {
					data: code,
					from: this.web3.eth.defaultAccount,
					gas: estimatedGas
				}, (error, contract) => {
					if(error) {
						callback(error);
					} else {
						callback(null, contract);
					}
				});
			} else {
				callback('Error! No password provided.');
			}
		});
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
}
