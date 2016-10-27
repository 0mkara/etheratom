const fs = require('fs')

const SOLJSON_PATH = __dirname + '/node_modules/solc/soljson.js';
const MODULE_OVERRIDE = 'var Module = {"ENVIRONMENT": "NODE"};';
const ENVIRONMENT_OVERRIDE_FROM = 'var ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;var ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;'
const ENVIRONMENT_OVERRIDE_TO = 'var ENVIRONMENT_IS_NODE=true;'

const solSrc = fs.readFileSync(SOLJSON_PATH, 'utf8').replace(ENVIRONMENT_OVERRIDE_FROM, ENVIRONMENT_OVERRIDE_TO);

fs.writeFileSync(SOLJSON_PATH, MODULE_OVERRIDE + solSrc)
