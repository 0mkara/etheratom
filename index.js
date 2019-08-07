'use babel'
import 'idempotent-babel-polyfill';
import { Etheratom } from './lib/ethereum-interface';

module.exports = new Etheratom({
    config: atom.config,
    workspace: atom.workspace
});
