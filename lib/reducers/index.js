'use babel'
import { combineReducers } from 'redux'

function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
};

const etheratomReducers = combineReducers({
    counter
});
 
export default etheratomReducers;
