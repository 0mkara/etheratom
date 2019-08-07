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
import { SET_ERRORS, RESET_ERRORS } from '../actions/types';
const INITIAL_STATE = {
    errormsg: [],
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case SET_ERRORS:
        return { ...state, errormsg: action.payload };
    case RESET_ERRORS:
        return { ...INITIAL_STATE };
    default:
        return state;
    }
};
