'use babel'
import { COMPILED, SET_PARAMS, ADD_INTERFACE } from '../actions/types';
const INITIAL_STATE = {
  compiled: null,
  compiling: false,
  interfaces: {}
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COMPILED:
            return { ...state, compiled: action.payload };
        case SET_PARAMS:
            return { ...state, interfaces: { ...state.interfaces, [action.payload.contractName]: { abi: action.payload.abi } } };
        case ADD_INTERFACE:
            return { ...state, interfaces: { ...state.interfaces, [action.payload.contractName]: { abi: action.payload.abi } } }
        default:
            return state;
    }
}
