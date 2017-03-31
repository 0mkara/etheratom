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
		console.log("Executing contract");
		console.log(coinbase);
		return new Promise(function(resolve, reject) {
			if(coinbase && password) {
				resolve('Success');
			} else {
				reject('Error happened');
			}
		});
		callback(null, true);
	}
}
