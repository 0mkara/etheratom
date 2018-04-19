'use babel'
import { combineReducers } from 'redux'
import ContractReducer from './ContractReducer'
import AccountReducer from './AccountReducer'
import ErrorReducer from './ErrorReducer'
import EventReducer from './EventReducer'
import ClientReducer from './ClientReducer'
import NodeReducer from './NodeReducer'
 
export default combineReducers({
    contract: ContractReducer,
    account: AccountReducer,
    errors: ErrorReducer,
    eventReducer: EventReducer,
    clientReducer: ClientReducer,
    node: NodeReducer
});
