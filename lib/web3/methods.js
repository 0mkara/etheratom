'use babel'
// methods.js are collection of various functions used to execute calls on web3

import Web3 from 'web3'

const helper_methods = {
	compileWe3(web3, source, callback) {
		web3.eth.compile.solidity(source, (err, output) => {
			if(err) {
				console.log(err);
			} else {
				return callback(null, output);
			}
		});
	},
	create(web3, abi, code, constructorParams, contractName, estimatedGas) {
		console.log("Executing contract");
		console.log(abi);
	}
}

export default helper_methods
