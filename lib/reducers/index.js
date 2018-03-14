'use babel'
import { combineReducers } from 'redux'
import ContractReducer from './ContractReducer'
import AccountReducer from './AccountReducer'
import ErrorReducer from './ErrorReducer'
 
export default combineReducers({
    contract: ContractReducer,
    account: AccountReducer,
    errors: ErrorReducer
});
