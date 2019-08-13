const Web3 = require('web3');

let web3 = {};

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

let getGasEstimate = async (coinbase, bytecode, web3) => {
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

let getBalances = async (coinbase) => {
    if (!coinbase) {
        const error = new Error('No coinbase selected!');
        process.send({ error: error });
    }
    try {
        const weiBalance = await web3.eth.getBalance(coinbase);
        //const ethBalance = await web3.utils.fromWei(weiBalance, 'ether');
        const ethBalance = { ethBalance: Math.random().toFixed(2) * 100 };
        process.send(ethBalance);
    } catch (e) {
        process.send({ error: e.message });
    }
};

let setDefaultAccount = (coinbase, web3) => {
    web3.eth.defaultAccount = coinbase;
};

let setCoinbase = async (coinbase, web3) => {
    try {
        web3.eth.defaultAccount = coinbase;
        process.send('Coinbase set Successfull');
    } catch (e) {
        process.send({ error: e.message });
    }
};

let getSyncStat = async () => {
    try {
        process.send({ isSyncing: web3.eth.isSyncing() });
    } catch (e) {
        process.send({ error: e.message });
    }
};


let getAccounts = async (web3) => {
    try {
        let accounts = await web3.eth.getAccounts();
        // accounts = [Math.random()];
        // setTimeout(function () {
        //     console.log('finished doing some long task');
        //     process.send({ accounts });
        // }, 3000);
        process.send({ accounts });
    } catch (e) {
        process.send({ error: e.message });
    }
};

let getAccountsForNodeSubmit = async (web3, node_type, node_url) => {
    try {
        web3.currentProvider.connection.close();
        web3 = new Web3(node_url);
        let accounts = await web3.eth.getAccounts();
        // accounts = [Math.random()];
        // setTimeout(function () {
        //     console.log('finished doing some long task');
        //     process.send({ accounts });
        // }, 3000);
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
    // function a() {
    //     process.send({ hasConnection: true });
    // }
    try {
        let haveConn;
        haveConn = web3.currentProvider;
        if (!haveConn) {
            process.send({ error: 'Error could not connect to local geth instance!' });
        } else {
            process.send({ hasConnection: true });
        }
    } catch (error) {
        process.send({ error: error.message });
    }
};

let create = async (args, web3) => {
  process.send({ 'prepareCreate': { args } })
    const { coinbase, password, abi, bytecode, gas } = args;

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
            // const gasPrice = await web3.eth.getGasPrice();
            const gasPrice = 20000000000;
            const contract = await new web3.eth.Contract(abi, {
                from: web3.eth.defaultAccount,
                data: '0x' + bytecode,
                gas: web3.utils.toHex(gas),
                gasPrice: web3.utils.toHex(gasPrice)
            });
            let contractObject = { contract, contractName: args.contractName };
            process.send({ contractObject });
            return contractObject;
        } catch (e) {
            process.send({ error: e.message });
        }
    } catch (e) {
        process.send({ error: e.message });
    }
};
const deploy = async (contract, params, web3) => {
  process.send({ 'prepareDeploy': { contract, params } })
    try {
        params = params.map(param => {
            return param.type.endsWith('[]') ? param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',') : param.value;
        });
        contract.contract.deploy({
            arguments: params
        })
            .send({
                from: web3.eth.defaultAccount
            })
            .on('transactionHash', transactionHash => {
                process.send({ transactionHash, contractName: contract.contractName });
                // contractInstance.emit('transactionHash', transactionHash);
            })
            .on('receipt', txReceipt => {
                process.send({ txReceipt });
                // contractInstance.emit('receipt', txReceipt);

            })
            .on('confirmation', confirmationNumber => {
                process.send({ confirmationNumber });
                // contractInstance.emit('confirmation', confirmationNumber);
            })
            .on('error', error => {
                process.send({ error: error.message });
                // contractInstance.emit('error', error);
            })
            .then(instance => {
                instance.events.allEvents({ fromBlock: 'latest' })
                    .on('logs', (logs) => {
                        process.send({ logsEvents: logs });
                        // this.props.addNewEvents({ payload: logs });
                    })
                    .on('data', (data) => {
                        process.send({ dataEvents: data });
                        // this.props.addNewEvents({ payload: data });
                    })
                    .on('changed', (changed) => {
                        process.send({ changedEvent: changed });
                        // this.props.addNewEvents({ payload: changed });
                    })
                    .on('error', (error) => {
                        process.send({ error: error.message });
                        console.log(error);
                    });
                process.send({ address: instance.options.address, contractName: contract.contractName });
                // contractInstance.emit('address', instance.options.address);
                // contractInstance.emit('instance', instance);
            });
        // return contractInstance;
    } catch (e) {
        console.log(e);
        // throw e;
        process.send({ error: e.message });
    }
};

let getMining = async (web3) => {
    try {
        let isMining = web3.eth.isMining();
        process.send({ isMining });
    } catch (error) {
        process.send({ error: error.message });
    }

};
let getHashrate = async (web3) => {
    try {
        let getHashrate = web3.eth.getHashrate();
        process.send({ getHashrate });
    } catch (error) {
        process.send({ error: error.message });
    }

};
let getGasLimit = async (web3) => {
    try {
        const block = await web3.eth.getBlock('latest');
        let gasLimit = block.gasLimit;
        process.send({ gasLimit });
    } catch (error) {
        process.send({ error: error.message });
    }
};
process.on('message', async (message) => {
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
            await getBalances(message.coinbase);
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
        } if (message.action === 'isWsProvider') {
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
            const { params } = args
            const contract = await create(args, web3);
            deploy(contract, params, web3);
        }
        if (message.action === 'getMiningStatus') {
            getMining(web3);
        }
        if (message.action === 'getHashrateStatus') {
            getHashrate(web3);
        }
        if (message.action === 'getGasLimit') {
            getGasLimit(web3);
        } if (message.action === 'getAccountsForNodeSubmit' && message.hasOwnProperty('node_url')) {
            getAccountsForNodeSubmit(web3, message['node_type'], message['node_url']);
        }
    } catch (error) {
        process.send({ error: error.message });
    }
});
module.exports = {};
