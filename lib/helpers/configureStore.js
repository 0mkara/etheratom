'use babel'
import etheratomReducers from '../reducers'
import logger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

export default function configureStore(initialState) {
    const store = createStore(
        etheratomReducers,
        initialState,
        applyMiddleware(logger)
    );
    return store;
}
