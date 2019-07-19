const Web3 = require('web3');


let createConnection = () => { 
    return new Web3('ws://127.0.0.1:8546');    
};

let onTransaction = (web3) => {
    web3.eth.subscribe('pendingTransactions')
        .on('data' , (transaction) => {
            process.send({transaction:transaction});
            return {transaction:transaction};
        })
        .on('error', (e) =>{
            return e;
        });
};

let subscription = (web3) => {
    web3.eth.subscribe('syncing')
        .on('data', (sync) => {
            if(typeof(sync) === 'boolean') {
                process.send ({ isBoolean:'true' });
            }
            if(typeof(sync) === 'object') {
                process.send ({isObject:'true'});
                return {isObject:'true'};
            }           
        })
        .on('changed', (isSyncing) => {
            process.send ({isSyncing:'true'});
            return isSyncing;
        })
        .on('error', (e) => {
            return e;
        });
};

process.on('message', async(message) => {
    try {
        const web3 = createConnection();
        try {
            const transactionData  = onTransaction(web3);
            process.send('transactionData');
        } catch (error) {
            process.send(error.message);
        }

        try {
            const onSubscribe = subscription(web3);
            process.send({onSubscribe});
        } catch (error) {
            process.send(error.message);
        }        
        
        // let combineData  = {};
        // combineData.transactionData = transactionData;
        // combineData.onSubscribe = onSubscribe;
        // combineData['web3'] = web3;
        // process.send(combineData);
    } catch (error) {
        process.send({error:error.message});
    }
    
   

    
});

module.exports = {};
