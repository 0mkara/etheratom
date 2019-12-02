const Web3 = require('web3');

let web3 = {};
let globalContract;

let createConnection = (address) => {
    return new Web3(address);
};

let onTransaction = (web3) => {
    web3.eth.subscribe('pendingTransactions')
        .on('data', (transaction) => {
            process.send({ transaction: transaction });
        })
        .on('error', (e) => {
            return e;
        });
};

let subscription = (web3) => {
    web3.eth.subscribe('syncing')
        .on('data', (sync) => {
            process.send({ syncStarted: true });
            if (typeof (sync) === 'boolean') {
                process.send({ isBooleanSync: sync });
            }
            if (typeof (sync) === 'object') {
                process.send({ isObjectSync: sync });
            }
        })
        .on('changed', (isSyncing) => {
            process.send({ isSyncing: isSyncing });
        })
        .on('error', (e) => {
            process.send({ error: e.message });
        });
};

let getGasEstimate = async(coinbase, bytecode, web3) => {
    if (!coinbase) {
        const error = new Error('No coinbase selected!');
        process.send({ error: error });
    }
    try {
        web3.eth.defaultAccount = coinbase;
        const gasEstimate = await web3.eth.estimateGas({
            from: web3.eth.defaultAccount,
            data: '0x' + bytecode,
        });
        process.send({ gasEstimate });
    } catch (e) {
        throw e;
    }
};

let getBalances = async(coinbase, web3) => {
    if (!coinbase) {
        const error = new Error('No coinbase selected!');
        process.send({ error: error });
    }
    try {
        const weiBalance = await web3.eth.getBalance(coinbase);
        const ethBalance = await web3.utils.fromWei(weiBalance, 'ether');
        process.send({ 'ethBalance': ethBalance });
    } catch (e) {
        process.send({ error: e.message });
    }
};

let setDefaultAccount = (coinbase, web3) => {
    try {
        web3.eth.defaultAccount = coinbase;
        process.send({ message: 'Default Account is set' });
    } catch (error) {
        process.send({ error: error.message });
    }
};

let setCoinbase = async(coinbase, web3) => {
    try {
        web3.eth.defaultAccount = coinbase;
        process.send('Coinbase set Successfull');
    } catch (e) {
        process.send({ error: e.message });
    }
};

let getSyncStat = async() => {
    try {
        process.send({ isSyncing: web3.eth.isSyncing() });
    } catch (e) {
        process.send({ error: e.message });
    }
};


let getAccounts = async(web3) => {
    try {
        let accounts = await web3.eth.getAccounts();
        process.send({ accounts });
    } catch (e) {
        process.send({ error: e.message });
    }
};

let getAccountsForNodeSubmit = async(node_type, node_url) => {
    try {
        if (web3 == !undefined) {
            web3.currentProvider.connection.close();
        }
        web3 = new Web3(node_url);
        let accounts = await web3.eth.getAccounts();
        process.send({ getAccountsForNodeSubmit: accounts, node_type });
    } catch (e) {
        process.send({ error: e.message });
    }
};

let isWsProvider = (web3) => {
    process.send({ isWsProvider: Object.is(web3.currentProvider.constructor, Web3.providers.WebsocketProvider) });
};
let isHttpProvider = (web3) => {
    process.send({ isHttpProvider: Object.is(web3.currentProvider.constructor, Web3.providers.HttpProvider) });
};

let checkConnection = (web3) => {
    try {
        if (web3.currentProvider) {
            web3.eth.isSyncing()
                .then(() => {
                    process.send({ hasConnection: true });
                })
                .catch(() => {
                    process.send({ error: { type: 'connection_error', message: 'Error could not connect to local geth instance!' } });
                })
        } else {
            process.send({ error: { type: 'connection_error', message: 'Error could not connect to local geth instance!' } });
        }
    } catch (error) {
        process.send({ error: { type: 'connection_error', message: error.message } });
    }
};

