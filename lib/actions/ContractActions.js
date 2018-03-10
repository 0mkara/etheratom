'use babel'
import { COMPILED } from './types';
export const contractCompiled = (dispatch, compiled) => {
    dispatch({ type: COMPILED, payload: compiled });
};
