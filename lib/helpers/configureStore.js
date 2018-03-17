'use babel'
import etheratomReducers from '../reducers'
import logger from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

export default function configureStore(initialState) {
    const middleWares = [ReduxThunk];
    if(atom.inDevMode()) {
        middleWares.push(logger);
    }
    const store = createStore(
        etheratomReducers,
        initialState,
        applyMiddleware(...middleWares)
    );
    return store;
}