const create = async(args, web3) => {
    process.send({ 'prepareCreate': { args } });
    const { coinbase, password, abi, bytecode, gas, contractName, atAddress } = args;
    const address = atAddress ? atAddress : null;
    if (!coinbase) {
        const error = new Error('No coinbase selected!');
        process.send({ error: error.message });
    }
    web3.eth.defaultAccount = coinbase;
    try {
        if (password) {
            await web3.eth.personal.unlockAccount(coinbase, password);
        }
        try {
            const gasPrice = await web3.eth.getGasPrice();
            if(address) {
              globalContract = await new web3.eth.Contract(abi, address, {
                  from: web3.eth.defaultAccount,
                  gasPrice: web3.utils.toHex(gasPrice)
              });
            } else {
              globalContract = await new web3.eth.Contract(abi, {
                  from: web3.eth.defaultAccount,
                  data: '0x' + bytecode,
                  gas: web3.utils.toHex(gas),
                  gasPrice: web3.utils.toHex(gasPrice)
              });
            }
            process.send({ options: globalContract.options, contractName })
            return globalContract;
        } catch (e) {
            throw e;
        }
    } catch (e) {
        throw e;
    }
};
const deploy = async(contract, params, contractName, web3) => {
    try {
        params = params.map(param => {
            var reg = /\w+(?=\[\d*\])/g;
            return (param.type.match(reg) || param.type.endsWith('[]') || param.type.includes('tuple')) ? JSON.parse(param.value) : param.value;
        });
        contract.deploy({ arguments: params })
          .send({
              from: web3.eth.defaultAccount
          })
          .on('transactionHash', transactionHash => {
              process.send({ transactionHash, contractName });
          })
          .on('receipt', txReceipt => {
              process.send({ txReceipt });
          })
          .on('confirmation', confirmationNumber => {
              process.send({ confirmationNumber });
          })
          .on('error', error => {
              process.send({ error: error.message });
          })
          .then(instance => {
              instance.events.allEvents({ fromBlock: 'latest' })
                  .on('logs', (logs) => {
                      process.send({ logsEvents: logs });
                  })
                  .on('data', (data) => {
                      process.send({ dataEvents: data });
                  })
                  .on('changed', (changed) => {
                      process.send({ changedEvent: changed });
                  })
                  .on('error', (error) => {
                      process.send({ error: error.message });
                      console.log(error);
                  });
              contract.options.address = instance.options.address;
              process.send({ options: instance.options, contractName });
          });
    } catch (e) {
        console.log(e);
        process.send({ error: e.message });
    }
};

let getMining = async(web3) => {
    try {
        let isMining = web3.eth.isMining();
        process.send({ isMining });
    } catch (error) {
        process.send({ error: error.message });
    }
};
let getHashrate = async(web3) => {
    try {
        web3.eth.getHashrate()
          .then((getHashrate) => { process.send({ getHashrate }); });
    } catch (error) {
        process.send({ error: error.message });
    }
};
let getGasLimit = async(web3) => {
    try {
        const block = await web3.eth.getBlock('latest');
        let gasLimit = block.gasLimit;
        process.send({ gasLimit });
    } catch (error) {
        process.send({ error: error.message });
    }
};

let call = async(args, web3) => {
    const coinbase = args.coinbase;
    const password = args.password;
    const contract = args.contract;
    const abiItem = args.abiItem;
    var params = args.params || [];
    web3.eth.defaultAccount = coinbase;
    try {
        // Prepare params for call
        params = params.map(param => {
            var reg = /\w+(?=\[\d*\])/g;
            if (param.type.match(reg) || param.type.endsWith('[]') || param.type.includes('tuple')) {
                return JSON.parse(param.value);
            }
            if (param.type.indexOf('int') > -1) {
                return new web3.utils.BN(param.value).toNumber();
            }
            return param.value;
        });

        // Handle fallback
        if (abiItem.type === 'fallback') {
            if (password) {
                await web3.eth.personal.unlockAccount(coinbase, password);
            }
            const result = await web3.eth.sendTransaction({
                from: coinbase,
                to: contract.options.address,
                value: abiItem.payableValue || 0
            });
            process.send({ callResult: result, address: contract.options.address });
            return false;
        }

        if (abiItem.constant === false || abiItem.payable === true) {
            if (password) {
                await web3.eth.personal.unlockAccount(coinbase, password);
            }
            if (params.length > 0) {
                const result = await globalContract.methods[abiItem.name](...params).send({ from: coinbase, value: abiItem.payableValue });
                process.send({ callResult: result, address: contract.options.address });
                return;
            }
            const result = await globalContract.methods[abiItem.name](...params).send({ from: coinbase, value: abiItem.payableValue });
            process.send({ callResult: result, address: contract.options.address });
            return;

        }
        if (params.length > 0) {
            const result = await globalContract.methods[abiItem.name](...params).call({ from: coinbase });
            process.send({ callResult: result, address: contract.options.address });
            return;
        }
        const result = await globalContract.methods[abiItem.name](...params).call({ from: coinbase });
        process.send({ callResult: result, address: contract.options.address });
        return;
    }
    catch (e) {
        process.send({ error: e.message });
    }
};

