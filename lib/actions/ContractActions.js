'use babel'
// Copyright 2018 Etheratom Authors
// This file is part of Etheratom.

// Etheratom is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Etheratom is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Etheratom.  If not, see <http://www.gnu.org/licenses/>.
import { SET_COMPILED, SET_PARAMS, ADD_INTERFACE, SET_DEPLOYED, SET_INSTANCE, SET_GAS_ESTIMATE } from './types';

export const contractCompiled = (dispatch, compiled) => {
    dispatch({ type: SET_COMPILED, payload: compiled });
};

export const setParamsInput = ({ contractName, abi }) => {
    return (dispatch) => {
        dispatch({ type: SET_PARAMS, payload: { contractName, abi } });
    };
};

export const addInterface = ({ contractName, ContractABI }) => {
    return (dispatch) => {
        dispatch({ type: ADD_INTERFACE, payload: { contractName, interface: ContractABI } });
    };
};

export const updateInterface = ({ contractName, ContractABI }) => {
    return (dispatch) => {
        dispatch({ type: ADD_INTERFACE, payload: { contractName, interface: ContractABI } });
    };
};

export const setInstance = ({ contractName, instance }) => {
    return (dispatch) => {
        dispatch({ type: SET_INSTANCE, payload: { contractName, instance } });
    };
};

export const setDeployed = ({ contractName, deployed }) => {
    return (dispatch) => {
        dispatch({ type: SET_DEPLOYED, payload: { contractName, deployed } });
    };
};

export const setGasEstimate = ({ gasEstimate }) => {
    return (dispatch) => {
        dispatch({ type: SET_GAS_ESTIMATE, payload: { gasEstimate } });
    };
};
