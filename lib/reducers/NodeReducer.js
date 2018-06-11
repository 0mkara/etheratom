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
import { SET_SYNC_STATUS, SET_SYNCING, SET_MINING, SET_HASH_RATE } from '../actions/types';
const INITIAL_STATE = {
    syncing: false,
    status: {},
    mining: false,
    hashRate: 0
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_SYNCING:
            return { ...state, syncing: action.payload };
        case SET_SYNC_STATUS:
            return { ...state, status: action.payload };
        case SET_MINING:
            return { ...state, mining: action.payload };
        case SET_HASH_RATE:
            return { ...state, hashRate: action.payload };
        default:
            return state;
    }
};
