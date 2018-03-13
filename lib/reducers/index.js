'use babel'
import { combineReducers } from 'redux'
import ContractReducer from './ContractReducer'
import AccountReducer from './AccountReducer'
 
export default combineReducers({
    contract: ContractReducer,
    account: AccountReducer
});
