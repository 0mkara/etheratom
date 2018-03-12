'use babel'
import etheratomReducers from '../reducers'
import logger from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

export default function configureStore(initialState) {
    const store = createStore(
        etheratomReducers,
        initialState,
        applyMiddleware(logger, ReduxThunk)
    );
    return store;
}
