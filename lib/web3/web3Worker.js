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
            from: this.web3.eth.defaultAccount,
            data: '0x' + bytecode,
        });
        process.send({ gasEstimate });
        process.send({ gasEstimate: gasEstimate });
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
        const ethBalance = { ethBalance: Math.random() };
        process.send({ ethBalance });
    } catch (e) {
        process.send({ error: e.message });
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
                    onTransaction(web3);
                    process.send('transactionData');
                    subscription(web3);
                    process.send('onSubscribe');
                } else if (message.hasOwnProperty('rpcAddress') && message.rpcAddress.length > 0 && message.websocketAddress.length == 0) {
                    web3 = createConnection(message.rpcAddress);
                    process.send(`Web3 Connection is Established on ${message.rpcAddress}`);
                    onTransaction(web3);
                    process.send('transactionData');
                    subscription(web3);
                    process.send('onSubscribe');
                } else {
                    process.send({ error: 'send rpc or ws address for establishing successfull connection' });
                }
            } else {
                if (message.hasOwnProperty('coinbase') && message.hasOwnProperty('bytecode')) {
                    await getGasEstimate(message.coinbase, message.bytecode, web3);
                }
                if (message.action_2 === 'get_balances') {
                    await getBalances(message.coinbase);
                }
            }
        }
    } catch (error) {
        process.send({ error: error.message });
    }
});
module.exports = {};
