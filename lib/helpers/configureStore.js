'use babel'
import etheratomReducers from '../reducers'
import { createStore, combineReducers } from 'redux'

export default function configureStore(initialState) {
    const store = createStore(etheratomReducers, initialState);
    return store;
}
