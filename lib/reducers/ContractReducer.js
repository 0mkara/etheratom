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
import {
    SET_SOURCES,
    SET_COMPILING,
    SET_DEPLOYED,
    SET_COMPILED,
    RESET_COMPILED,
    RESET_CONTRACTS,
    SET_INSTANCE,
    SET_PARAMS,
    ADD_INTERFACE,
    UPDATE_INTERFACE,
    UPDATE_OPTIONS,
    ADD_TX_HASH,
    SET_GAS_LIMIT,
    SET_GAS_ESTIMATE
} from '../actions/types';
const INITIAL_STATE = {
    compiled: null,
    compiling: false,
    deployed: false,
    interfaces: null,
    contracts: null,
    instances: null,
    gasLimit: 0,
    gasEstimate: 90000
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_SOURCES:
            return { ...state, sources: action.payload };
        case SET_COMPILING:
            return { ...state, compiling: action.payload };
        case SET_DEPLOYED:
            return { ...state, deployed: { ...state.deployed, [action.payload.contractName]: action.payload.deployed } };
        case SET_COMPILED:
            return { ...state, compiled: action.payload };
        case RESET_CONTRACTS:
            return { ...INITIAL_STATE };
        case RESET_COMPILED:
            return { ...state, compiled: null, deployed: false, interfaces: null, instances: null };
        case SET_INSTANCE:
            return { ...state, instances: { ...state.instances, [action.payload.contractName]: action.payload.instance } };
        case SET_PARAMS:
            return { ...state, interfaces: { ...state.interfaces, [action.payload.contractName]: { interface: action.payload.interface } } };
        case ADD_INTERFACE:
            return { ...state, interfaces: { ...state.interfaces, [action.payload.contractName]: { interface: action.payload.interface } } };
        case UPDATE_INTERFACE:
            return { ...state, interfaces: { ...state.interfaces, [action.payload.contractName]: { interface: action.payload.interface } } };
        case UPDATE_OPTIONS:
            // We want to access contracts like following:
            // contracts[myContract].options, contracts[myContract].methods, contracts[myContract].events
            return {
              ...state,
              contracts: {
                ...state.contracts,
                [action.payload.contractName]: {
                  options: action.payload.options,
                  transactionHash: (state.contracts && state.contracts[action.payload.contractName]) ? state.contracts[action.payload.contractName].transactionHash : null
                }
              }
            };
        case ADD_TX_HASH:
            return {
              ...state,
              contracts: {
                ...state.contracts,
                [action.payload.contractName]: {
                  transactionHash: action.payload.transactionHash,
                  options: state.contracts[action.payload.contractName].options
                }
              }
            };
        case SET_GAS_LIMIT:
            return { ...state, gasLimit: action.payload };
        case SET_GAS_ESTIMATE:
            return { ...state, gasEstimate: action.payload.gasEstimate };
        default:
            return state;
    }
};
