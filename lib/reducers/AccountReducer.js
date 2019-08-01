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
import { SET_COINBASE, SET_PASSWORD, SET_ACCOUNTS, SET_BALANCE } from '../actions/types';
const INITIAL_STATE = {
    coinbase: '',
    password: false,
    accounts: [],
    balance: 0.00,
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_COINBASE:
            return { ...state, coinbase: action.payload };
        case SET_PASSWORD:
            return { ...state, password: action.payload.password };
        case SET_ACCOUNTS:
            return { ...state, accounts: action.payload };
        case SET_BALANCE:
            return { ...state, balance: action.payload };
        default:
            return state;
    }
};
