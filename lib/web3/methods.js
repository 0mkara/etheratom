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

import EventEmitter from 'events';
import md5 from 'md5';
import { MessagePanelView, PlainMessageView } from 'atom-message-panel';
import { fork } from 'child_process';

import {
    SET_COMPILED,
    SET_COMPILING
} from '../actions/types';


export default class Web3Helpers {
    constructor(web3, store) {
        this.web3 = web3;
        this.store = store;

		// Etheratom contract, bytecode & abi
		this.bytecode = '608060405234801561001057600080fd5b5061051f806100206000396000f30060806040526004361061006c5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166327b53401811461007157806341c0e1b5146100fe57806348c5e7bc146101155780637f630b4c1461012d578063f1eae25c14610186575b600080fd5b34801561007d57600080fd5b5061008960043561019b565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100c35781810151838201526020016100ab565b50505050905090810190601f1680156100f05780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561010a57600080fd5b50610113610235565b005b34801561012157600080fd5b50610089600435610276565b34801561013957600080fd5b506040805160206004803580820135601f81018490048402850184019095528484526101139436949293602493928401919081908401838280828437509497506103199650505050505050565b34801561019257600080fd5b50610113610421565b60016020818152600092835260409283902080548451600294821615610100026000190190911693909304601f810183900483028401830190945283835291929083018282801561022d5780601f106102025761010080835404028352916020019161022d565b820191906000526020600020905b81548152906001019060200180831161021057829003601f168201915b505050505081565b6000543373ffffffffffffffffffffffffffffffffffffffff908116911614156102745760005473ffffffffffffffffffffffffffffffffffffffff16ff5b565b60008181526001602081815260409283902080548451600260001995831615610100029590950190911693909304601f8101839004830284018301909452838352606093909183018282801561030d5780601f106102e25761010080835404028352916020019161030d565b820191906000526020600020905b8154815290600101906020018083116102f057829003601f168201915b50505050509050919050565b60003382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140182805190602001908083835b6020831061038d5780518252601f19909201916020918201910161036e565b51815160209384036101000a600019018019909216911617905260408051929094018290039091206000818152600183529390932088519397506103d996509450870192506104589050565b50604051819073ffffffffffffffffffffffffffffffffffffffff3316907f6eb913f8381f04b5834f6f06c6b4b88df26f76a9ca6796ccd1c423a8281c851c90600090a35050565b6000805473ffffffffffffffffffffffffffffffffffffffff19163373ffffffffffffffffffffffffffffffffffffffff16179055565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061049957805160ff19168380011785556104c6565b828001600101855582156104c6579182015b828111156104c65782518255916020019190600101906104ab565b506104d29291506104d6565b5090565b6104f091905b808211156104d257600081556001016104dc565b905600a165627a7a72305820069778fb50b89b88f77ce5e177c54524efd1ecec6ef957ce6f7b164d392706d60029';
		this.createSnptContract();
	}
	async createSnptContract() {
		const abi = [{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"fiddle_data","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"bytes32"}],"name":"get_fiddle","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_code","type":"string"}],"name":"share","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"mortal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_user","type":"address"},{"indexed":true,"name":"_id","type":"bytes32"}],"name":"NewFiddle","type":"event"}];
		const SnippetServiceAddr = "0xBb114b958D1A3a0Ca6Ec260e11dc66Ba14a845bA";
		const gasPrice = await this.web3.eth.getGasPrice();
		this.snptContract = await new this.web3.eth.Contract(abi, SnippetServiceAddr, {
			data: '0x' + this.bytecode,
			gasPrice: this.web3.utils.toHex(gasPrice)
		});
	}
	get snptEvents() {
		return this.snptContract.events;
    }
    createWorker(fn) {
        const pkgPath = atom.packages.resolvePackagePath('etheratom');
        return fork(`${pkgPath}/lib/web3/worker.js`);
    }
    async compileWeb3(sources) {
        let fileName = Object.keys(sources).find(key => {
            return /\.sol/.test(key);
        });

        let hashId = md5(sources[fileName].content);

        if (this.jobs[fileName]) {
            if (this.jobs[fileName].hashId === hashId || this.jobs[fileName].hashId === undefined) {
                this.jobs[fileName].wasBusy = true;
                console.log(hashId);
                console.error(`Job in progress for ${fileName}`);
                return;
            }

            this.jobs[fileName].solcWorker.kill();
            console.error(`Killing older job for ${fileName}`);
        } else {
            this.jobs[fileName] = { hashId };
        }

        // compile solidity using solcjs
        // sources have Compiler Input JSON sources format
        // https://solidity.readthedocs.io/en/develop/using-the-compiler.html#compiler-input-and-output-json-description
        try {
            const outputSelection = {
                // Enable the metadata and bytecode outputs of every single contract.
                '*': {
                    '': ['legacyAST'],
                    '*': ['abi', 'evm.bytecode.object', 'devdoc', 'userdoc', 'evm.gasEstimates']
                }
            };
            const settings = {
                optimizer: { enabled: true, runs: 500 },
                evmVersion: 'byzantium',
                outputSelection
            };
            const input = { language: 'Solidity', sources, settings };
            const solcWorker = this.createWorker();
            this.jobs[fileName].solcWorker = solcWorker;

            const requiredSolcVersion = atom.config.get('etheratom.versionSelector');

            solcWorker.send({ command: 'compile', payload: input, version: requiredSolcVersion });

            solcWorker.on('message', m => {
                if(m.compiled) {
                    this.store.dispatch({ type: SET_COMPILED, payload: JSON.parse(m.compiled) });
                    this.store.dispatch({ type: SET_COMPILING, payload: false });
                    this.jobs[fileName].successHash = hashId;

                    solcWorker.kill();
                }
            });
            solcWorker.on('error', e => console.error(e));
            solcWorker.on('exit', (code, signal) => {
                if (this.jobs[fileName].wasBusy && hashId !== this.jobs[fileName].successHash) {
                    this.store.dispatch({ type: SET_COMPILING, payload: true });
                } else {
                    this.store.dispatch({ type: SET_COMPILING, payload: false });
                    this.jobs[fileName] = false;
                }
                console.log('%c Compile worker process exited with ' + `code ${code} and signal ${signal}`, 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
            });
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
    async setCoinbase(coinbase) {
        try {
            this.web3.eth.defaultAccount = coinbase;
        } catch(e) {
            throw e;
        }
    }
    async getBalance(coinbase) {
        if(!coinbase) {
            const error = new Error('No coinbase selected!');
            throw error;
        }
        try {
            const weiBalance = await this.web3.eth.getBalance(coinbase);
            const ethBalance = await this.web3.utils.fromWei(weiBalance, 'ether');
            return ethBalance;
        } catch(e) {
            throw e;
        }
    }
    async getSyncStat() {
        try {
            return await this.web3.eth.isSyncing();
        } catch(e) {
            throw e;
        }
    }
    async create({...args}) {
        console.log('%c Creating contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        const coinbase = args.coinbase;
        const password = args.password;
        const abi = args.abi;
        const code = args.bytecode;
        const gasSupply = args.gas;

        if(!coinbase) {
            const error = new Error('No coinbase selected!');
            throw error;
        }
        this.web3.eth.defaultAccount = coinbase;
        try {
            if(password) {
                await this.web3.eth.personal.unlockAccount(coinbase, password);
            }
            try {
                const gasPrice = await this.web3.eth.getGasPrice();
                const contract = await new this.web3.eth.Contract(abi, {
                    from: coinbase,
                    data: '0x' + code,
                    gas: this.web3.utils.toHex(gasSupply),
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
        console.log('%c Deploying contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        class ContractInstance extends EventEmitter {}
        const contractInstance = new ContractInstance();
        try {
            params = params.map(param => {
                return param.type.endsWith('[]') ? param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',') : param.value;
            });
            contract.deploy({
                arguments: params
            })
                .send({
                    from: this.web3.eth.defaultAccount
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
                });
            return contractInstance;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    async call({...args}) {
        console.log('%c Web3 calling functions... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        console.log(arguments);
        const that = this;
        const coinbase = args.coinbase;
        const password = args.password;
        const contract = args.contract;
        const abiItem = args.abiItem;
        var params = args.params || [];


        try {
            // Prepare params for call
            params = params.map(param => {
                if(param.type.endsWith('[]')) {
                    return param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',');
                }
                if(param.type.indexOf('int') > -1) {
                    return new this.web3.utils.BN(param.value);
                }
                return param.value;
            });

            // Handle fallback
            if(abiItem.type === 'fallback') {
                console.log("%c Calling fallback function... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                if(password) {
                    await this.web3.eth.personal.unlockAccount(coinbase, password);
                }
                const result = await this.web3.eth.sendTransaction({
                    from: coinbase,
                    to: contract.options.address,
                    value: abiItem.payableValue || 0
                });
                console.log(result);
                return result;
            }
            // Handle constant calls
			if(abiItem.constant === true) {
				console.log("%c Calling constant function default... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                const result = await contract.methods[abiItem.name](...params).call({ from: coinbase });
                console.log(result);
                return result;
            }
            // handle default payable non-constant methods
			if(password) {
				await this.web3.eth.personal.unlockAccount(coinbase, password);
			}
			console.log("%c Calling payable function... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
			const result = await contract.methods[abiItem.name](...params).send({ from: coinbase, value: abiItem.payableValue })
				.on('transactionHash', (hash) => {
					// show method tx hash & pending loader
					console.log(hash);
					that.showPanelTx(hash);
				})
				.on('receipt', (receipt) => {
					return receipt;
				})
			console.log(result);
            return result;
        }
        catch(e) {
            console.log(e);
            throw e;
        }
    }
    async send(to, amount, password) {
        return new Promise((resolve, reject) => {
            try {
                const coinbase = this.web3.eth.defaultAccount;
                if(password) {
                    this.web3.eth.personal.unlockAccount(coinbase, password);
                }
                this.web3.eth.sendTransaction({
                    from: coinbase,
                    to: to,
                    value: amount
                })
                    .on('transactionHash', txHash => {
                        this.showTransaction({ head: 'Transaction hash:', data: txHash });
                    })
                    .then(txRecipt => {
                        resolve(txRecipt);
                    })
                    .catch(e => {
                        reject(e);
                    });
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }
    async funcParamsToArray(contractFunction) {
        if(contractFunction && contractFunction.inputs.length > 0) {
            const inputElements = await Promise.all(contractFunction.inputs.map(async(input) => {
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
    showPanelError(err_message) {
        let messages;
        messages = new MessagePanelView({ title: 'Etheratom report' });
        messages.attach();
        messages.add(new PlainMessageView({ message: err_message, className: 'red-message' }));
    }
    showPanelTx(txHash) {
		const messages = new MessagePanelView({ title: 'Etheratom transaction' });
		messages.attach();
		messages.add(new PlainMessageView({ message: 'New transaction: ' + txHash, className: 'green-message' }));
		return;
	}
    showOutput({...args}) {
        const address = args.address;
        const data = args.data;
        const block = arguments.block;
        const messages = new MessagePanelView({ title: 'Etheratom output' });
        messages.attach();
        messages.add(new PlainMessageView({
            message: 'Contract address: ' + address,
            className: 'green-message'
        }));
        if(block) {
			const rawMessage = `<h6>Contract output:</h6><pre>${JSON.stringify(data, null, 4)}</pre>`;
			messages.add(new PlainMessageView({
				message: rawMessage,
				raw: true,
				className: 'green-message'
			}));
		}
        if(data instanceof Object) {
            const rawMessage = `<h6>Contract output:</h6><pre>${JSON.stringify(data, null, 4)}</pre>`;
            messages.add(new PlainMessageView({
                message: rawMessage,
                raw: true,
                className: 'green-message'
            }));
            return;
        }
        messages.add(new PlainMessageView({
            message: 'Contract output: ' + data,
            className: 'green-message'
        }));
        return;
    }
    showTransaction({...args}) {
        const head = args.head;
        const data = args.data;
        const messages = new MessagePanelView({ title: 'Etheratom output' });
        messages.attach();
        messages.add(new PlainMessageView({
            message: head,
            className: 'green-message'
        }));
        if(data instanceof Object) {
            const rawMessage = `<pre>${JSON.stringify(data, null, 4)}</pre>`;
            messages.add(new PlainMessageView({
                message: rawMessage,
                raw: true,
                className: 'green-message'
            }));
            return;
        }
        messages.add(new PlainMessageView({
            message: data,
            className: 'green-message'
        }));
        return;
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
    // Gas Limit
    async getGasLimit() {
        try {
            const block = await this.web3.eth.getBlock('latest');
            return block.gasLimit;
        } catch(e) {
            throw e;
        }
    }
    async getAccounts() {
        try {
            return await this.web3.eth.getAccounts();
        } catch(e) {
            throw e;
        }
    }
    async getMining() {
        try {
            return await this.web3.eth.isMining();
        } catch (e) {
            throw e;
        }
    }
    async getHashrate() {
        try {
            return await this.web3.eth.getHashrate();
        } catch(e) {
        } catch(e) {
			throw e;
		}
	}
	async getBlock(blockNumber) {
		try {
			return await this.web3.eth.getBlock(blockNumber);
		} catch(e) {
			throw e;
		}
	}
	async hexToUtf8(input) {
		try {
			return await this.web3.utils.hexToUtf8(input);
		} catch(e) {
			throw e;
		}
	}
	async hexToAscii(input) {
		try {
			return await this.web3.utils.hexToAscii(input);
		} catch(e) {
			throw e;
		}
	}
	async toHex(input) {
		try {
			return await this.web3.utils.toHex(input);
		} catch(e) {
			throw e;
		}
	}
	async toChecksumAddress(input) {
		try {
			return await this.web3.utils.toChecksumAddress(input);
		} catch(e) {
			throw e;
		}
	}
	async hexToNumber(input) {
		try {
			return await this.web3.utils.hexToNumber(input);
		} catch(e) {
			throw e;
		}
	}
	async hexToBytes(input) {
		try {
			return await this.web3.utils.hexToBytes(input);
		} catch(e) {
			throw e;
		}
	}
	async bytesToHex(input) {
		try {
			return await this.web3.utils.bytesToHex(input);
		} catch(e) {
			throw e;
		}
	}
	async padLeft(input, padding) {
		try {
			return await this.web3.utils.padLeft(input, padding);
		} catch(e) {
			throw e;
		}
	}
	async padRight(input, padding) {
		try {
			return await this.web3.utils.padRight(input, padding);
		} catch(e) {
			throw e;
		}
    }
    // Code sharing
	async getShareGasEstm(coinbase, code) {
		const maxGas = await this.getGasLimit();
		return await this.snptContract.methods.share(code).estimateGas({ gas: maxGas, from: coinbase });
	}
	async shareCode(coinbase, password, code, gas) {
        const that = this;
        const { bytecode, abi, SnippetServiceAddr } = this;
		const { snptContract } = this;
		return new Promise(async (resolve, reject) => {
			if(!coinbase) {
				const error = new Error('No coinbase selected!');
				reject(error);
			}
			try {
				if(password) {
					const unlocked = await that.web3.eth.personal.unlockAccount(coinbase, password);
				}
                snptContract.options.from = coinbase;
				snptContract.options.gas = that.web3.utils.toHex(gas);

				snptContract.methods.share(code).send({ from: coinbase })
					.on('transactionHash', txHash => {
                        resolve(txHash);
					})
					.on('error', e => {
						reject(e);
					})
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
    }
    async getSnippet(coinbase, id) {
		const { snptContract } = this;
		try {
			return await snptContract.methods.get_fiddle(id).call({ from: coinbase });
		} catch(e) {
			throw e;
		}
    }
    	// abi encoders & decoders
	async encFuncSig(input) {
		return await this.web3.eth.abi.encodeFunctionSignature(input);
	}
	async encEvntSig(input) {
		return await this.web3.eth.abi.encodeEventSignature(input);
	}
	async encFuncCall(input) {
		return await this.web3.eth.abi.encodeFunctionCall(input);
	}
	async encParams(input) {
		return await this.web3.eth.abi.encodeParameters(input);
	}
	async decParams(input) {
		return await this.web3.eth.abi.decodeParameters(input);
	}
	async decLog(input) {
		return await this.web3.eth.abi.decodeLog(input);
	}
}
