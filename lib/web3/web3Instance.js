'use babel'
import { showPanelError } from '../helpers/uiHelpers';
import { fork } from 'child_process';

import {
    ADD_PENDING_TRANSACTION,
    SET_SYNC_STATUS,
    SET_SYNCING,
    SET_BALANCE
} from '../actions/types';

export default class web3Instance {
    constructor(store) {
        this.store = store;

        this.web3ProcessHandler = this.web3ProcessHandler.bind(this);
        this.createConnection();
        this.web3Instance.on('message', m => {
            this.web3ProcessHandler(m);
        });
    }
    createConnection() {
        const rpcAddres = atom.config.get('etheratom.rpcAddress');
        const websocketAddress = atom.config.get('etheratom.websocketAddress');
        const pkgPath = atom.packages.resolvePackagePath('etheratom');
        this.web3Instance = fork(`${pkgPath}/lib/web3/web3Worker.js`);
        this.web3Instance.send({ action: 'set_rpc_ws', rpcAddres, websocketAddress });
    }
    web3ProcessHandler(message) {
        console.log(this.store);
        if (message.hasOwnProperty('transaction')) {
            this.store.dispatch({ type: ADD_PENDING_TRANSACTION, payload: message.transaction });
        } else if (message.hasOwnProperty('isBooleanSync')) {
            this.store.dispatch({ type: SET_SYNCING, payload: message['isBooleanSync'] });
        } else if (message.hasOwnProperty('isObjectSync')) {
            const sync = message['isObjectSync'];
            this.store.dispatch({ type: SET_SYNCING, payload: sync.syncing });
            const status = {
                currentBlock: sync.status.CurrentBlock,
                highestBlock: sync.status.HighestBlock,
                knownStates: sync.status.KnownStates,
                pulledStates: sync.status.PulledStates,
                startingBlock: sync.status.StartingBlock
            };
            this.store.dispatch({ type: SET_SYNC_STATUS, payload: status });
        } else if (message.hasOwnProperty('syncStarted') && message['syncStarted']) {
            console.log('%c syncing:data ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        } else if (message.hasOwnProperty('isSyncing')) {
            console.log('%c syncing:changed ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
            console.log(message['isSyncing']);
        } else if (message.hasOwnProperty('error')) {
            console.log('%c syncing:error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', message.error);
        }
    }

    async getBalance(coinbase) {
        this.web3Instance.kill();
        this.createConnection();
        this.web3Instance.send({ action: 'set_rpc_ws', action_2: 'get_balances', coinbase });
        this.web3Instance.on('message', m => {
            if (m.hasOwnProperty('ethBalance')) {
                console.log('balances mil gaya');
                this.store.dispatch({ type: SET_BALANCE, payload: m['ethBalance']['ethBalance'] });
                console.log(this.store.getState());
            }
        });
    }

}