'use babel'
import { COMPILED, SET_PARAMS, ADD_INTERFACE } from './types';

export const contractCompiled = (dispatch, compiled) => {
    dispatch({ type: COMPILED, payload: compiled });
};

export const setParamsInput = ({ contractName, abi }) => {
    return (dispatch) => {
        dispatch({ type: SET_PARAMS, payload: { contractName, abi } });
    }
};

export const addInterface = ({ contractName, ContractABI }) => {
    return (dispatch) => {
        dispatch({ type: ADD_INTERFACE, payload: { contractName, abi: ContractABI } });
    }
};
