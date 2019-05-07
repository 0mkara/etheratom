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
    SET_GAS_LIMIT
} from '../actions/types';
const INITIAL_STATE = {
    compiled: null,
    compiling: false,
    compile_btn_value:'Compile',
    compile_btn_class:'btn-success',
    deployed: false,
    interfaces: null,
    instances: null,
    gasLimit: 0
};
export default (state = INITIAL_STATE, action) => {
    let btn_text_value = '';
    let btn_class_name = '';
    switch (action.type) {
    case SET_SOURCES:
        return { ...state, sources: action.payload };
    case SET_COMPILING:
        if(action.payload){
            btn_text_value = 'Compiling';
            btn_class_name = 'btn-success';
        }else if(state.compiled.hasOwnProperty('errors')){
            btn_text_value = 'Error';
            btn_class_name = 'btn-error';
        } else{
            btn_text_value = 'Compile';
            btn_class_name = 'btn-success';
        }
        return { ...state, compiling: action.payload, compile_btn_value: btn_text_value, compile_btn_class:btn_class_name };
    case SET_DEPLOYED:
        return { ...state, deployed: { ...state.deployed, [action.payload.contractName]: action.payload.deployed } };
    case SET_COMPILED:
        if(action.payload.hasOwnProperty('errors')){
            btn_text_value = 'Error';
            btn_class_name = 'btn-error';
        }else{
            btn_text_value = 'Compile';
            btn_class_name = 'btn-success';
        }
        return { ...state, compiled: action.payload, compile_btn_value: btn_text_value, compile_btn_class:btn_class_name };
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
    case SET_GAS_LIMIT:
        return { ...state, gasLimit: action.payload };
    default:
        return state;
    }
};
