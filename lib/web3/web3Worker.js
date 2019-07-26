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

let create = async ({ ...args }, web3) => {
    const coinbase = args.coinbase;
    const password = args.password;
    const abi = args.abi;
    const code = args.bytecode;
    const gasSupply = args.gas;

    if (!coinbase) {
        const error = new Error('No coinbase selected!');
        process.send({ error: error });
    }
    web3.eth.defaultAccount = coinbase;
    try {
        if (password) {
            await web3.eth.personal.unlockAccount(coinbase, password);
        }
        try {
            const gasPrice = await web3.eth.getGasPrice();
            const contract = await new web3.eth.Contract(abi, {
                from: web3.eth.defaultAccount,
                data: '0x' + code,
                gas: web3.utils.toHex(gasSupply),
                gasPrice: web3.utils.toHex(gasPrice)
            });
            process.send({ contract });
        } catch (e) {
            process.send({ error: e.message });
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
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
            // setTimeout(function () {
            //     console.log('finished doing some long task');
            //     process.send({ hasConnection: true });
            // }, 3000);

        }
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
        }
    } catch (error) {
        process.send({ error: error.message });
    }
});
module.exports = {};
