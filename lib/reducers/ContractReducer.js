'use babel'
import { COMPILED } from '../actions/types';
const INITIAL_STATE = {
  compiled: null,
  compiling: false
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COMPILED:
            return { ...state, compiled: action.payload };
        default:
            return state;
    }
}
