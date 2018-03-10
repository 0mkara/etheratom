'use babel'
import { combineReducers } from 'redux'
import ContractReducer from './ContractReducer'
 
export default combineReducers({
    contract: ContractReducer
});