let send = async(params, web3) => {
    try {
        const coinbase = web3.eth.defaultAccount;
        if (params.password) {
            web3.eth.personal.unlockAccount(coinbase, params.password);
        }

        web3.eth.sendTransaction({
            from: coinbase,
            to: params.to,
            value: params.amount
        })
            .on('transactionHash', txHash => {
                process.send({ transactionHashonSend: txHash, head: 'Transaction hash:' });
            })
            .then(txRecipt => {
                process.send({ txReciptonSend: txRecipt, head: 'Transaction recipt:' });
            })
            .catch(e => {
                process.send({ error: e.message });
            });
    } catch (e) {
        process.send({ error: e.message });
    }
};
let inputsToArray = async(paramObject, web3) => {
    let inputsToArray;
    if (paramObject.type.endsWith('[]')) {
        inputsToArray = paramObject.value.split(',').map(val => web3.utils.toHex(val.trim()));
        process.send({ inputsToArray });
        return;
    }
    inputsToArray = web3.utils.toHex(paramObject.value);
    process.send({ inputsToArray });
};

let getTxAnalysis = async(txHash, web3) => {
    try {
        const transaction = await web3.eth.getTransaction(txHash);
        const transactionRecipt = await web3.eth.getTransactionReceipt(txHash);
        process.send({ transaction, transactionRecipt });
    } catch (e) {
        process.send({ error: e.message });
    }
};

process.on('message', async(message) => {
    try {
        if (message.action === 'set_rpc_ws') {
            if (Object.keys(web3).length === 0 && web3.constructor === Object) {
                process.send({ w: web3 });
                if (message.hasOwnProperty('websocketAddress') && message.websocketAddress.length > 0) {
                    web3 = createConnection(message.websocketAddress);
                    process.send({ connected: true });
                    process.send(`Web3 Connection is Established on ${message.websocketAddress}`);
                } else if (message.hasOwnProperty('rpcAddress') && message.rpcAddress.length > 0 && message.websocketAddress.length == 0) {
                    web3 = createConnection(message.rpcAddress);
                    process.send({ connected: true });
                    process.send(`Web3 Connection is Established on ${message.rpcAddress}`);
                } else {
                    process.send({ error: 'send rpc or ws address for establishing successfull connection' });
                }
            }
        }
        // transaction process subscription
        if (message.action === 'subscribeTransaction') {
            onTransaction(web3);
            process.send({ transactionSubscribed: true, message: 'transaction has been subscribed' });
        }
        // eth connection subscription
        if (message.action === 'ethSubscription') {
            subscription(web3);
            process.send({ ethSubscribed: true, message: 'ETH chanel has been subscribed' });
        }
        // get Gas Estimate
        if (message.action === 'getGasEstimate' && message.hasOwnProperty('coinbase') && message.hasOwnProperty('bytecode')) {
            await getGasEstimate(message.coinbase, message.bytecode, web3);
        }
        // get Balance
        if (message.action === 'get_balances' && message.hasOwnProperty('coinbase')) {
            getBalances(message.coinbase, web3);
        }
        if (message.action === 'default_account_set' && message.hasOwnProperty('coinbase')) {
            await setDefaultAccount(message['coinbase'], web3);
        }
        if (message.action === 'set_coinbase' && message.hasOwnProperty('coinbase')) {
            await setCoinbase(message.coinbase, web3);
        }
        if (message.action === 'sync_stat') {
            await getSyncStat();
        }
        if (message.action === 'check_connection') {
            await checkConnection(web3);
        }
        if (message.action === 'isWsProvider') {
            isWsProvider(web3);
        }
        if (message.action == 'isHttpProvider') {
            isHttpProvider(web3);
        }
        if (message.action === 'getAccounts') {
            getAccounts(web3);
        }
        if (message.action === 'create' && message.hasOwnProperty('argumentsForCreate')) {
            const args = message['argumentsForCreate'];
            const { params, contractName, atAddress } = args
            const contract = await create(args, web3);
            if(!atAddress) {
              deploy(contract, params, contractName, web3);
            }
        }
        if (message.action === 'getMiningStatus') {
            getMining(web3);
        }
        if (message.action === 'getHashrateStatus') {
            getHashrate(web3);
        }
        if (message.action === 'getGasLimit') {
            getGasLimit(web3);
        }
        if (message.action === 'getAccountsForNodeSubmit' && message.hasOwnProperty('node_url')) {
            getAccountsForNodeSubmit(message['node_type'], message['node_url']);
        }
        if (message.action === 'callDeployedContract' && message.hasOwnProperty('argumentsForCall')) {
            const args = message['argumentsForCall'];
            call(args, web3);
        }
        if (message.action === 'sendTransaction') {
            send(message.params, web3);
        }
        if (message.action === 'inputsToArray') {
            inputsToArray(message.paramObject, web3);
        }
        if (message.action === 'getTxAnalysis') {
            getTxAnalysis(message.txHash, web3);
        }
    } catch (error) {
        process.send({ error: error.message });
    }
});
module.exports = {};
