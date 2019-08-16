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
import { ADD_PENDING_TRANSACTION, ADD_EVENTS, SET_EVENTS, TEXT_ANALYSIS } from '../actions/types';
const INITIAL_STATE = {
    pendingTransactions: [],
    events: [],
    txAnalysis: {}
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_PENDING_TRANSACTION:
            return { ...state, pendingTransactions: [...state.pendingTransactions, action.payload] };
        case ADD_EVENTS:
            return { ...state, events: [...state.events, action.payload] };
        case SET_EVENTS:
            return { ...state, events: [] };
        case TEXT_ANALYSIS:
            return { ...state, txAnalysis: action.payload };
        default:
            return state;
    }
};
