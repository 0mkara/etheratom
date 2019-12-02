'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('idempotent-babel-polyfill');
var atom$1 = require('atom');
var md5 = _interopDefault(require('md5'));
var atomMessagePanel = require('atom-message-panel');
var child_process = require('child_process');
var axios = _interopDefault(require('axios'));
var validUrl = _interopDefault(require('valid-url'));
var fs = _interopDefault(require('fs'));
var React = require('react');
var React__default = _interopDefault(React);
var ReactDOM = _interopDefault(require('react-dom'));
var reactTabs = require('react-tabs');
var reactRedux = require('react-redux');
var PropTypes = _interopDefault(require('prop-types'));
var reactCollapse = require('react-collapse');
var ReactJson = _interopDefault(require('react-json-view'));
var fileSaver = require('file-saver');
var VirtualList = _interopDefault(require('react-tiny-virtual-list'));
var remixLib = require('remix-lib');
var remixDebug = require('remix-debug');
var remixAnalyzer = require('remix-analyzer');
var CheckboxTree = _interopDefault(require('react-checkbox-tree'));
var redux = require('redux');
var logger = _interopDefault(require('redux-logger'));
var ReduxThunk = _interopDefault(require('redux-thunk'));

class AtomSolidityView {
  constructor() {
    this.element = document.createElement;
    this.element = document.createElement('atom-panel');
    this.element.classList.add('etheratom-panel');
    let att = null; // empty div to handle resize

    let resizeNode = document.createElement('div');
    resizeNode.onmousedown = this.handleMouseDown.bind(this);
    resizeNode.classList.add('etheratom-panel-resize-handle');
    resizeNode.setAttribute('ref', 'resizehandle');
    this.element.appendChild(resizeNode);
    let mainNode = document.createElement('div');
    mainNode.classList.add('etheratom');
    mainNode.classList.add('native-key-bindings');
    mainNode.setAttribute('tabindex', '-1');
    let message = document.createElement('div');
    message.textContent = 'Etheratom IDE';
    message.classList.add('compiler-info');
    message.classList.add('block');
    message.classList.add('highlight-info');
    mainNode.appendChild(message);
    let compilerNode = document.createElement('div');
    att = document.createAttribute('id');
    att.value = 'client-options';
    compilerNode.setAttributeNode(att);
    mainNode.appendChild(compilerNode);
    let loaderNode = document.createElement('div');
    att = document.createAttribute('id');
    att.value = 'loader';
    loaderNode.setAttributeNode(att);
    mainNode.appendChild(loaderNode);
    let versionNode = document.createElement('div');
    att = document.createAttribute('id');
    att.value = 'version_selector';
    versionNode.setAttributeNode(att);
    mainNode.appendChild(versionNode);
    let accountsNode = document.createElement('div');
    att = document.createAttribute('id');
    att.value = 'accounts-list';
    accountsNode.setAttributeNode(att);
    mainNode.appendChild(accountsNode);
    let buttonNode = document.createElement('div');
    att = document.createAttribute('id');
    att.value = 'common-buttons';
    buttonNode.setAttributeNode(att);
    buttonNode.classList.add('block');
    let compileButton = document.createElement('div');
    att = document.createAttribute('id');
    att.value = 'compile_btn';
    compileButton.setAttributeNode(att);
    compileButton.classList.add('inline-block');
    buttonNode.appendChild(compileButton);
    mainNode.appendChild(buttonNode);
    let tabNode = document.createElement('div');
    att = document.createAttribute('id');
    att.value = 'tab_view';
    tabNode.setAttributeNode(att);
    mainNode.appendChild(tabNode);
    let errorNode = document.createElement('div');
    att = document.createAttribute('id');
    att.value = 'compiled-error';
    errorNode.setAttributeNode(att);
    errorNode.classList.add('compiled-error');
    mainNode.appendChild(errorNode); // Finally append mainNode to element

    this.element.appendChild(mainNode);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.dispose = this.dispose.bind(this);
    this.getElement = this.getElement.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  handleMouseDown(e) {
    if (this.subscriptions != null) {
      this.subscriptions.dispose();
    }

    const mouseUpHandler = e => this.handleMouseUp(e);

    const mouseMoveHandler = e => this.handleMouseMove(e);

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
    this.subscriptions = new atom$1.CompositeDisposable({
      dispose: () => {
        window.removeEventListener('mousemove', mouseMoveHandler);
      }
    }, {
      dispose: () => {
        window.removeEventListener('mouseup', mouseUpHandler);
      }
    });
  }

  handleMouseMove(e) {
    // Currently only vertical panel is working, may be later I should add horizontal panel
    const width = this.element.getBoundingClientRect().right - e.pageX;
    const vwidth = window.innerWidth;
    const vw = width / vwidth * 100 + 'vw';
    this.element.style.width = vw;
  }

  handleMouseUp(e) {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }
  }

  getElement() {
    return this.element;
  }

  dispose() {
    this.destroy();
  }

  destroy() {
    return this.element.remove();
  }

}

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
}
// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}
// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}


// path.relative(from, to)
// posix version
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

var sep = '/';
var delimiter = ':';

function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

function basename(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


function extname(path) {
  return splitPath(path)[3];
}
var path = {
  extname: extname,
  basename: basename,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join,
  isAbsolute: isAbsolute,
  normalize: normalize,
  resolve: resolve
};
function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

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

const RESET_CONTRACTS = 'reset_contracts';
const SET_COMPILING = 'set_compiling';
const SET_COMPILED = 'set_compiled';
const RESET_COMPILED = 'reset_compiled';
const SET_PARAMS = 'set_params';
const ADD_INTERFACE = 'add_interface';
const UPDATE_INTERFACE = 'update_interface';
const UPDATE_OPTIONS = 'update_options';
const ADD_TX_HASH = 'add_tx_hash';
const SET_INSTANCE = 'set_instance';
const SET_DEPLOYED = 'set_deployed';
const SET_GAS_LIMIT = 'set_gas_limit';
const SET_BALANCE = 'set_balance';
const SET_GAS_ESTIMATE = 'set_gas_estimate'; // Files action types

const RESET_SOURCES = 'reset_sources';
const SET_SOURCES = 'set_sources';
const SET_COINBASE = 'set_coinbase';
const SET_PASSWORD = 'set_password';
const SET_ACCOUNTS = 'set_accounts';
const SET_ERRORS = 'set_errors';
const RESET_ERRORS = 'reset_errors'; // Ethereum client events

const ADD_PENDING_TRANSACTION = 'add_pending_transaction';
const ADD_EVENTS = 'add_logs';
const SET_EVENTS = 'set_events';
const TEXT_ANALYSIS = 'text_analysis'; // Node variables
const SET_SYNC_STATUS = 'set_sync_status';
const SET_SYNCING = 'set_syncing';
const SET_MINING = 'set_mining';
const SET_HASH_RATE = 'set_hash_rate'; // Client variables

const SET_CONNECTION_STATUS = 'set_connection_status';
const FIRST_TIME_CHECK_ENABLE = 'first_time_check_enable';
const IS_WS_PROVIDER = 'is_ws_provider';
const IS_HTTP_PROVIDER = 'is_http_provider';

const setParamsInput = ({
  contractName,
  abi
}) => {
  return dispatch => {
    dispatch({
      type: SET_PARAMS,
      payload: {
        contractName,
        abi
      }
    });
  };
};
const addInterface = ({
  contractName,
  ContractABI
}) => {
  return dispatch => {
    dispatch({
      type: ADD_INTERFACE,
      payload: {
        contractName,
        interface: ContractABI
      }
    });
  };
};
const updateInterface = ({
  contractName,
  ContractABI
}) => {
  return dispatch => {
    dispatch({
      type: ADD_INTERFACE,
      payload: {
        contractName,
        interface: ContractABI
      }
    });
  };
};
const setInstance = ({
  contractName,
  instance
}) => {
  return dispatch => {
    dispatch({
      type: SET_INSTANCE,
      payload: {
        contractName,
        instance
      }
    });
  };
};
const setDeployed = ({
  contractName,
  deployed
}) => {
  return dispatch => {
    dispatch({
      type: SET_DEPLOYED,
      payload: {
        contractName,
        deployed
      }
    });
  };
};

const setCoinbase = coinbase => {
  return dispatch => {
    dispatch({
      type: SET_COINBASE,
      payload: coinbase
    });
  };
};
const setPassword = ({
  password
}) => {
  return dispatch => {
    dispatch({
      type: SET_PASSWORD,
      payload: {
        password
      }
    });
  };
};
const setAccounts = accounts => {
  return dispatch => {
    dispatch({
      type: SET_ACCOUNTS,
      payload: accounts
    });
  };
};

const addNewEvents = ({
  payload
}) => {
  return dispatch => {
    dispatch({
      type: ADD_EVENTS,
      payload
    });
  };
};

const setSyncStatus = status => {
  return dispatch => {
    dispatch({
      type: SET_SYNC_STATUS,
      payload: status
    });
  };
};
const setMining = mining => {
  return dispatch => {
    dispatch({
      type: SET_MINING,
      payload: mining
    });
  };
};
const setHashrate = hashrate => {
  return dispatch => {
    dispatch({
      type: SET_HASH_RATE,
      payload: hashrate
    });
  };
};

const setErrors = payload => {
  return dispatch => {
    dispatch({
      type: SET_ERRORS,
      payload
    });
  };
};
const resetErrors = () => {
  return dispatch => {
    dispatch({
      type: RESET_ERRORS
    });
  };
};

class Web3Helpers {
  constructor(store) {
    this.store = store;
    this.jobs = {// fileName: { solcWorker, hash }
    };
    this.contract;
    this.web3ProcessHandler = this.web3ProcessHandler.bind(this);
    this.setCoinbase = this.setCoinbase.bind(this);
    this.getCurrentClients = this.getCurrentClients.bind(this);
    this.showPanelError = this.showPanelError.bind(this);
    this.showPanelSuccess = this.showPanelSuccess.bind(this);
    this.hookWeb3ChildProcess = this.createWeb3Connection();
    this.setDefaultAccount = this.setDefaultAccount.bind(this); // sending rpc or ws address to create ethereum connection

    const rpcAddress = atom.config.get('etheratom.rpcAddress');
    const websocketAddress = atom.config.get('etheratom.websocketAddress');
    this.hookWeb3ChildProcess.send({
      action: 'set_rpc_ws',
      rpcAddress,
      websocketAddress
    }); // handle the web3 child process responses

    this.web3ProcessHandler();
  }
  /* ================================ Web3js CHILD PROCESS communication START ================================== */


  createWeb3Connection() {
    const pkgPath = atom.packages.resolvePackagePath('etheratom');
    return child_process.fork(`${pkgPath}/lib/web3/web3Worker.js`);
  }

  killWeb3Connection() {
    if (this.hookWeb3ChildProcess !== 'undefined') {
      this.hookWeb3ChildProcess.kill();
    } else {
      return;
    }
  }

  subscribeTransaction() {
    this.hookWeb3ChildProcess.send({
      action: 'subscribeTransaction'
    });
  }

  subscribeETHconnection() {
    this.hookWeb3ChildProcess.send({
      action: 'ethSubscription'
    });
  }

  getBalance(coinbase) {
    this.hookWeb3ChildProcess.send({
      action: 'get_balances',
      coinbase
    });
  }

  async setDefaultAccount(coinbase) {
    this.hookWeb3ChildProcess.send({
      action: 'default_account_set',
      coinbase
    });
  }

  async getGasEstimate(coinbase, bytecode) {
    this.hookWeb3ChildProcess.send({
      action: 'getGasEstimate',
      coinbase,
      bytecode
    });
  }

  web3ProcessHandler() {
    this.hookWeb3ChildProcess.on('message', message => {
      console.log('%c New Message:', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', message);

      if (message.hasOwnProperty('transaction')) {
        this.store.dispatch({
          type: ADD_PENDING_TRANSACTION,
          payload: message.transaction
        });

        if (message.hasOwnProperty('transactionRecipt')) {
          this.store.dispatch({
            type: TEXT_ANALYSIS,
            payload: message
          });
        }
      } else if (message.hasOwnProperty('isBooleanSync')) {
        this.store.dispatch({
          type: 'set_syncing',
          payload: message['isBooleanSync']
        });
      } else if (message.hasOwnProperty('isObjectSync')) {
        const sync = message['isObjectSync'];
        this.store.dispatch({
          type: SET_SYNCING,
          payload: sync.syncing
        });
        const status = {
          currentBlock: sync.status.CurrentBlock,
          highestBlock: sync.status.HighestBlock,
          knownStates: sync.status.KnownStates,
          pulledStates: sync.status.PulledStates,
          startingBlock: sync.status.StartingBlock
        };
        this.store.dispatch({
          type: SET_SYNC_STATUS,
          payload: status
        });
      } else if (message.hasOwnProperty('syncStarted') && message['syncStarted']) {
        console.log('%c syncing:data ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
      } else if (message.hasOwnProperty('isSyncing')) {
        console.log('%c syncing:changed ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        this.store.dispatch({
          type: SET_SYNC_STATUS,
          payload: message['isSyncing']
        });
      } else if (message.hasOwnProperty('ethBalance')) {
        this.store.dispatch({
          type: SET_BALANCE,
          payload: message['ethBalance']
        });
      } else if (message.hasOwnProperty('hasConnection')) {
        let clients = this.getCurrentClients();
        clients[0].hasConnection = message['hasConnection'];
        this.store.dispatch({
          type: SET_CONNECTION_STATUS,
          payload: clients
        });
        clients[0].firstTimeCheck = false;
        this.store.dispatch({
          type: FIRST_TIME_CHECK_ENABLE,
          payload: clients
        });
      } else if (message.hasOwnProperty('isWsProvider')) {
        let clients = this.getCurrentClients();
        clients[0].isWsProvider = message['isWsProvider'];
        this.store.dispatch({
          type: 'is_ws_provider',
          payload: clients
        });
      } else if (message.hasOwnProperty('isHttpProvider')) {
        let clients = this.getCurrentClients();
        clients[0].isHttpProvider = message['isHttpProvider'];
        this.store.dispatch({
          type: 'is_http_provider',
          payload: clients
        });
      } else if (message.hasOwnProperty('accounts')) {
        this.store.dispatch({
          type: SET_ACCOUNTS,
          payload: message.accounts
        });
        this.store.dispatch({
          type: SET_COINBASE,
          payload: message.accounts[0]
        });
      } else if (message.hasOwnProperty('getAccountsForNodeSubmit')) {
        let clients = this.getCurrentClients();

        try {
          this.store.dispatch({
            type: SET_ACCOUNTS,
            payload: message.getAccountsForNodeSubmit
          });
          this.store.dispatch({
            type: SET_COINBASE,
            payload: message.getAccountsForNodeSubmit[0]
          });

          if (message['node_type'] === 'node_ws') {
            this.showPanelSuccess('Connection Re-established with Web socket');
            clients[0].isWsProvider = true;
            clients[0].isHttpProvider = false;
            this.store.dispatch({
              type: 'is_ws_provider',
              payload: clients
            });
          } else if (message['node_type'] === 'node_rpc') {
            this.showPanelSuccess('Connection Re-established with rpc');
            clients[0].isHttpProvider = true;
            clients[0].isWsProvider = false;
            this.store.dispatch({
              type: 'is_http_provider',
              payload: clients
            });
          }
        } catch (e) {
          if (message['node_type'] === 'node_ws') {
            this.showPanelError('Error with RPC value. Please check again');
          } else if (message['node_type'] === 'node_rpc') {
            this.showPanelError('Error with Web Socket value. Please check again');
          }

          this.store.dispatch({
            type: SET_ACCOUNTS,
            payload: []
          });
          this.store.dispatch({
            type: SET_COINBASE,
            payload: '0x00'
          });
        }
      } else if (message.hasOwnProperty('isMining')) {
        setMining(message['isMining']);
      } else if (message.hasOwnProperty('getHashrate')) {
        this.store.dispatch({
          type: 'set_hash_rate',
          payload: message['getHashrate']
        });
      } else if (message.hasOwnProperty('gasLimit')) {
        this.store.dispatch({
          type: SET_GAS_LIMIT,
          payload: message['gasLimit']
        });
      } else if (message.hasOwnProperty('options')) {
        const options = message['options'];
        const contractName = message['contractName'];
        this.store.dispatch({
          type: UPDATE_OPTIONS,
          payload: {
            contractName,
            options
          }
        });

        if (options.address) {
          this.store.dispatch({
            type: SET_DEPLOYED,
            payload: {
              contractName,
              deployed: true
            }
          });
        }
      } else if (message.hasOwnProperty('transactionHash')) {
        const transactionHash = message['transactionHash'];
        const contractName = message['contractName'];
        this.store.dispatch({
          type: ADD_TX_HASH,
          payload: {
            transactionHash,
            contractName
          }
        });
        this.store.dispatch({
          type: SET_DEPLOYED,
          payload: {
            contractName,
            deployed: true
          }
        });
      } else if (message.hasOwnProperty('txReceipt')) ; else if (message.hasOwnProperty('confirmationNumber')) ; else if (message.hasOwnProperty('logsEvents')) ; else if (message.hasOwnProperty('dataEvents')) ; else if (message.hasOwnProperty('changedEvent')) ; else if (message.hasOwnProperty('gasEstimate')) {
        const gasEstimate = message['gasEstimate'];
        this.store.dispatch({
          type: SET_GAS_ESTIMATE,
          payload: {
            gasEstimate
          }
        });
      } else if (message.hasOwnProperty('contractObject')) {
        this.contract = message['contractObject']['contract'];
        const instance = message['contractObject']['contract'];
        const contractName = message['contractObject']['contractName'];
        this.store.dispatch({
          type: SET_INSTANCE,
          payload: {
            contractName,
            instance
          }
        });
      } else if (message.hasOwnProperty('jsonInterface')) {
        const contractName = message['contractName'];
        const jsonInterface = message['jsonInterface'];
        this.store.dispatch({
          type: UPDATE_INTERFACE,
          payload: {
            contractName,
            interface: jsonInterface
          }
        });
      } else if (message.hasOwnProperty('callResult')) {
        const address = message['address'];
        const data = message['callResult'];
        this.showOutput({
          address,
          data
        });
      } else if (message.hasOwnProperty('transactionHashonSend')) {
        this.showTransaction({
          head: 'Transaction hash:',
          data: message['transactionHashonSend']
        });
      } else if (message.hasOwnProperty('txReciptonSend')) {
        this.showTransaction({
          head: 'Transaction recipt:',
          data: message['txReciptonSend']
        });
      } else if (message.hasOwnProperty('error')) {
        console.log('%c Error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B', message);
        this.showPanelError(message.error);
      }
    });
  }

  getCurrentClients() {
    let clients = [{
      provider: this.store.getState().clientReducer.clients[0].provider,
      desc: this.store.getState().clientReducer.clients[0].desc,
      hasConnection: this.store.getState().clientReducer.clients[0].hasConnection,
      firstTimeCheck: this.store.getState().clientReducer.clients[0].firstTimeCheck,
      isWsProvider: this.store.getState().clientReducer.clients[0].isWsProvider,
      isHttpProvider: this.store.getState().clientReducer.clients[0].isHttpProvider
    }];
    return clients;
  }

  async checkConnection() {
    this.hookWeb3ChildProcess.send({
      action: 'check_connection'
    });
  }

  async isWsProvider() {
    this.hookWeb3ChildProcess.send({
      action: 'isWsProvider'
    });
  }

  async isHttpProvider() {
    this.hookWeb3ChildProcess.send({
      action: 'isHttpProvider'
    });
  } // WEB3 JS CHILD PROCESS END ==========================================================================================


  createWorker(fn) {
    const pkgPath = atom.packages.resolvePackagePath('etheratom');
    return child_process.fork(`${pkgPath}/lib/web3/worker.js`);
  }

  createVyperWorker(fn) {
    const pkgPath = atom.packages.resolvePackagePath('etheratom');
    return child_process.fork(`${pkgPath}/lib/web3/vyp-worker.js`);
  }

  async compileWeb3(sources) {
    let fileName = Object.keys(sources).find(key => {
      return /\.sol/.test(key);
    });
    let hashId = md5(sources[fileName].content);

    if (this.jobs[fileName]) {
      if (this.jobs[fileName].hashId === hashId || this.jobs[fileName].hashId === undefined) {
        this.jobs[fileName].wasBusy = true;
        console.error(`Job in progress for ${fileName}`);
        return;
      }

      this.jobs[fileName].solcWorker.kill();
      console.error(`Killing older job for ${fileName}`);
    } else {
      this.jobs[fileName] = {
        hashId
      };
    } // compile solidity using solcjs
    // sources have Compiler Input JSON sources format
    // https://solidity.readthedocs.io/en/develop/using-the-compiler.html#compiler-input-and-output-json-description


    try {
      const outputSelection = {
        // Enable the metadata and bytecode outputs of every single contract.
        '*': {
          '': ['legacyAST'],
          '*': ['abi', 'evm.bytecode.object', 'devdoc', 'userdoc', 'evm.gasEstimates']
        }
      };
      const settings = {
        optimizer: {
          enabled: true,
          runs: 500
        },
        evmVersion: 'byzantium',
        outputSelection
      };
      const input = {
        language: 'Solidity',
        sources,
        settings
      };
      const solcWorker = this.createWorker();
      this.jobs[fileName].solcWorker = solcWorker;
      const requiredSolcVersion = atom.config.get('etheratom.versionSelector');
      solcWorker.send({
        command: 'compile',
        payload: input,
        version: requiredSolcVersion
      });
      solcWorker.on('message', m => {
        if (m.compiled) {
          this.store.dispatch({
            type: SET_COMPILED,
            payload: JSON.parse(m.compiled)
          });
          this.store.dispatch({
            type: SET_COMPILING,
            payload: false
          });
          this.jobs[fileName].successHash = hashId;
          solcWorker.kill();
        }
      });
      solcWorker.on('error', e => console.error(e));
      solcWorker.on('exit', (code, signal) => {
        if (this.jobs[fileName].wasBusy && hashId !== this.jobs[fileName].successHash) {
          this.store.dispatch({
            type: SET_COMPILING,
            payload: true
          });
        } else {
          this.store.dispatch({
            type: SET_COMPILING,
            payload: false
          });
          this.jobs[fileName] = false;
        }

        console.log('%c Compile worker process exited with ' + `code ${code} and signal ${signal}`, 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
      });
    } catch (e) {
      throw e;
    }
  }

  async compileVyper(sources) {
    // TODO: vyper compiler code goes bellow, as follows
    const vyperWorker = this.createVyperWorker();
    vyperWorker.on('message', m => {
      if (m.compiled) {
        this.store.dispatch({
          type: SET_COMPILED,
          payload: JSON.parse(m.compiled)
        });
        this.store.dispatch({
          type: SET_COMPILING,
          payload: false
        });
      }
    });
    vyperWorker.send({
      command: 'compile',
      source: sources,
      version: this.version
    });
  }

  async setCoinbase(coinbase) {
    this.hookWeb3ChildProcess.send({
      action: 'set_coinbase',
      coinbase
    });
  }

  async getSyncStat() {
    this.hookWeb3ChildProcess.send({
      action: 'sync_stat'
    });
  }

  async create(args) {
    console.log('%c Creating contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
    this.hookWeb3ChildProcess.send({
      action: 'create',
      argumentsForCreate: args
    });
  }

  async call(args) {
    console.log('%c Web3 calling functions... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');

    try {
      this.hookWeb3ChildProcess.send({
        action: 'callDeployedContract',
        argumentsForCall: args
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async send(to, amount, password) {
    let params = {
      to,
      amount,
      password
    };
    this.hookWeb3ChildProcess.send({
      action: 'sendTransaction',
      params
    });
  }

  async funcParamsToArray(contractFunction) {
    if (contractFunction && contractFunction.inputs.length > 0) {
      const inputElements = await Promise.all(contractFunction.inputs.map(async input => {
        return [input.type, input.name];
      }));
      return inputElements;
    }

    return [];
  }

  async inputsToArray(paramObject) {
    this.hookWeb3ChildProcess.send({
      action: 'inputsToArray',
      paramObject
    });
  }

  showPanelError(err_message) {
    let messages;
    messages = new atomMessagePanel.MessagePanelView({
      title: 'Etheratom report'
    });
    messages.attach();
    messages.add(new atomMessagePanel.PlainMessageView({
      message: err_message,
      className: 'red-message'
    }));
  }

  showPanelSuccess(err_message) {
    let messages;
    messages = new atomMessagePanel.MessagePanelView({
      title: 'Etheratom report'
    });
    messages.attach();
    messages.add(new atomMessagePanel.PlainMessageView({
      message: err_message,
      className: 'green-message'
    }));
  }

  showOutput(_ref) {
    let args = _extends({}, _ref);

    const address = args.address;
    const data = args.data;
    const messages = new atomMessagePanel.MessagePanelView({
      title: 'Etheratom output'
    });
    messages.attach();
    messages.add(new atomMessagePanel.PlainMessageView({
      message: 'Contract address: ' + address,
      className: 'green-message'
    }));

    if (data instanceof Object) {
      const rawMessage = `<h6>Contract output:</h6><pre>${JSON.stringify(data, null, 4)}</pre>`;
      messages.add(new atomMessagePanel.PlainMessageView({
        message: rawMessage,
        raw: true,
        className: 'green-message'
      }));
      return;
    }

    messages.add(new atomMessagePanel.PlainMessageView({
      message: 'Contract output: ' + data,
      className: 'green-message'
    }));
    return;
  }

  showTransaction(_ref2) {
    let args = _extends({}, _ref2);

    const head = args.head;
    const data = args.data;
    const messages = new atomMessagePanel.MessagePanelView({
      title: 'Etheratom output'
    });
    messages.attach();
    messages.add(new atomMessagePanel.PlainMessageView({
      message: head,
      className: 'green-message'
    }));

    if (data instanceof Object) {
      const rawMessage = `<pre>${JSON.stringify(data, null, 4)}</pre>`;
      messages.add(new atomMessagePanel.PlainMessageView({
        message: rawMessage,
        raw: true,
        className: 'green-message'
      }));
      return;
    }

    messages.add(new atomMessagePanel.PlainMessageView({
      message: data,
      className: 'green-message'
    }));
    return;
  } // Transaction analysis


  async getTxAnalysis(txHash) {
    this.hookWeb3ChildProcess.send({
      action: 'getTxAnalysis',
      txHash
    });
  } // Gas Limit


  async getGasLimit() {
    this.hookWeb3ChildProcess.send({
      action: 'getGasLimit'
    });
  }

  async getAccounts() {
    this.hookWeb3ChildProcess.send({
      action: 'getAccounts'
    });
  }

  async getAccountsForNodeSubmit(node_string, node_url) {
    this.hookWeb3ChildProcess.send({
      action: 'getAccountsForNodeSubmit',
      node_type: node_string,
      node_url
    });
  }

  async getMining() {
    this.hookWeb3ChildProcess.send({
      action: 'getMiningStatus'
    });
  }

  async getHashrate() {
    this.hookWeb3ChildProcess.send({
      action: 'getHashrateStatus'
    });
  }

}

/*! https://mths.be/punycode v1.4.1 by @mathias */


/** Highest positive signed 32-bit float value */
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter$1 = '-'; // '\x2D'
var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
var errors = {
  'overflow': 'Overflow: input needs wider integers to process',
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
  throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, fn) {
  var length = array.length;
  var result = [];
  while (length--) {
    result[length] = fn(array[length]);
  }
  return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
  var parts = string.split('@');
  var result = '';
  if (parts.length > 1) {
    // In email addresses, only the domain name should be punycoded. Leave
    // the local part (i.e. everything up to `@`) intact.
    result = parts[0] + '@';
    string = parts[1];
  }
  // Avoid `split(regex)` for IE8 compatibility. See #17.
  string = string.replace(regexSeparators, '\x2E');
  var labels = string.split('.');
  var encoded = map(labels, fn).join('.');
  return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
  var output = [],
    counter = 0,
    length = string.length,
    value,
    extra;
  while (counter < length) {
    value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // high surrogate, and there is a next character
      extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // low surrogate
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // unmatched surrogate; only append this code unit, in case the next
        // code unit is the high surrogate of a surrogate pair
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
function digitToBasic(digit, flag) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
}

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
function adapt(delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for ( /* no initialization */ ; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
}

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
function encode(input) {
  var n,
    delta,
    handledCPCount,
    basicLength,
    bias,
    j,
    m,
    q,
    k,
    t,
    currentValue,
    output = [],
    /** `inputLength` will hold the number of code points in `input`. */
    inputLength,
    /** Cached calculation results */
    handledCPCountPlusOne,
    baseMinusT,
    qMinusT;

  // Convert the input in UCS-2 to Unicode
  input = ucs2decode(input);

  // Cache the length
  inputLength = input.length;

  // Initialize the state
  n = initialN;
  delta = 0;
  bias = initialBias;

  // Handle the basic code points
  for (j = 0; j < inputLength; ++j) {
    currentValue = input[j];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  handledCPCount = basicLength = output.length;

  // `handledCPCount` is the number of code points that have been handled;
  // `basicLength` is the number of basic code points.

  // Finish the basic string - if it is not empty - with a delimiter
  if (basicLength) {
    output.push(delimiter$1);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {

    // All non-basic code points < n have been handled already. Find the next
    // larger one:
    for (m = maxInt, j = 0; j < inputLength; ++j) {
      currentValue = input[j];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    // but guard against overflow
    handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error('overflow');
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];

      if (currentValue < n && ++delta > maxInt) {
        error('overflow');
      }

      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer
        for (q = delta, k = base; /* no condition */ ; k += base) {
          t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) {
            break;
          }
          qMinusT = q - t;
          baseMinusT = base - t;
          output.push(
            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
          );
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;

  }
  return output.join('');
}

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
function toASCII(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ?
      'xn--' + encode(string) :
      string;
  });
}

// shim for using process in browser
if (typeof global.setTimeout === 'function') ;
if (typeof global.clearTimeout === 'function') ;

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// Copyright Joyent, Inc. and other Node contributors.

function isNull(arg) {
  return arg === null;
}

function isNullOrUndefined(arg) {
  return arg == null;
}

function isString(arg) {
  return typeof arg === 'string';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
function stringifyPrimitive(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
}

function stringify (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map$1(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map$1(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
}
function map$1 (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

function parse(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}

// Copyright Joyent, Inc. and other Node contributors.
var url = {
  parse: urlParse,
  resolve: urlResolve,
  resolveObject: urlResolveObject,
  format: urlFormat,
  Url: Url
};
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
  portPattern = /:[0-9]*$/,

  // Special case for a simple path URL
  simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

  // RFC 2396: characters reserved for delimiting URLs.
  // We actually just auto-escape these.
  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

  // RFC 2396: characters not allowed for various reasons.
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

  // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
  autoEscape = ['\''].concat(unwise),
  // Characters that are never ever allowed in a hostname.
  // Note that any invalid chars are also handled, but these
  // are the ones that are *expected* to be seen, so we fast-path
  // them.
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
  hostEndingChars = ['/', '?', '#'],
  hostnameMaxLen = 255,
  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  // protocols that can allow "unsafe" and "unwise" chars.
  unsafeProtocol = {
    'javascript': true,
    'javascript:': true
  },
  // protocols that never have a hostname.
  hostlessProtocol = {
    'javascript': true,
    'javascript:': true
  },
  // protocols that always contain a // bit.
  slashedProtocol = {
    'http': true,
    'https': true,
    'ftp': true,
    'gopher': true,
    'file': true,
    'http:': true,
    'https:': true,
    'ftp:': true,
    'gopher:': true,
    'file:': true
  };

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  return parse$1(this, url, parseQueryString, slashesDenoteHost);
};

function parse$1(self, url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError('Parameter \'url\' must be a string, not ' + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
    splitter =
    (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
    uSplit = url.split(splitter),
    slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      self.path = rest;
      self.href = rest;
      self.pathname = simplePath[1];
      if (simplePath[2]) {
        self.search = simplePath[2];
        if (parseQueryString) {
          self.query = parse(self.search.substr(1));
        } else {
          self.query = self.search.substr(1);
        }
      } else if (parseQueryString) {
        self.search = '';
        self.query = {};
      }
      return self;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    self.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      self.slashes = true;
    }
  }
  var i, hec, l, p;
  if (!hostlessProtocol[proto] &&
    (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      self.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    self.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    parseHost(self);

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    self.hostname = self.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = self.hostname[0] === '[' &&
      self.hostname[self.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = self.hostname.split(/\./);
      for (i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            self.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (self.hostname.length > hostnameMaxLen) {
      self.hostname = '';
    } else {
      // hostnames are always lower case.
      self.hostname = self.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      self.hostname = toASCII(self.hostname);
    }

    p = self.port ? ':' + self.port : '';
    var h = self.hostname || '';
    self.host = h + p;
    self.href += self.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      self.hostname = self.hostname.substr(1, self.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    self.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    self.search = rest.substr(qm);
    self.query = rest.substr(qm + 1);
    if (parseQueryString) {
      self.query = parse(self.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    self.search = '';
    self.query = {};
  }
  if (rest) self.pathname = rest;
  if (slashedProtocol[lowerProto] &&
    self.hostname && !self.pathname) {
    self.pathname = '/';
  }

  //to support http.request
  if (self.pathname || self.search) {
    p = self.pathname || '';
    var s = self.search || '';
    self.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  self.href = format(self);
  return self;
}

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = parse$1({}, obj);
  return format(obj);
}

function format(self) {
  var auth = self.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = self.protocol || '',
    pathname = self.pathname || '',
    hash = self.hash || '',
    host = false,
    query = '';

  if (self.host) {
    host = auth + self.host;
  } else if (self.hostname) {
    host = auth + (self.hostname.indexOf(':') === -1 ?
      self.hostname :
      '[' + this.hostname + ']');
    if (self.port) {
      host += ':' + self.port;
    }
  }

  if (self.query &&
    isObject(self.query) &&
    Object.keys(self.query).length) {
    query = stringify(self.query);
  }

  var search = self.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (self.slashes ||
    (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
}

Url.prototype.format = function() {
  return format(this);
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
      result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }
  var relPath;
  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
    isRelAbs = (
      relative.host ||
      relative.pathname && relative.pathname.charAt(0) === '/'
    ),
    mustEndAbs = (isRelAbs || isSourceAbs ||
      (result.host && relative.pathname)),
    removeAllDots = mustEndAbs,
    srcPath = result.pathname && result.pathname.split('/') || [],
    psychotic = result.protocol && !slashedProtocol[result.protocol];
  relPath = relative.pathname && relative.pathname.split('/') || [];
  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }
  var authInHost;
  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
      relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      authInHost = result.host && result.host.indexOf('@') > 0 ?
        result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
        (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
    (result.host || relative.host || srcPath.length > 1) &&
    (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
    (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
    (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
      srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    authInHost = result.host && result.host.indexOf('@') > 0 ?
      result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
      (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  return parseHost(this);
};

function parseHost(self) {
  var host = self.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      self.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) self.hostname = host;
}

async function handleGithubCall(fullpath, repoPath, path, filename, fileRoot) {
  return await axios({
    method: 'get',
    url: 'https://api.github.com/repos/' + repoPath + '/contents/' + path,
    responseType: 'json'
  }).then(function (response) {
    if ('content' in response.data) {
      const buf = Buffer.from(response.data.content, 'base64');
      fileRoot = fullpath.substring(0, fullpath.lastIndexOf('/'));
      fileRoot = fileRoot + '/';
      const resp = {
        filename,
        content: buf.toString('UTF-8'),
        fileRoot
      };
      return resp;
    } else {
      throw 'Content not received!';
    }
  });
}

async function handleNodeModulesImport(pathString, filename, fileRoot) {
  const o = {
    encoding: 'UTF-8'
  };
  var modulesDir = fileRoot;

  while (true) {
    var p = path.join(modulesDir, 'node_modules', pathString, filename);

    try {
      const content = fs.readFileSync(p, o);
      fileRoot = path.join(modulesDir, 'node_modules', pathString);
      const response = {
        filename,
        content,
        fileRoot
      };
      return response;
    } catch (err) {
      console.log(err);
    } // Recurse outwards until impossible


    var oldModulesDir = modulesDir;
    modulesDir = path.join(modulesDir, '..');

    if (modulesDir === oldModulesDir) {
      break;
    }
  }
}

async function handleLocalImport(pathString, filename, fileRoot) {
  // if no relative/absolute path given then search in node_modules folder
  if (pathString && pathString.indexOf('.') !== 0 && pathString.indexOf('/') !== 0) {
    return handleNodeModulesImport(pathString, filename, fileRoot);
  } else {
    const o = {
      encoding: 'UTF-8'
    };
    const p = pathString ? path.resolve(fileRoot, pathString, filename) : path.resolve(fileRoot, filename);
    const content = fs.readFileSync(p, o);
    fileRoot = pathString ? path.resolve(fileRoot, pathString) : fileRoot;
    const response = {
      filename,
      content,
      fileRoot
    };
    return response;
  }
}

async function getHandlers() {
  return [{
    type: 'local',
    match: /(^(?!(?:http:\/\/)|(?:https:\/\/)?(?:www.)?(?:github.com)))(^\/*[\w+-_/]*\/)*?(\w+\.sol)/g,
    handle: async (match, fileRoot) => {
      return await handleLocalImport(match[2], match[3], fileRoot);
    }
  }, {
    type: 'github',
    match: /^(https?:\/\/)?(www.)?github.com\/([^/]*\/[^/]*)(.*\/(\w+\.sol))/g,
    handle: async (match, fileRoot) => {
      return await handleGithubCall(match[0], match[3], match[4], match[5], fileRoot);
    }
  }];
}

async function resolveImports(fileRoot, sourcePath) {
  const handlers = await getHandlers();
  let response = {};

  for (const handler of handlers) {
    try {
      // here we are trying to find type of import path github/swarm/ipfs/local
      const match = handler.match.exec(sourcePath);

      if (match) {
        response = await handler.handle(match, fileRoot);
        break;
      }
    } catch (e) {
      throw e;
    }
  }

  return response;
}

async function combineSource(fileRoot, sources) {
  let fn, importLine, ir;
  var matches = [];
  ir = /^(?:import){1}(.+){0,1}\s['"](.+)['"];/gm;
  let match = null;

  for (const fileName of Object.keys(sources)) {
    const source = sources[fileName].content;

    while (match = ir.exec(source)) {
      matches.push(match);
    }

    for (let match of matches) {
      importLine = match[0];
      const extra = match[1] ? match[1] : '';

      if (validUrl.isUri(fileRoot)) {
        fn = url.URL.resolve(fileRoot, match[2]);
      } else {
        fn = match[2];
      }

      try {
        // resolve anything other than remix_tests.sol & tests.sol
        if (fn.localeCompare('remix_tests.sol') != 0 && fn.localeCompare('tests.sol') != 0) {
          let subSorce = {};
          const response = await resolveImports(fileRoot, fn);
          sources[fileName].content = sources[fileName].content.replace(importLine, 'import' + extra + ' \'' + response.filename + '\';');
          subSorce[response.filename] = {
            content: response.content
          };
          sources = Object.assign((await combineSource(response.fileRoot, subSorce)), sources);
        }
      } catch (e) {
        throw e;
      }
    }
  }

  return sources;
}

function showPanelError(err_message) {
  let messages;
  messages = new atomMessagePanel.MessagePanelView({
    title: 'Etheratom report'
  });
  messages.attach();
  messages.add(new atomMessagePanel.PlainMessageView({
    message: err_message,
    className: 'red-message'
  }));
}

class GasInput extends React__default.Component {
  constructor(props) {
    super(props);
    this.state = {
      gas: props.gas
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      gas
    } = nextProps;
    this.setState({
      gas
    });
  }

  render() {
    const {
      gasLimit
    } = this.props;
    const {
      contractName
    } = this.props;
    return React__default.createElement("form", {
      className: "gas-estimate-form"
    }, React__default.createElement("button", {
      className: "input text-subtle"
    }, "Gas supply"), React__default.createElement("input", {
      id: contractName + '_gas',
      type: "number",
      className: "inputs",
      value: this.state.gas,
      onChange: this.props.onChange
    }), React__default.createElement("button", {
      className: "btn btn-primary"
    }, "Gas Limit : ", gasLimit));
  }

}

GasInput.propTypes = {
  contractName: PropTypes.string,
  interfaces: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  gasLimit: PropTypes.number,
  gas: PropTypes.number
};

const mapStateToProps = ({
  contract
}) => {
  const {
    compiled,
    gasLimit
  } = contract;
  return {
    compiled,
    gasLimit
  };
};

var GasInput$1 = reactRedux.connect(mapStateToProps, {})(GasInput);

class InputsForm extends React__default.Component {
  constructor(props) {
    super(props);
    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(input, event) {
    input.value = event.target.value;
  }

  render() {
    const {
      contractName,
      abi
    } = this.props;
    return React__default.createElement("div", {
      id: contractName + '_inputs'
    }, abi.type === 'constructor' && abi.inputs.map((input, i) => {
      return React__default.createElement("form", {
        key: i,
        onSubmit: this.props.onSubmit
      }, React__default.createElement("button", {
        className: "input text-subtle"
      }, input.name), React__default.createElement("input", {
        id: i,
        type: "text",
        className: "inputs",
        placeholder: input.type,
        value: input.value,
        onChange: e => this._handleChange(input, e)
      }));
    }));
  }

}

InputsForm.propTypes = {
  onSubmit: PropTypes.func,
  contractName: PropTypes.string,
  abi: PropTypes.object
};

const mapStateToProps$1 = ({
  contract
}) => {
  const {
    compiled
  } = contract;
  return {
    compiled
  };
};

var InputsForm$1 = reactRedux.connect(mapStateToProps$1, {
  setParamsInput
})(InputsForm);

class CreateButton extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.state = {
      constructorParams: undefined,
      coinbase: props.coinbase,
      password: props.password,
      atAddress: undefined
    };
    this._handleAtAddressChange = this._handleAtAddressChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  async componentDidMount() {
    const {
      abi
    } = this.props;
    var inputs = [];

    for (let abiObj in abi) {
      if (abi[abiObj].type === 'constructor' && abi[abiObj].inputs.length > 0) {
        inputs = abi[abiObj].inputs;
      }
    }

    this.setState({
      constructorParams: inputs
    });
  }

  async _handleAtAddressChange(event) {
    this.setState({
      atAddress: event.target.value
    });
  }

  async _handleSubmit() {
    try {
      const {
        abi,
        bytecode,
        contractName,
        gas,
        coinbase,
        password
      } = this.props;
      const {
        atAddress
      } = this.state;
      const contractInterface = this.props.interfaces[contractName].interface;
      const constructor = contractInterface.find(interfaceItem => interfaceItem.type === 'constructor');
      const params = [];

      if (constructor) {
        for (let input of constructor.inputs) {
          if (input.value) {
            params.push(input);
          }
        }
      }

      await this.helpers.create({
        coinbase,
        password,
        atAddress,
        abi,
        bytecode,
        contractName,
        params,
        gas
      });
    } catch (e) {
      console.error(e);
      this.helpers.showPanelError(e);
    }
  }

  render() {
    const {
      contractName
    } = this.props;
    return React__default.createElement("form", {
      onSubmit: this._handleSubmit,
      className: "padded"
    }, React__default.createElement("input", {
      type: "submit",
      value: "Deploy to blockchain",
      ref: contractName,
      className: "btn btn-primary inline-block-tight"
    }), React__default.createElement("input", {
      type: "text",
      placeholder: "at:",
      className: "inputs",
      value: this.state.atAddress,
      onChange: this._handleAtAddressChange
    }));
  }

}

CreateButton.propTypes = {
  helpers: PropTypes.any.isRequired,
  coinbase: PropTypes.string,
  password: PropTypes.oneOfType([PropTypes.string, PropTypes.boolean]),
  interfaces: PropTypes.object,
  setInstance: PropTypes.func,
  setDeployed: PropTypes.func,
  addNewEvents: PropTypes.func,
  contractName: PropTypes.string,
  abi: PropTypes.object,
  bytecode: PropTypes.string,
  gas: PropTypes.number
};

const mapStateToProps$2 = ({
  contract,
  account
}) => {
  const {
    compiled,
    interfaces
  } = contract;
  const {
    coinbase,
    password
  } = account;
  return {
    compiled,
    interfaces,
    coinbase,
    password
  };
};

var CreateButton$1 = reactRedux.connect(mapStateToProps$2, {
  setDeployed,
  setInstance,
  addNewEvents
})(CreateButton);

const Blob = require('blob');

class ContractCompiled extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    const {
      gasEstimate,
      interfaces,
      contractName
    } = props;
    this.state = {
      estimatedGas: gasEstimate,
      ContractABI: interfaces[props.contractName].interface,
      savePath: `${contractName}.abi`
    };
    this._handleGasChange = this._handleGasChange.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._saveABI = this._saveABI.bind(this);
  }

  async componentDidMount() {
    const {
      clients
    } = this.props;
    console.log(clients);

    if (!clients[0].hasConnection) {
      return;
    } else {
      try {
        const {
          coinbase,
          bytecode
        } = this.props;
        const gas = await this.helpers.getGasEstimate(coinbase, bytecode);
        this.setState({
          estimatedGas: gas
        });
      } catch (e) {
        console.error(e);
        this.helpers.showPanelError(e);
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.gasEstimate !== this.props.gasEstimate) {
      this.setState({
        estimatedGas: this.props.gasEstimate
      });
    }
  }

  _handleGasChange(event) {
    this.setState({
      estimatedGas: parseInt(event.target.value)
    });
  }

  _handleInput() {
    const {
      contractName,
      addInterface
    } = this.props;
    const {
      ContractABI
    } = this.state;
    addInterface({
      contractName,
      ContractABI
    });
  }

  _saveABI() {
    const {
      fileName
    } = this.props;
    const {
      ContractABI
    } = this.state;
    const savePath = `${fileName.split('.sol')[0]}.abi`;
    const json = JSON.stringify(ContractABI).replace(new RegExp('"', 'g'), '\'');
    const blob = new Blob([json], {
      type: 'text/plain;charset=utf-8'
    });
    fileSaver.saveAs(blob, savePath);
  }

  render() {
    const {
      contractName,
      bytecode,
      index
    } = this.props;
    const {
      estimatedGas,
      ContractABI
    } = this.state;
    const savePath = `${contractName}.abi`;
    return React__default.createElement("div", {
      className: "contract-content",
      key: index
    }, React__default.createElement("span", {
      className: "contract-name inline-block highlight-success"
    }, contractName), React__default.createElement("div", {
      className: "byte-code"
    }, React__default.createElement("pre", {
      className: "large-code"
    }, JSON.stringify(bytecode))), React__default.createElement("div", {
      className: "abi-definition"
    }, React__default.createElement(reactTabs.Tabs, null, React__default.createElement(reactTabs.TabList, null, React__default.createElement("div", {
      className: "tab_btns"
    }, React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn"
    }, "Interface")), React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn"
    }, "Interface Object")), React__default.createElement("button", {
      className: "btn icon icon-desktop-download inline-block-tight icon-button",
      title: 'Save ' + savePath,
      onClick: this._saveABI
    }))), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement("pre", {
      className: "large-code"
    }, JSON.stringify(ContractABI))), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement(ReactJson, {
      src: ContractABI,
      theme: "chalk",
      displayDataTypes: false,
      name: false,
      collapsed: 2,
      collapseStringsAfterLength: 32,
      iconStyle: "triangle"
    })))), ContractABI.map((abi, i) => {
      return React__default.createElement(InputsForm$1, {
        key: i,
        contractName: contractName,
        abi: abi,
        onSubmit: this._handleInput
      });
    }), React__default.createElement(GasInput$1, {
      contractName: contractName,
      gas: estimatedGas,
      onChange: this._handleGasChange
    }), React__default.createElement(CreateButton$1, {
      contractName: contractName,
      bytecode: bytecode,
      abi: ContractABI,
      gas: estimatedGas,
      helpers: this.helpers
    }));
  }

}

ContractCompiled.propTypes = {
  helpers: PropTypes.any.isRequired,
  interfaces: PropTypes.object,
  gasEstimate: PropTypes.number,
  contractName: PropTypes.string,
  fileName: PropTypes.string,
  addInterface: PropTypes.func,
  bytecode: PropTypes.string,
  index: PropTypes.number,
  coinbase: PropTypes.string,
  clients: PropTypes.array.isRequired
};

const mapStateToProps$3 = ({
  account,
  contract,
  clientReducer
}) => {
  const {
    compiled,
    interfaces,
    gasEstimate
  } = contract;
  const {
    coinbase
  } = account;
  const {
    clients
  } = clientReducer;
  return {
    compiled,
    interfaces,
    coinbase,
    gasEstimate,
    clients
  };
};

var ContractCompiled$1 = reactRedux.connect(mapStateToProps$3, {
  addInterface
})(ContractCompiled);

class FunctionABI extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this._handleChange = this._handleChange.bind(this);
    this._handlePayableValue = this._handlePayableValue.bind(this);
    this._handleFallback = this._handleFallback.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleChange(i, j, event) {
    const {
      contractName,
      contracts
    } = this.props;
    const ContractABI = contracts[contractName].options.jsonInterface;
    const input = ContractABI[i].inputs[j];
    input.value = event.target.value;
    ContractABI[i].inputs[j] = Object.assign({}, input);
    this.props.updateInterface({
      contractName,
      ContractABI
    });
  }

  _handlePayableValue(abi, event) {
    abi.payableValue = event.target.value;
  }

  async _handleFallback(abiItem) {
    const {
      contractName,
      coinbase,
      password,
      contracts
    } = this.props;
    const contract = contracts[contractName];

    try {
      this.helpers.call({
        coinbase,
        password,
        contract,
        abiItem
      });
    } catch (e) {
      console.log(e);
      this.helpers.showPanelError(e);
    }
  }

  async _handleSubmit(methodItem) {
    try {
      const {
        contractName,
        coinbase,
        password,
        contracts
      } = this.props;
      const contract = contracts[contractName];
      let params = [];

      for (let input of methodItem.inputs) {
        if (input.value) {
          params.push(input);
        }
      }

      this.helpers.call({
        coinbase,
        password,
        contract,
        abiItem: methodItem,
        params
      });
    } catch (e) {
      console.error(e);
      this.helpers.showPanelError(e);
    }
  }

  render() {
    const {
      contractName,
      interfaces
    } = this.props;
    const ContractABI = interfaces[contractName].interface;
    return React__default.createElement("div", {
      className: "abi-container"
    }, ContractABI.map((abi, i) => {
      if (abi.type === 'function') {
        return React__default.createElement("div", {
          key: i,
          className: "function-container"
        }, React__default.createElement("form", {
          key: i,
          onSubmit: () => this._handleSubmit(abi)
        }, React__default.createElement("input", {
          key: i,
          type: "submit",
          value: abi.name,
          className: "text-subtle call-button"
        }), abi.inputs.map((input, j) => {
          return React__default.createElement("input", {
            type: "text",
            className: "call-button-values",
            placeholder: input.name + ' ' + input.type,
            value: input.value,
            onChange: event => this._handleChange(i, j, event),
            key: j
          });
        }), abi.payable === true && React__default.createElement("input", {
          className: "call-button-values",
          type: "number",
          placeholder: "payable value in wei",
          onChange: event => this._handlePayableValue(abi, event)
        })));
      }

      if (abi.type === 'fallback') {
        return React__default.createElement("div", {
          className: "fallback-container"
        }, React__default.createElement("form", {
          key: i,
          onSubmit: () => {
            this._handleFallback(abi);
          }
        }, React__default.createElement("button", {
          className: "btn"
        }, "fallback"), abi.payable === true && React__default.createElement("input", {
          className: "call-button-values",
          type: "number",
          placeholder: "send wei to contract",
          onChange: event => this._handlePayableValue(abi, event)
        })));
      }
    }));
  }

}

FunctionABI.propTypes = {
  helpers: PropTypes.any.isRequired,
  contractName: PropTypes.string,
  interfaces: PropTypes.object,
  updateInterface: PropTypes.func,
  coinbase: PropTypes.string,
  password: PropTypes.string,
  instances: PropTypes.object,
  contracts: PropTypes.object
};

const mapStateToProps$4 = ({
  contract,
  account
}) => {
  const {
    compiled,
    interfaces,
    contracts
  } = contract;
  const {
    coinbase,
    password
  } = account;
  return {
    compiled,
    interfaces,
    contracts,
    coinbase,
    password
  };
};

var FunctionABI$1 = reactRedux.connect(mapStateToProps$4, {
  updateInterface
})(FunctionABI);

class ContractExecution extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
  }

  render() {
    const {
      contractName,
      bytecode,
      index,
      contracts
    } = this.props;
    const contractOptions = contracts[contractName].options;
    const transactionHash = contracts[contractName].transactionHash;
    const ContractABI = contracts[contractName].options.jsonInterface;
    return React__default.createElement("div", {
      className: "contract-content",
      key: index
    }, React__default.createElement("span", {
      className: "contract-name inline-block highlight-success"
    }, contractName), React__default.createElement("div", {
      className: "byte-code"
    }, React__default.createElement("pre", {
      className: "large-code"
    }, JSON.stringify(bytecode))), React__default.createElement("div", {
      className: "abi-definition"
    }, React__default.createElement(reactTabs.Tabs, null, React__default.createElement(reactTabs.TabList, null, React__default.createElement("div", {
      className: "tab_btns"
    }, React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn"
    }, "Interface")), React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn"
    }, "Interface Object")))), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement("pre", {
      className: "large-code"
    }, JSON.stringify(ContractABI))), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement(ReactJson, {
      src: ContractABI,
      theme: "ocean",
      displayDataTypes: false,
      name: false,
      collapsed: 2
    })))), transactionHash && React__default.createElement("div", {
      id: contractName + '_txHash'
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Transaction hash:"), React__default.createElement("pre", {
      className: "large-code"
    }, transactionHash)), !contractOptions.address && React__default.createElement("div", {
      id: contractName + '_stat'
    }, React__default.createElement("span", {
      className: "stat-mining stat-mining-align"
    }, "waiting to be mined"), React__default.createElement("span", {
      className: "loading loading-spinner-tiny inline-block stat-mining-align"
    })), contractOptions.address && React__default.createElement("div", {
      id: contractName + '_stat'
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Mined at:"), React__default.createElement("pre", {
      className: "large-code"
    }, contractOptions.address)), ContractABI.map((abi, i) => {
      return React__default.createElement(InputsForm$1, {
        contractName: contractName,
        abi: abi,
        key: i
      });
    }), React__default.createElement(FunctionABI$1, {
      contractName: contractName,
      helpers: this.helpers
    }));
  }

}

ContractExecution.propTypes = {
  helpers: PropTypes.any.isRequired,
  contractName: PropTypes.string,
  bytecode: PropTypes.string,
  index: PropTypes.number,
  instances: PropTypes.any,
  contracts: PropTypes.any,
  interfaces: PropTypes.object
};

const mapStateToProps$5 = ({
  contract
}) => {
  const {
    contracts
  } = contract;
  return {
    contracts
  };
};

var ContractExecution$1 = reactRedux.connect(mapStateToProps$5, {})(ContractExecution);

class ErrorView extends React__default.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      errormsg
    } = this.props;
    return React__default.createElement("ul", {
      className: "error-list block"
    }, errormsg.length > 0 && errormsg.map((msg, i) => {
      return React__default.createElement("li", {
        key: i,
        className: "list-item"
      }, msg.severity === 'warning' && React__default.createElement("span", {
        className: "icon icon-alert text-warning"
      }, msg.formattedMessage || msg.message), msg.severity === 'error' && React__default.createElement("span", {
        className: "icon icon-bug text-error"
      }, msg.formattedMessage || msg.message), !msg.severity && React__default.createElement("span", {
        className: "icon icon-bug text-error"
      }, msg.message));
    }));
  }

}

ErrorView.propTypes = {
  errormsg: PropTypes.any
};

const mapStateToProps$6 = ({
  errors
}) => {
  const {
    errormsg
  } = errors;
  return {
    errormsg
  };
};

var ErrorView$1 = reactRedux.connect(mapStateToProps$6, {})(ErrorView);

class CollapsedFile extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.state = {
      isOpened: false,
      toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
      toggleBtnTxt: 'Expand'
    };
    this._toggleCollapse = this._toggleCollapse.bind(this);
    this._clearContract = this._clearContract.bind(this);
  }

  _toggleCollapse() {
    const {
      isOpened
    } = this.state;
    this.setState({
      isOpened: !isOpened
    });

    if (!isOpened) {
      this.setState({
        toggleBtnStyle: 'btn btn-success icon icon-fold inline-block-tight',
        toggleBtnTxt: 'Collapse'
      });
    } else {
      this.setState({
        toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
        toggleBtnTxt: 'Expand'
      });
    }
  }

  _clearContract() {// TODO: clear interface from store
  }

  render() {
    const {
      isOpened,
      toggleBtnStyle,
      toggleBtnTxt
    } = this.state;
    const {
      fileName,
      compiled,
      deployed,
      compiling,
      interfaces
    } = this.props;
    return React__default.createElement("div", null, React__default.createElement("label", {
      className: "label file-collapse-label"
    }, React__default.createElement("h4", {
      className: "text-success"
    }, fileName), React__default.createElement("div", null, React__default.createElement("button", {
      className: toggleBtnStyle,
      onClick: this._toggleCollapse
    }, toggleBtnTxt))), React__default.createElement(reactCollapse.Collapse, {
      isOpened: isOpened
    }, Object.keys(compiled.contracts[fileName]).map((contractName, index) => {
      const regexVyp = /([a-zA-Z0-9\s_\\.\-():])+(.vy|.v.py|.vyper.py)$/g;
      const bytecode = fileName.match(regexVyp) ? compiled.contracts[fileName][contractName].evm.bytecode.object.substring(2) : compiled.contracts[fileName][contractName].evm.bytecode.object;
      return React__default.createElement("div", {
        id: contractName,
        className: "contract-container",
        key: index
      }, !deployed[contractName] && interfaces !== null && interfaces[contractName] && compiling === false && React__default.createElement(ContractCompiled$1, {
        contractName: contractName,
        fileName: fileName,
        bytecode: bytecode,
        index: index,
        helpers: this.helpers
      }), deployed[contractName] && React__default.createElement(ContractExecution$1, {
        contractName: contractName,
        bytecode: bytecode,
        index: index,
        helpers: this.helpers
      }));
    })));
  }

}

class Contracts extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
  }

  componentDidUpdate(prevProps) {
    const {
      sources,
      compiled
    } = this.props;

    if (sources != prevProps.sources) {
      // Start compilation of contracts from here
      const workspaceElement = atom.views.getView(atom.workspace);
      atom.commands.dispatch(workspaceElement, 'eth-interface:compile');
    }

    if (compiled !== null && compiled !== prevProps.compiled) {
      if (compiled.contracts) {
        for (const file of Object.entries(compiled.contracts)) {
          for (const [contractName, contract] of Object.entries(file[1])) {
            // Add interface to redux
            const ContractABI = contract.abi;
            this.props.addInterface({
              contractName,
              ContractABI
            });
          }
        }
      }

      if (compiled.errors) {
        this.props.setErrors(compiled.errors);
      }
    }
  }

  render() {
    const {
      compiled,
      deployed,
      compiling,
      interfaces
    } = this.props;
    return React__default.createElement(reactRedux.Provider, {
      store: this.props.store
    }, React__default.createElement("div", {
      id: "compiled-code",
      className: "compiled-code"
    }, compiled && compiled.contracts && Object.keys(compiled.contracts).map((fileName, index) => {
      return React__default.createElement(CollapsedFile, {
        fileName: fileName,
        compiled: compiled,
        deployed: deployed,
        compiling: compiling,
        interfaces: interfaces,
        helpers: this.helpers,
        key: index
      });
    }), !compiled && React__default.createElement("h2", {
      className: "text-warning no-header"
    }, "No compiled contract!"), React__default.createElement("div", {
      id: "compiled-error",
      className: "error-container"
    }, React__default.createElement(ErrorView$1, null))));
  }

}

CollapsedFile.propTypes = {
  helpers: PropTypes.any.isRequired,
  contractName: PropTypes.string,
  bytecode: PropTypes.string,
  index: PropTypes.number,
  instances: PropTypes.any,
  interfaces: PropTypes.object,
  fileName: PropTypes.string,
  compiled: PropTypes.object,
  deployed: PropTypes.any,
  compiling: PropTypes.bool
};
Contracts.propTypes = {
  sources: PropTypes.object,
  helpers: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
  compiled: PropTypes.object,
  deployed: PropTypes.any,
  compiling: PropTypes.bool,
  interfaces: PropTypes.object,
  addInterface: PropTypes.func,
  setErrors: PropTypes.func
};

const mapStateToProps$7 = ({
  contract
}) => {
  const {
    sources,
    compiled,
    deployed,
    compiling,
    interfaces
  } = contract;
  return {
    sources,
    compiled,
    deployed,
    compiling,
    interfaces
  };
};

var Contracts$1 = reactRedux.connect(mapStateToProps$7, {
  addInterface,
  setErrors
})(Contracts);

class TxAnalyzer extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.state = {
      txHash: undefined,
      txAnalysis: props.txAnalysis,
      toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
      isOpened: false
    };
    this._handleTxHashChange = this._handleTxHashChange.bind(this);
    this._handleTxHashSubmit = this._handleTxHashSubmit.bind(this);
    this._toggleCollapse = this._toggleCollapse.bind(this);
  }

  componentDidMount() {
    const {
      pendingTransactions
    } = this.props;

    if (pendingTransactions.length < 10) {
      this.setState({
        isOpened: true,
        toggleBtnStyle: 'btn btn-success icon icon-fold inline-block-tight'
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.txAnalysis !== this.props.txAnalysis) {
      this.setState({
        txAnalysis: this.props.txAnalysis
      });
    }
  }

  _toggleCollapse() {
    const {
      isOpened
    } = this.state;
    this.setState({
      isOpened: !isOpened
    });

    if (!isOpened) {
      this.setState({
        toggleBtnStyle: 'btn btn-success icon icon-fold inline-block-tight'
      });
    } else {
      this.setState({
        toggleBtnStyle: 'btn icon icon-unfold inline-block-tight'
      });
    }
  }

  _handleTxHashChange(event) {
    this.setState({
      txHash: event.target.value
    });
  }

  async _handleTxHashSubmit() {
    const {
      txHash
    } = this.state;

    if (txHash) {
      try {
        const txAnalysis = await this.helpers.getTxAnalysis(txHash);
        this.setState({
          txAnalysis
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  render() {
    const {
      toggleBtnStyle,
      isOpened
    } = this.state;
    const {
      pendingTransactions,
      txAnalysis
    } = this.props;
    const transactions = pendingTransactions.slice();
    transactions.reverse();
    return React__default.createElement("div", {
      className: "tx-analyzer"
    }, React__default.createElement("div", {
      className: "flex-row"
    }, React__default.createElement("form", {
      className: "flex-row",
      onSubmit: this._handleTxHashSubmit
    }, React__default.createElement("div", {
      className: "inline-block"
    }, React__default.createElement("input", {
      type: "text",
      name: "txhash",
      value: this.state.txHash,
      onChange: this._handleTxHashChange,
      placeholder: "Transaction hash",
      className: "input-search"
    })), React__default.createElement("div", {
      className: "inline-block"
    }, React__default.createElement("input", {
      type: "submit",
      value: "Analyze",
      className: "btn"
    }))), React__default.createElement("button", {
      className: toggleBtnStyle,
      onClick: this._toggleCollapse
    }, "Transaction List")), React__default.createElement(reactCollapse.Collapse, {
      isOpened: isOpened
    }, transactions.length > 0 && React__default.createElement(VirtualList, {
      itemCount: transactions.length,
      itemSize: 30,
      class: "tx-list-container",
      overscanCount: 10,
      renderItem: ({
        index
      }) => React__default.createElement("div", {
        className: "tx-list-item"
      }, React__default.createElement("span", {
        className: "padded text-warning"
      }, transactions[index]))
    })), txAnalysis && txAnalysis.transaction && React__default.createElement("div", {
      className: "block"
    }, React__default.createElement("h2", {
      className: "block highlight-info tx-header"
    }, "Transaction"), React__default.createElement(ReactJson, {
      src: txAnalysis.transaction,
      theme: "chalk",
      displayDataTypes: false,
      name: false,
      collapseStringsAfterLength: 64,
      iconStyle: "triangle"
    })), txAnalysis && txAnalysis.transactionRecipt && React__default.createElement("div", {
      className: "block"
    }, React__default.createElement("h2", {
      className: "block highlight-info tx-header"
    }, "Transaction receipt"), React__default.createElement(ReactJson, {
      src: txAnalysis.transactionRecipt,
      theme: "chalk",
      displayDataTypes: false,
      name: false,
      collapseStringsAfterLength: 64,
      iconStyle: "triangle"
    })));
  }

}

TxAnalyzer.propTypes = {
  helpers: PropTypes.any.isRequired,
  pendingTransactions: PropTypes.array,
  txAnalysis: PropTypes.any
};

const mapStateToProps$8 = ({
  eventReducer
}) => {
  const {
    pendingTransactions,
    txAnalysis
  } = eventReducer;
  return {
    pendingTransactions,
    txAnalysis
  };
};

var TxAnalyzer$1 = reactRedux.connect(mapStateToProps$8, {})(TxAnalyzer);

class EventItem extends React__default.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
      toggleBtnTxt: 'Expand'
    };
    this._toggleCollapse = this._toggleCollapse.bind(this);
  }

  _toggleCollapse() {
    const {
      isOpened
    } = this.state;
    this.setState({
      isOpened: !isOpened
    });

    if (!isOpened) {
      this.setState({
        toggleBtnStyle: 'btn btn-success icon icon-fold inline-block-tight',
        toggleBtnTxt: 'Collapse'
      });
    } else {
      this.setState({
        toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
        toggleBtnTxt: 'Expand'
      });
    }
  }

  render() {
    const {
      event
    } = this.props;
    const {
      isOpened,
      toggleBtnStyle,
      toggleBtnTxt
    } = this.state;
    return React__default.createElement("li", {
      className: "event-list-item"
    }, React__default.createElement("label", {
      className: "label event-collapse-label"
    }, React__default.createElement("h4", {
      className: "padded text-warning"
    }, event.id, " : ", event.event), React__default.createElement("button", {
      className: toggleBtnStyle,
      onClick: this._toggleCollapse
    }, toggleBtnTxt)), React__default.createElement(reactCollapse.Collapse, {
      isOpened: isOpened
    }, React__default.createElement(ReactJson, {
      src: event,
      theme: "chalk",
      displayDataTypes: false,
      name: false,
      collapseStringsAfterLength: 64,
      iconStyle: "triangle"
    })));
  }

}

EventItem.propTypes = {
  event: PropTypes.object
};

class Events extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
  }

  render() {
    const {
      events
    } = this.props;
    const events_ = events.slice();
    events_.reverse();
    return React__default.createElement("div", {
      className: "events-container select-list"
    }, React__default.createElement("ul", {
      className: "list-group"
    }, events_.length > 0 && events_.map((event, i) => {
      return React__default.createElement(EventItem, {
        key: i,
        event: event
      });
    }), !(events_.length > 0) && React__default.createElement("h2", {
      className: "text-warning no-header"
    }, "No events found!")));
  }

}

Events.propTypes = {
  helpers: PropTypes.any.isRequired,
  events: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps$9 = ({
  eventReducer
}) => {
  const {
    events
  } = eventReducer;
  return {
    events
  };
};

var Events$1 = reactRedux.connect(mapStateToProps$9, {})(Events);

Object.defineProperty(String.prototype, 'regexIndexOf', {
  value(regex, startpos) {
    const indexOf = this.substring(startpos || 0).search(regex);
    return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
  }

});

class RemixTest extends React__default.Component {
  constructor(props) {
    super(props);
    this.state = {
      testResults: [],
      testResult: null,
      running: false
    };
  }

  createWorker(fn) {
    const pkgPath = atom.packages.resolvePackagePath('etheratom');
    return child_process.fork(`${pkgPath}/lib/web3/worker.js`);
  }

  componentDidMount() {
    this.props.resetErrors();
  }

  componentDidUpdate(prevProps) {
    const {
      sources
    } = this.props;

    if (sources != prevProps.sources) {
      this._runRemixTests();
    }
  }

  async _runRemixTests() {
    const {
      sources
    } = this.props;
    this.setState({
      testResults: [],
      testResult: {
        totalFailing: 0,
        totalPassing: 0,
        totalTime: 0
      },
      running: true
    });
    this.props.resetErrors();

    try {
      const utWorker = this.createWorker();
      utWorker.send({
        command: 'runTests',
        payload: sources
      });
      utWorker.on('message', m => {
        if (m._testCallback) {
          const result = m.result;
          const {
            testResults
          } = this.state;
          console.log(testResults);
          const t = testResults.slice();
          t.push(result);
          this.setState({
            testResults: t
          });
        }

        if (m._resultsCallback) {
          const result = m.result;
          console.log(result);
        }

        if (m._finalCallback) {
          const result = m.result;
          this.setState({
            testResult: result,
            running: false
          });
          utWorker.kill();
        }

        if (m._importFileCb) {
          const result = m.result;
          console.log(result);
        }

        if (m.error) {
          console.log(m);
          const e = m.error;
          this.props.setErrors(e);
        }
      });
      utWorker.on('error', e => {
        throw e;
      });
      utWorker.on('exit', (code, signal) => {
        this.setState({
          running: false
        });
        console.log('%c Compile worker process exited with ' + `code ${code} and signal ${signal}`, 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
      });
    } catch (e) {
      this.props.setErrors(e);
      e.forEach(err => {
        console.error(err);
      });
    }
  }

  async injectTests(source) {
    const s = /^(import)\s['"](remix_tests.sol|tests.sol)['"];/gm;

    if (source.content && source.content.regexIndexOf(s) < 0) {
      return source.content.replace(/(pragma solidity \^\d+\.\d+\.\d+;)/, '$1\nimport \'remix_tests.sol\';');
    }
  }

  render() {
    const {
      testResults,
      testResult,
      running
    } = this.state;
    return React__default.createElement(reactRedux.Provider, {
      store: this.props.store
    }, React__default.createElement("div", {
      id: "remix-tests"
    }, React__default.createElement("h3", {
      className: "block test-header"
    }, "Test files should have [foo]_test.sol suffix"), React__default.createElement("div", {
      className: "test-selector"
    }, React__default.createElement("button", {
      className: "btn btn-primary inline-block-tight",
      onClick: this._runRemixTests
    }, "Run tests"), running && React__default.createElement("span", {
      className: "loading loading-spinner-tiny inline-block"
    }), testResult && React__default.createElement("div", {
      className: "test-result"
    }, React__default.createElement("span", {
      className: "text-error"
    }, "Total failing: ", testResult.totalFailing, " "), React__default.createElement("span", {
      className: "text-success"
    }, "Total passing: ", testResult.totalPassing, " "), React__default.createElement("span", {
      className: "text-info"
    }, "Time: ", testResult.totalTime))), React__default.createElement(VirtualList, {
      height: "50vh",
      itemCount: testResults.length,
      itemSize: 30,
      className: "test-result-list-container",
      overscanCount: 10,
      renderItem: ({
        index
      }) => React__default.createElement("div", {
        key: index,
        className: "test-result-list-item"
      }, testResults[index].type === 'contract' && React__default.createElement("span", {
        className: "status-renamed icon icon-checklist"
      }), testResults[index].type === 'testPass' && React__default.createElement("span", {
        className: "status-added icon icon-check"
      }), testResults[index].type === 'testFailure' && React__default.createElement("span", {
        className: "status-removed icon icon-x"
      }), React__default.createElement("span", {
        className: "padded text-warning"
      }, testResults[index].value))
    }), React__default.createElement("div", {
      id: "test-error",
      className: "error-container"
    }, React__default.createElement(ErrorView$1, null))));
  }

}

RemixTest.propTypes = {
  helpers: PropTypes.any.isRequired,
  sources: PropTypes.object,
  compiled: PropTypes.object,
  setErrors: PropTypes.func,
  resetErrors: PropTypes.func,
  store: PropTypes.any.isRequired
};

const mapStateToProps$a = ({
  files
}) => {
  const {
    sources
  } = files;
  return {
    sources
  };
};

var RemixTest$1 = reactRedux.connect(mapStateToProps$a, {
  setErrors,
  resetErrors
})(RemixTest);

class RemixDebugger extends React__default.Component {
  constructor(props) {
    super(props);
  }

  getDebugWeb3() {
    return new Promise((resolve, reject) => {
      remixLib.execution.executionContext.detectNetwork((error, network) => {
        let web3;

        if (error || !network) {
          web3 = remixLib.init.web3DebugNode(remixLib.execution.executionContext.web3());
        } else {
          const webDebugNode = remixLib.init.web3DebugNode(network.name);
          web3 = !webDebugNode ? remixLib.execution.executionContext.web3() : webDebugNode;
        }

        remixLib.init.extendWeb3(web3);
        resolve(web3);
      });
    });
  }

  async _runRemixDebugging(blockNumber, txNumber, tx) {
    let lastCompilationResult;
    if (this.props.compiled) lastCompilationResult = this.props.compiled;
    var api = null;
    let web3 = await this.getDebugWeb3();
    this.debugger = new remixDebug.TransactionDebugger({
      web3,
      api,
      compiler: {
        lastCompilationResult
      }
    });
    this.debugger.debug(blockNumber, txNumber, tx, () => {
      console.log('debugger detected');
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    // const { blockNumber, txNumber, tx } = this.props;
    return React__default.createElement(reactRedux.Provider, {
      store: this.props.store
    }, React__default.createElement("div", {
      id: "remix-Debugger"
    }, React__default.createElement("h3", null, "Remix-Debugger"), React__default.createElement("button", {
      className: "btn btn-primary inline-block-tight"
    }, "Run debug")));
  }

}

RemixDebugger.propTypes = {
  compiled: PropTypes.object,
  store: PropTypes.any
};

const mapStateToProps$b = ({
  contract
}) => {
  const {
    compiled
  } = contract;
  return {
    compiled
  };
};

var RemixDebugger$1 = reactRedux.connect(mapStateToProps$b, {})(RemixDebugger);

class NodeControl extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.helpers.isWsProvider();
    this.helpers.isHttpProvider();
    const {
      clients
    } = this.props;
    const client = clients[0];
    this.state = {
      // TODO: get values from props
      wsProvider: client.isWsProvider,
      httpProvider: client.isHttpProvider,
      connected: client.hasConnection,
      toAddress: '',
      amount: 0,
      rpcAddress: atom.config.get('etheratom.rpcAddress'),
      websocketAddress: atom.config.get('etheratom.websocketAddress'),
      status: this.props.store.getState().node.status
    };
    this._refreshSync = this._refreshSync.bind(this);
    this.getNodeInfo = this.getNodeInfo.bind(this);
    this._handleToAddrrChange = this._handleToAddrrChange.bind(this);
    this._handleSend = this._handleSend.bind(this);
    this._handleAmountChange = this._handleAmountChange.bind(this);
    this._handleWsChange = this._handleWsChange.bind(this);
    this._handleWsSubmit = this._handleWsSubmit.bind(this);
    this._handleRPCChange = this._handleRPCChange.bind(this);
    this._handleRPCSubmit = this._handleRPCSubmit.bind(this);
  }

  async componentDidMount() {
    this.getNodeInfo();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.httpProvider !== this.props.store.getState().clientReducer.clients[0].isHttpProvider) {
      this.setState({
        httpProvider: this.props.store.getState().clientReducer.clients[0].isHttpProvider
      });
    }

    if (this.state.wsProvider !== this.props.store.getState().clientReducer.clients[0].isWsProvider) {
      this.setState({
        wsProvider: this.props.store.getState().clientReducer.clients[0].isWsProvider
      });
    }
  }

  async _refreshSync() {
    await this.helpers.getAccounts();
    this.getNodeInfo();
    const {
      clients
    } = this.props;
    const client = clients[0];
    this.setState({
      wsProvider: client.isWsProvider,
      httpProvider: client.isHttpProvider,
      connected: client.hasConnection
    });
  }

  async getNodeInfo() {
    // get sync status
    await this.helpers.getSyncStat();
    this.setState({
      status: this.props.store.getState().node.status
    });
    this.props.setSyncStatus(this.state.status); // get mining status

    await this.helpers.getMining(); // get hashrate

    await this.helpers.getHashrate(); // this.props.setHashrate(hashRate);
  }

  _handleToAddrrChange(event) {
    this.setState({
      toAddress: event.target.value
    });
  }

  _handleAmountChange(event) {
    this.setState({
      amount: event.target.value
    });
  }

  _handleWsChange(event) {
    atom.config.set('etheratom.websocketAddress', event.target.value);
    this.setState({
      websocketAddress: event.target.value
    });
  }

  _handleRPCChange(event) {
    atom.config.set('etheratom.rpcAddress', event.target.value);
    this.setState({
      rpcAddress: event.target.value
    });
  }

  async _handleWsSubmit(event) {
    event.preventDefault();
    const {
      websocketAddress
    } = this.state;
    atom.config.set('etheratom.websocketAddress', websocketAddress);
    const newState = {
      wsProvider: this.props.store.getState().clientReducer.clients[0].isWsProvider,
      httpProvider: this.props.store.getState().clientReducer.clients[0].isHttpProvider,
      connected: this.props.store.getState().clientReducer.clients[0].hasConnection,
      toAddress: '',
      amount: 0,
      rpcAddress: atom.config.get('etheratom.rpcAddress'),
      websocketAddress: atom.config.get('etheratom.websocketAddress')
    };
    this.setState(newState); // this.helpers.updateWeb3();

    try {
      await this.helpers.getAccountsForNodeSubmit('node_ws', websocketAddress);
    } catch (e) {
      this.helpers.showPanelError('Error with Web Socket value. Please check again');
    }
  }

  async _handleRPCSubmit(event) {
    event.preventDefault();
    const {
      rpcAddress
    } = this.state;
    atom.config.set('etheratom.rpcAddress', rpcAddress);
    const newState = {
      wsProvider: this.props.store.getState().clientReducer.clients[0].isWsProvider,
      httpProvider: this.props.store.getState().clientReducer.clients[0].isHttpProvider,
      connected: this.props.store.getState().clientReducer.clients[0].hasConnection,
      toAddress: '',
      amount: 0,
      rpcAddress: atom.config.get('etheratom.rpcAddress'),
      websocketAddress: atom.config.get('etheratom.websocketAddress')
    };
    this.setState(newState); // this.helpers.updateWeb3();

    try {
      await this.helpers.getAccountsForNodeSubmit('node_rpc', rpcAddress);
    } catch (e) {
      this.helpers.showPanelError('Error with RPC value. Please check again');
    }
  }

  async _handleSend() {
    try {
      const {
        password
      } = this.props;
      const {
        toAddress,
        amount
      } = this.state;
      await this.helpers.send(toAddress, amount, password); // this.helpers.showTransaction({ head: 'Transaction recipt:', data: txRecipt });
    } catch (e) {
      this.helpers.showPanelError(e);
    }
  }

  render() {
    const {
      coinbase,
      status,
      syncing,
      mining,
      hashRate
    } = this.props;
    const {
      connected,
      wsProvider,
      httpProvider,
      toAddress,
      amount,
      rpcAddress,
      websocketAddress
    } = this.state;
    return React__default.createElement("div", {
      id: "NodeControl"
    }, React__default.createElement("div", {
      id: "connections"
    }, React__default.createElement("ul", {
      className: "connection-urls list-group"
    }, React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("form", {
      onSubmit: this._handleWsSubmit
    }, React__default.createElement("input", {
      type: "submit",
      value: "WS",
      className: wsProvider && connected ? 'btn btn-success smallbtn' : 'btn btn-error smallbtn'
    }), React__default.createElement("input", {
      type: "string",
      placeholder: "Address",
      className: "input-text",
      value: websocketAddress,
      onChange: this._handleWsChange
    }))), React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("form", {
      onSubmit: this._handleRPCSubmit
    }, React__default.createElement("input", {
      type: "submit",
      value: "RPC",
      className: httpProvider && connected ? 'btn btn-success smallbtn' : 'btn btn-error smallbtn'
    }), React__default.createElement("input", {
      type: "string",
      placeholder: "Address",
      className: "input-text",
      value: rpcAddress,
      onChange: this._handleRPCChange
    }))), React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Connected:"), React__default.createElement("span", {
      className: "inline-block"
    }, `${connected}`)))), React__default.createElement("ul", {
      className: "list-group"
    }, React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Coinbase:"), React__default.createElement("span", {
      className: "inline-block"
    }, coinbase))), Object.keys(status).length > 0 && status instanceof Object && React__default.createElement("ul", {
      className: "list-group"
    }, React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Sync progress:"), React__default.createElement("progress", {
      className: "inline-block",
      max: "100",
      value: (100 * (status.currentBlock / status.highestBlock)).toFixed(2)
    }), React__default.createElement("span", {
      className: "inline-block"
    }, (100 * (status.currentBlock / status.highestBlock)).toFixed(2), "%")), React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Current Block:"), React__default.createElement("span", {
      className: "inline-block"
    }, status.currentBlock)), React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Highest Block:"), React__default.createElement("span", {
      className: "inline-block"
    }, status.highestBlock)), React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Known States:"), React__default.createElement("span", {
      className: "inline-block"
    }, status.knownStates)), React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Pulled States"), React__default.createElement("span", {
      className: "inline-block"
    }, status.pulledStates)), React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Starting Block:"), React__default.createElement("span", {
      className: "inline-block"
    }, status.startingBlock))), !syncing && React__default.createElement("ul", {
      className: "list-group"
    }, React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Syncing:"), React__default.createElement("span", {
      className: "inline-block"
    }, `${syncing}`))), React__default.createElement("ul", {
      className: "list-group"
    }, React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Mining:"), React__default.createElement("span", {
      className: "inline-block"
    }, `${mining}`)), React__default.createElement("li", {
      className: "list-item"
    }, React__default.createElement("span", {
      className: "inline-block highlight"
    }, "Hashrate:"), React__default.createElement("span", {
      className: "inline-block"
    }, hashRate))), React__default.createElement("button", {
      className: "btn",
      onClick: this._refreshSync
    }, "Refresh"), React__default.createElement("form", {
      className: "row",
      onSubmit: this._handleSend
    }, React__default.createElement("input", {
      type: "string",
      placeholder: "To address",
      className: "input-text",
      value: toAddress,
      onChange: this._handleToAddrrChange
    }), React__default.createElement("input", {
      type: "number",
      placeholder: "Amount",
      className: "input-text",
      value: amount,
      onChange: this._handleAmountChange
    }), React__default.createElement("input", {
      className: "btn inline-block-tight",
      type: "submit",
      value: "Send"
    })));
  }

}

NodeControl.propTypes = {
  helpers: PropTypes.any.isRequired,
  syncing: PropTypes.bool,
  status: PropTypes.object,
  mining: PropTypes.bool,
  hashRate: PropTypes.number,
  coinbase: PropTypes.number,
  setHashrate: PropTypes.func,
  setMining: PropTypes.func,
  setSyncStatus: PropTypes.func,
  setAccounts: PropTypes.func,
  setCoinbase: PropTypes.func,
  setErrors: PropTypes.string,
  password: PropTypes.string,
  clients: PropTypes.array.isRequired,
  store: PropTypes.any
};

const mapStateToProps$c = ({
  account,
  node,
  clientReducer
}) => {
  const {
    coinbase,
    password
  } = account;
  const {
    status,
    syncing,
    mining,
    hashRate
  } = node;
  const {
    clients
  } = clientReducer;
  return {
    coinbase,
    password,
    status,
    syncing,
    mining,
    hashRate,
    clients
  };
};

var NodeControl$1 = reactRedux.connect(mapStateToProps$c, {
  setAccounts,
  setCoinbase,
  setSyncStatus,
  setMining,
  setHashrate,
  setErrors
})(NodeControl);

class StaticAnalysis extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.anlsRunner = new remixAnalyzer.CodeAnalysis();
    this.state = {
      anlsModules: this.anlsRunner.modules(),
      nodes: this._getNodes(this.anlsRunner.modules()),
      checked: [],
      analysis: [],
      running: false
    };
    this._runAnalysis = this._runAnalysis.bind(this);
  }

  componentDidMount() {
    // Mark all modules checked in the begining
    const {
      nodes
    } = this.state;
    const checked = [];

    for (let i = 0; i < nodes.length; i++) {
      checked.push(i);
    }

    this.setState({
      checked
    });
  }

  _getNodes(modules) {
    return modules.map((module, i) => {
      return Object.assign({}, {}, {
        value: i,
        label: module.description,
        index: i
      });
    });
  }

  async _runAnalysis() {
    const {
      checked
    } = this.state;
    const {
      compiled
    } = this.props;
    this.setState({
      analysis: [],
      running: true
    });

    if (compiled != null) {
      try {
        const analysis = await this.getAnalysis(compiled, checked);
        this.setState({
          analysis,
          running: false
        });
      } catch (e) {
        this.setState({
          running: false
        });
        throw e;
      }
    } else {
      this.setState({
        running: false
      });
      this.helpers.showPanelError('Compile the code first then, analyse it.');
    }
  }

  async getAnalysis(compiled, checked) {
    return new Promise((resolve, reject) => {
      this.anlsRunner.run(compiled, checked, (analysis, error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(analysis);
      });
    });
  }

  render() {
    const {
      nodes,
      analysis,
      running
    } = this.state;
    return React__default.createElement("div", {
      className: "static-analyzer"
    }, React__default.createElement(CheckboxTree, {
      nodes: nodes,
      checked: this.state.checked,
      expanded: this.state.expanded,
      onCheck: checked => this.setState({
        checked
      }),
      showNodeIcon: false
    }), React__default.createElement("button", {
      className: "btn btn-primary inline-block-tight",
      onClick: this._runAnalysis
    }, "Run analysis"), running && React__default.createElement("span", {
      className: "loading loading-spinner-tiny inline-block"
    }), analysis.length > 0 && analysis.map((a, j) => {
      if (a.report.length > 0) {
        return React__default.createElement("div", {
          className: "padded",
          key: j
        }, a.report.map((report, i) => {
          return React__default.createElement("div", {
            key: i
          }, report.location && React__default.createElement("span", {
            className: "text-info"
          }, report.location, ' '), report.warning && React__default.createElement("span", {
            className: "text-warning",
            dangerouslySetInnerHTML: {
              __html: report.warning
            }
          }), report.more && React__default.createElement("p", null, React__default.createElement("a", {
            className: "text-info",
            href: report.more
          }, report.more)));
        }));
      }

      return;
    }));
  }

}

StaticAnalysis.propTypes = {
  helpers: PropTypes.any.isRequired,
  compiled: PropTypes.object
};

const mapStateToProps$d = ({
  contract
}) => {
  const {
    compiled
  } = contract;
  return {
    compiled
  };
};

var StaticAnalysis$1 = reactRedux.connect(mapStateToProps$d, {})(StaticAnalysis);

class TabView extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.state = {
      txBtnStyle: 'btn',
      eventBtnStyle: 'btn',
      newTxCounter: 0,
      newEventCounter: 0
    };
    this._handleTabSelect = this._handleTabSelect.bind(this);
  }

  _handleTabSelect(index) {
    if (index === 3) {
      this.setState({
        newTxCounter: 0,
        txBtnStyle: 'btn'
      });
    }

    if (index === 4) {
      this.setState({
        newEventCounter: 0,
        eventBtnStyle: 'btn'
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      newTxCounter,
      newEventCounter
    } = this.state;

    if (this.props.pendingTransactions !== nextProps.pendingTransactions) {
      this.setState({
        newTxCounter: newTxCounter + 1,
        txBtnStyle: 'btn btn-error'
      });
    }

    if (this.props.events !== nextProps.events && nextProps.events.length > 0) {
      this.setState({
        newEventCounter: newEventCounter + 1,
        eventBtnStyle: 'btn btn-error'
      });
    }
  }

  render() {
    const {
      eventBtnStyle,
      txBtnStyle,
      newTxCounter,
      newEventCounter
    } = this.state;
    return React__default.createElement(reactTabs.Tabs, {
      onSelect: index => this._handleTabSelect(index),
      className: "react-tabs vertical-tabs"
    }, React__default.createElement(reactTabs.TabList, {
      className: "react-tabs__tab-list vertical tablist"
    }, React__default.createElement("div", {
      className: "tab_btns"
    }, React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn"
    }, "Contract")), React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn"
    }, "Tests")), React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn"
    }, "Analysis")), React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: txBtnStyle
    }, "Transaction analyzer", newTxCounter > 0 && React__default.createElement("span", {
      className: "badge badge-small badge-error notify-badge"
    }, newTxCounter))), React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn"
    }, "Debugger")), React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: eventBtnStyle
    }, "Events", newEventCounter > 0 && React__default.createElement("span", {
      className: "badge badge-small badge-error notify-badge"
    }, newEventCounter))), React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn"
    }, "Node")), React__default.createElement(reactTabs.Tab, null, React__default.createElement("div", {
      className: "btn btn-warning"
    }, "Help")))), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement(Contracts$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement(RemixTest$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement(StaticAnalysis$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement(TxAnalyzer$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement(RemixDebugger$1, {
      store: this.props.store
    })), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement(Events$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement(NodeControl$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React__default.createElement(reactTabs.TabPanel, null, React__default.createElement("h2", {
      className: "text-warning"
    }, "Help Etheratom to keep solidity development interactive."), React__default.createElement("h4", {
      className: "text-success"
    }, "Donate Ethereum: 0xd22fE4aEFed0A984B1165dc24095728EE7005a36"), React__default.createElement("p", null, React__default.createElement("span", null, "Etheratom news "), React__default.createElement("a", {
      href: "https://twitter.com/hashtag/Etheratom"
    }, "#Etheratom")), React__default.createElement("p", null, React__default.createElement("span", null, "Etheratom support "), React__default.createElement("a", {
      href: "https://t.me/etheratom"
    }, "t.me/etheratom")), React__default.createElement("p", null, "Contact: ", React__default.createElement("a", {
      href: "mailto:0mkar@protonmail.com",
      target: "_top"
    }, "0mkar@protonmail.com"))));
  }

}

TabView.propTypes = {
  helpers: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
  pendingTransactions: PropTypes.array,
  events: PropTypes.array
};

const mapStateToProps$e = ({
  contract,
  eventReducer
}) => {
  const {
    compiled
  } = contract;
  const {
    pendingTransactions,
    events
  } = eventReducer;
  return {
    compiled,
    pendingTransactions,
    events
  };
};

var TabView$1 = reactRedux.connect(mapStateToProps$e, {})(TabView);

class CoinbaseView extends React__default.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers; // const { balance } = props;

    this.state = {
      coinbase: props.accounts[0],
      password: '',
      toAddress: '',
      unlock_style: 'unlock-default',
      amount: 0
    };
    this._handleAccChange = this._handleAccChange.bind(this);
    this._handlePasswordChange = this._handlePasswordChange.bind(this);
    this._handleUnlock = this._handleUnlock.bind(this);
    this._linkClick = this._linkClick.bind(this);
    this._refreshBal = this._refreshBal.bind(this);
  }

  async componentDidMount() {
    const {
      coinbase
    } = this.state;
    this.helpers.setDefaultAccount(coinbase);
    this.helpers.getBalance(coinbase);
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      coinbase
    } = this.state;

    if (this.state.coinbase !== prevState.coinbase) {
      this.helpers.setDefaultAccount(coinbase);
      this.helpers.getBalance(coinbase);
    }
  }

  async componentWillReceiveProps() {
    if (this.props.accounts[0]) {
      this.setState({
        coinbase: this.props.accounts[0]
      });
    } // this.setState({ balance: this.props.store.getState().account.balance });

  }

  _linkClick(event) {
    const {
      coinbase
    } = this.state;
    atom.clipboard.write(coinbase);
  }

  async _handleAccChange(event) {
    const coinbase = event.target.value;
    const {
      setCoinbase
    } = this.props;
    this.helpers.setDefaultAccount(coinbase);
    this.helpers.getBalance(coinbase);
    setCoinbase(coinbase);
    this.setState({
      coinbase
    });
  }

  _handlePasswordChange(event) {
    const password = event.target.value;
    this.setState({
      password
    }); // TODO: unless we show some indicator on `Unlock` let password set on change

    if (!(password.length - 1 > 0)) {
      this.setState({
        unlock_style: 'unlock-default'
      });
    }
  }

  _handleUnlock(event) {
    // TODO: here try to unlock geth backend node using coinbase and password and show result
    const {
      password,
      coinbase
    } = this.state;
    const {
      setCoinbase,
      setPassword
    } = this.props;

    if (password.length > 0) {
      setPassword({
        password
      });
      setCoinbase(coinbase); // TODO: Set web3.eth.defaultAccount on unlock

      this.helpers.setCoinbase(coinbase);
      this.setState({
        unlock_style: 'unlock-active'
      });
    }

    event.preventDefault();
  }

  async _refreshBal() {
    const {
      coinbase
    } = this.state;
    await this.helpers.getBalance(coinbase);
    this.setState({
      balance: this.props.store.getState().account.balance
    });
  }

  render() {
    const {
      password,
      unlock_style
    } = this.state;
    const {
      balance,
      accounts,
      coinbase
    } = this.props;
    return React__default.createElement("div", {
      className: "content"
    }, accounts.length > 0 && React__default.createElement("div", {
      className: "row"
    }, React__default.createElement("div", {
      className: "icon icon-link btn copy-btn btn-success",
      onClick: this._linkClick
    }), React__default.createElement("select", {
      onChange: this._handleAccChange,
      value: coinbase
    }, accounts.map((account, i) => {
      return React__default.createElement("option", {
        key: i,
        value: account
      }, account);
    })), React__default.createElement("button", {
      onClick: this._refreshBal,
      className: "btn"
    }, " ", balance, " ETH ")), accounts.length > 0 && React__default.createElement("form", {
      className: "row",
      onSubmit: this._handleUnlock
    }, React__default.createElement("div", {
      className: "icon icon-lock"
    }), React__default.createElement("input", {
      type: "password",
      placeholder: "Password",
      value: password,
      onChange: this._handlePasswordChange
    }), React__default.createElement("input", {
      type: "submit",
      className: unlock_style,
      value: "Unlock"
    })));
  }

}

CoinbaseView.propTypes = {
  helpers: PropTypes.any.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.string),
  setCoinbase: PropTypes.function,
  store: PropTypes.any,
  balance: PropTypes.any,
  coinbase: PropTypes.any,
  setPassword: PropTypes.function
};

const mapStateToProps$f = ({
  account
}) => {
  const {
    coinbase,
    password,
    accounts,
    balance
  } = account;
  return {
    coinbase,
    password,
    accounts,
    balance
  };
};

var CoinbaseView$1 = reactRedux.connect(mapStateToProps$f, {
  setCoinbase,
  setPassword
})(CoinbaseView);

class VersionSelector extends React__default.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableVersions: [],
      selectedVersion: ''
    };
    this._handleVersionSelector = this._handleVersionSelector.bind(this);
  }

  async _handleVersionSelector(event) {
    const selectedVersion = event.target.value;
    await this.setState({
      selectedVersion
    });
    atom.config.set('etheratom.versionSelector', selectedVersion);
  }

  async componentDidMount() {
    this.fetchVersionList();
  }

  async fetchVersionList() {
    const versions = await axios.get('https://ethereum.github.io/solc-bin/bin/list.json');
    this.setState({
      availableVersions: versions.data.releases,
      selectedVersion: atom.config.get('etheratom.versionSelector')
    });
  }

  render() {
    const {
      availableVersions
    } = this.state;
    return React__default.createElement("div", {
      className: "content"
    }, React__default.createElement("div", {
      className: "row"
    }, React__default.createElement("select", {
      onChange: this._handleVersionSelector,
      value: this.state.selectedVersion
    }, Object.keys(availableVersions).map((key, i) => {
      return React__default.createElement("option", {
        key: i,
        value: availableVersions[key].split('soljson-')[1].split('.js')[0]
      }, availableVersions[key]);
    }))));
  }

}

VersionSelector.propTypes = {
  selectedVersion: PropTypes.string
};

const mapStateToProps$g = ({
  contract
}) => {
  const {
    selectedVersion
  } = contract;
  return {
    selectedVersion
  };
};

var VersionSelector$1 = reactRedux.connect(mapStateToProps$g, {})(VersionSelector);

class CompileBtn extends React__default.Component {
  constructor(props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  async _handleSubmit() {
    const workspaceElement = atom.views.getView(atom.workspace);
    await atom.commands.dispatch(workspaceElement, 'eth-interface:compile');
  }

  render() {
    const {
      compiling
    } = this.props;
    return React__default.createElement("form", {
      className: "row form-btn",
      onSubmit: this._handleSubmit
    }, compiling && React__default.createElement("input", {
      type: "submit",
      value: "Compiling...",
      className: "btn copy-btn btn-success",
      disabled: true
    }), !compiling && React__default.createElement("input", {
      type: "submit",
      value: "Compile",
      className: "btn copy-btn btn-success"
    }));
  }

}

CompileBtn.propTypes = {
  compiling: PropTypes.bool
};

const mapStateToProps$h = ({
  contract
}) => {
  const {
    compiling
  } = contract;
  return {
    compiling
  };
};

var CompileBtn$1 = reactRedux.connect(mapStateToProps$h, {})(CompileBtn);

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/* eslint-disable */
// murmurhash2 via https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js
function murmurhash2_32_gc(str) {
  var l = str.length,
      h = l ^ l,
      i = 0,
      k;

  while (l >= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
    l -= 4;
    ++i;
  }

  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  h ^= h >>> 15;
  return (h >>> 0).toString(36);
}

var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var processStyleName = memoize(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  if (value == null || typeof value === 'boolean') {
    return '';
  }

  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (process.env.NODE_ENV !== 'production') {
  var contentValuePattern = /(attr|calc|counters?|url)\(/;
  var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        console.error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, char) {
        return char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var shouldWarnAboutInterpolatingClassNameFromCss = true;

function handleInterpolation(mergedProps, registered, interpolation, couldBeSelectorInterpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if (process.env.NODE_ENV !== 'production' && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles;

          if (process.env.NODE_ENV !== 'production' && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result, couldBeSelectorInterpolation);
        } else if (process.env.NODE_ENV !== 'production') {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }
      }
    // eslint-disable-next-line no-fallthrough

    default:
      {
        if (registered == null) {
          return interpolation;
        }

        var cached = registered[interpolation];

        if (process.env.NODE_ENV !== 'production' && couldBeSelectorInterpolation && shouldWarnAboutInterpolatingClassNameFromCss && cached !== undefined) {
          console.error('Interpolating a className from css`` is not recommended and will cause problems with composition.\n' + 'Interpolating a className from css`` will be completely unsupported in a future major version of Emotion');
          shouldWarnAboutInterpolatingClassNameFromCss = false;
        }

        return cached !== undefined && !couldBeSelectorInterpolation ? cached : interpolation;
      }
  }
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i], false);
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && process.env.NODE_ENV !== 'production') {
          throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value, false);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;
var sourceMapPattern;

if (process.env.NODE_ENV !== 'production') {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings, false);
  } else {
    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i], styles.charCodeAt(styles.length - 1) === 46);

    if (stringMode) {
      styles += strings[i];
    }
  }

  var sourceMap;

  if (process.env.NODE_ENV !== 'production') {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = murmurhash2_32_gc(styles) + identifierName;

  if (process.env.NODE_ENV !== 'production') {
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};

function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return serializeStyles(args);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var inheritsLoose = _inheritsLoose;

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  return tag;
}

var StyleSheet =
/*#__PURE__*/
function () {
  function StyleSheet(options) {
    this.isSpeedy = options.speedy === undefined ? process.env.NODE_ENV === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      var _tag = createStyleElement(this);

      var before;

      if (this.tags.length === 0) {
        before = this.before;
      } else {
        before = this.tags[this.tags.length - 1].nextSibling;
      }

      this.container.insertBefore(_tag, before);
      this.tags.push(_tag);
    }

    var tag = this.tags[this.tags.length - 1];

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is a really hot path
        // we check the second character first because having "i"
        // as the second character will happen less often than
        // having "@" as the first character
        var isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64; // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools

        sheet.insertRule(rule, // we need to insert @import rules before anything else
        // otherwise there will be an error
        // technically this means that the @import rules will
        // _usually_(not always since there could be multiple style tags)
        // be the first ones in prod and generally later in dev
        // this shouldn't really matter in the real world though
        // @import is generally only used for font faces from google fonts and etc.
        // so while this could be technically correct then it would be slower and larger
        // for a tiny bit of correctness that won't matter in the real world
        isImportRule ? 0 : sheet.cssRules.length);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };

  return StyleSheet;
}();

function stylis_min (W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;

            default:
              f += e.charAt(l);
          }

          g = 59;
        }

        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;

            for (t = ++l; l < B;) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;

                case 125:
                  k--;
                  break;

                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }

                              break;

                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }

                          }
                        }

                        l = u;
                      }

                  }

                  break;

                case 91:
                  g++;

                case 40:
                  g++;

                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g;) {
                  }

              }

              if (0 === k) break;
              l++;
            }

            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ''));
                g = f.charCodeAt(1);

                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;

                  default:
                    r = O;
                }

                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                if (0 < t) switch (g) {
                  case 115:
                    f = f.replace(da, ea);

                  case 100:
                  case 109:
                  case 45:
                    k = f + '{' + k + '}';
                    break;

                  case 107:
                    f = f.replace(fa, '$1 $2');
                    k = f + '{' + k + '}';
                    k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                    break;

                  default:
                    k = f + k, 112 === h && (k = (p += k, ''));
                } else k = '';
                break;

              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }

            F += k;
            k = I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
            break;

          case 125:
          case 59:
            f = (0 < r ? f.replace(N, '') : f).trim();
            if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
              case 0:
                break;

              case 64:
                if (105 === g || 99 === g) {
                  G += f + e.charAt(l);
                  break;
                }

              default:
                58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
            }
            I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
        }
      }

      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;

        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }

        default:
          z++;
          y = e.charAt(l);

          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b) switch (x) {
                case 44:
                case 58:
                case 9:
                case 32:
                  y = '';
                  break;

                default:
                  32 !== g && (y = ' ');
              }
              break;

            case 0:
              y = '\\0';
              break;

            case 12:
              y = '\\f';
              break;

            case 11:
              y = '\\v';
              break;

            case 38:
              0 === n + b + m && (r = I = 1, y = '\f' + y);
              break;

            case 108:
              if (0 === n + b + m + E && 0 < u) switch (l - u) {
                case 2:
                  112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                case 8:
                  111 === K && (E = K);
              }
              break;

            case 58:
              0 === n + b + m && (u = l);
              break;

            case 44:
              0 === b + v + n + m && (r = 1, y += '\r');
              break;

            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;

            case 91:
              0 === n + b + v && m++;
              break;

            case 93:
              0 === n + b + v && m--;
              break;

            case 41:
              0 === n + b + m && v--;
              break;

            case 40:
              if (0 === n + b + m) {
                if (0 === q) switch (2 * x + 3 * K) {
                  case 533:
                    break;

                  default:
                    q = 1;
                }
                v++;
              }

              break;

            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;

            case 42:
            case 47:
              if (!(0 < n + m + v)) switch (b) {
                case 0:
                  switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                    case 235:
                      b = 47;
                      break;

                    case 220:
                      t = l, b = 42;
                  }

                  break;

                case 42:
                  47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
              }
          }

          0 === b && (f += y);
      }

      K = x;
      x = g;
      l++;
    }

    t = p.length;

    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
      p = r.join(',') + '{' + p + '}';

      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);

        switch (E) {
          case 111:
            p = p.replace(ha, ':-moz-$1') + p;
            break;

          case 112:
            p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
        }

        E = 0;
      }
    }

    return G + p + F;
  }

  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length,
        m = d.length;

    switch (m) {
      case 0:
      case 1:
        var b = 0;

        for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
          c[b] = Z(d, c[b], e).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e).trim();
          }
        }

    }

    return c;
  }

  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));

    switch (h) {
      case 38:
        return c.replace(F, '$1' + d.trim());

      case 58:
        return d.trim() + c.replace(F, '$1' + d.trim());

      default:
        if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
    }

    return d + c;
  }

  function P(d, c, e, h) {
    var a = d + ';',
        m = 2 * c + 3 * e + 4 * h;

    if (944 === m) {
      d = a.indexOf(':', 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ';';
      return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
    }

    if (0 === w || 2 === w && !L(a, 1)) return a;

    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

      case 951:
        return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

      case 963:
        return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

      case 1009:
        if (100 !== a.charCodeAt(4)) break;

      case 969:
      case 942:
        return '-webkit-' + a + a;

      case 978:
        return '-webkit-' + a + '-moz-' + a + a;

      case 1019:
      case 983:
        return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

      case 883:
        if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
        if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
        break;

      case 932:
        if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
          case 103:
            return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

          case 115:
            return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

          case 98:
            return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
        }
        return '-webkit-' + a + '-ms-' + a + a;

      case 964:
        return '-webkit-' + a + '-ms-flex-' + a + a;

      case 1023:
        if (99 !== a.charCodeAt(8)) break;
        b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
        return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

      case 1005:
        return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf('-') + 1;

        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, 'tb');
            break;

          case 232:
            b = a.replace(G, 'tb-rl');
            break;

          case 220:
            b = a.replace(G, 'lr');
            break;

          default:
            return a;
        }

        return '-webkit-' + a + '-ms-' + b + a;

      case 1017:
        if (-1 === a.indexOf('sticky', 9)) break;

      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8)) break;

          case 115:
            a = a.replace(b, '-webkit-' + b) + ';' + a;
            break;

          case 207:
          case 102:
            a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
        }

        return a + ';';

      case 938:
        if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
          case 105:
            return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

          case 115:
            return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

          default:
            return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
        }
        break;

      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

      case 931:
      case 953:
        if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
        break;

      case 962:
        if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
    }

    return a;
  }

  function L(d, c) {
    var e = d.indexOf(1 === c ? ':' : '{'),
        h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, '$1'), e, c);
  }

  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
  }

  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w; g < A; ++g) {
      switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case !1:
        case !0:
        case null:
          break;

        default:
          x = w;
      }
    }

    if (x !== c) return x;
  }

  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;

      default:
        if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
          T(d[c]);
        } else Y = !!d | 0;
    }

    return T;
  }

  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }

  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];

    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && 'string' === typeof h && (c = h);
    }

    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = '';
    E = 0;
    z = D = 1;
    return a;
  }

  var ca = /^\0+/g,
      N = /[\0\r\f]/g,
      aa = /: */g,
      ka = /zoo|gra/,
      ma = /([,: ])(transform)/g,
      ia = /,\r+?/g,
      F = /([\t\r\n ])*\f?&/g,
      fa = /@(k\w+)\s*(\S*)\s*/,
      Q = /::(place)/g,
      ha = /:(read-only)/g,
      G = /[svh]\w+-[tblr]{2}/,
      da = /\(\s*(.*)\s*\)/g,
      oa = /([\s\S]*?);/g,
      ba = /-self|flex-/g,
      na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
      la = /stretch|:\s*\w+\-(?:conte|avail)/,
      ja = /([^-])(image-set\()/,
      z = 1,
      D = 1,
      E = 0,
      w = 1,
      O = [],
      S = [],
      A = 0,
      R = null,
      Y = 0,
      V = '';
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}

var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

// https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
// inlined to avoid umd wrapper and peerDep warnings/installing stylis
// since we use stylis after closure compiler
var delimiter$2 = '/*|*/';
var needle = delimiter$2 + '}';

function toSheet(block) {
  if (block) {
    Sheet.current.insert(block + '}');
  }
}

var Sheet = {
  current: null
};
var ruleSheet = function ruleSheet(context, content, selectors, parents, line, column, length, ns, depth, at) {
  switch (context) {
    // property
    case 1:
      {
        switch (content.charCodeAt(0)) {
          case 64:
            {
              // @import
              Sheet.current.insert(content + ';');
              return '';
            }
          // charcode for l

          case 108:
            {
              // charcode for b
              // this ignores label
              if (content.charCodeAt(2) === 98) {
                return '';
              }
            }
        }

        break;
      }
    // selector

    case 2:
      {
        if (ns === 0) return content + delimiter$2;
        break;
      }
    // at-rule

    case 3:
      {
        switch (ns) {
          // @font-face, @page
          case 102:
          case 112:
            {
              Sheet.current.insert(selectors[0] + content);
              return '';
            }

          default:
            {
              return content + (at === 0 ? delimiter$2 : '');
            }
        }
      }

    case -2:
      {
        content.split(needle).forEach(toSheet);
      }
  }
};
var removeLabel = function removeLabel(context, content) {
  if (context === 1 && // charcode for l
  content.charCodeAt(0) === 108 && // charcode for b
  content.charCodeAt(2) === 98 // this ignores label
  ) {
      return '';
    }
};

var isBrowser = typeof document !== 'undefined';
var rootServerStylisCache = {};
var getServerStylisCache = isBrowser ? undefined : weakMemoize(function () {
  var getCache = weakMemoize(function () {
    return {};
  });
  var prefixTrueCache = {};
  var prefixFalseCache = {};
  return function (prefix) {
    if (prefix === undefined || prefix === true) {
      return prefixTrueCache;
    }

    if (prefix === false) {
      return prefixFalseCache;
    }

    return getCache(prefix);
  };
});

var createCache = function createCache(options) {
  if (options === undefined) options = {};
  var key = options.key || 'css';
  var stylisOptions;

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    };
  }

  var stylis = new stylis_min(stylisOptions);

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {}; // $FlowFixMe

  var container;

  if (isBrowser) {
    container = options.container || document.head;
    var nodes = document.querySelectorAll("style[data-emotion-" + key + "]");
    Array.prototype.forEach.call(nodes, function (node) {
      var attrib = node.getAttribute("data-emotion-" + key); // $FlowFixMe

      attrib.split(' ').forEach(function (id) {
        inserted[id] = true;
      });

      if (node.parentNode !== container) {
        container.appendChild(node);
      }
    });
  }

  var _insert;

  if (isBrowser) {
    stylis.use(options.stylisPlugins)(ruleSheet);

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      Sheet.current = sheet;

      if (process.env.NODE_ENV !== 'production' && serialized.map !== undefined) {
        var map = serialized.map;
        Sheet.current = {
          insert: function insert(rule) {
            sheet.insert(rule + map);
          }
        };
      }

      stylis(selector, serialized.styles);

      if (shouldCache) {
        cache.inserted[name] = true;
      }
    };
  } else {
    stylis.use(removeLabel);
    var serverStylisCache = rootServerStylisCache;

    if (options.stylisPlugins || options.prefix !== undefined) {
      stylis.use(options.stylisPlugins); // $FlowFixMe

      serverStylisCache = getServerStylisCache(options.stylisPlugins || rootServerStylisCache)(options.prefix);
    }

    var getRules = function getRules(selector, serialized) {
      var name = serialized.name;

      if (serverStylisCache[name] === undefined) {
        serverStylisCache[name] = stylis(selector, serialized.styles);
      }

      return serverStylisCache[name];
    };

    _insert = function _insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      var rules = getRules(selector, serialized);

      if (cache.compat === undefined) {
        // in regular mode, we don't set the styles on the inserted cache
        // since we don't need to and that would be wasting memory
        // we return them so that they are rendered in a style tag
        if (shouldCache) {
          cache.inserted[name] = true;
        }

        if ( // using === development instead of !== production
        // because if people do ssr in tests, the source maps showing up would be annoying
        process.env.NODE_ENV === 'development' && serialized.map !== undefined) {
          return rules + serialized.map;
        }

        return rules;
      } else {
        // in compat mode, we put the styles on the inserted cache so
        // that emotion-server can pull out the styles
        // except when we don't want to cache it which was in Global but now
        // is nowhere but we don't want to do a major right now
        // and just in case we're going to leave the case here
        // it's also not affecting client side bundle size
        // so it's really not a big deal
        if (shouldCache) {
          cache.inserted[name] = rules;
        } else {
          return rules;
        }
      }
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    // https://esbench.com/bench/5bf7371a4cd7e6009ef61d0a
    var commentStart = /\/\*/g;
    var commentEnd = /\*\//g;
    stylis.use(function (context, content) {
      switch (context) {
        case -1:
          {
            while (commentStart.test(content)) {
              commentEnd.lastIndex = commentStart.lastIndex;

              if (commentEnd.test(content)) {
                commentStart.lastIndex = commentEnd.lastIndex;
                continue;
              }

              throw new Error('Your styles have an unterminated comment ("/*" without corresponding "*/").');
            }

            commentStart.lastIndex = 0;
            break;
          }
      }
    });
    stylis.use(function (context, content, selectors) {
      switch (context) {
        case -1:
          {
            var flag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';
            var unsafePseudoClasses = content.match(/(:first|:nth|:nth-last)-child/g);

            if (unsafePseudoClasses) {
              unsafePseudoClasses.forEach(function (unsafePseudoClass) {
                var ignoreRegExp = new RegExp(unsafePseudoClass + ".*\\/\\* " + flag + " \\*\\/");
                var ignore = ignoreRegExp.test(content);

                if (unsafePseudoClass && !ignore) {
                  console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
                }
              });
            }

            break;
          }
      }
    });
  }

  var cache = {
    key: key,
    sheet: new StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  return cache;
};

var isBrowser$1 = typeof document !== 'undefined';
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className]);
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser$1 === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var stylesForSSR = '';
    var current = serialized;

    do {
      var maybeStyles = cache.insert("." + className, current, cache.sheet, true);

      if (!isBrowser$1 && maybeStyles !== undefined) {
        stylesForSSR += maybeStyles;
      }

      current = current.next;
    } while (current !== undefined);

    if (!isBrowser$1 && stylesForSSR.length !== 0) {
      return stylesForSSR;
    }
  }
};

var isBrowser$2 = typeof document !== 'undefined';

var EmotionCacheContext = React.createContext(isBrowser$2 ? createCache() : null);
var ThemeContext = React.createContext({});
var CacheProvider = EmotionCacheContext.Provider;

var withEmotionCache = function withEmotionCache(func) {
  var render = function render(props, ref) {
    return React.createElement(EmotionCacheContext.Consumer, null, function ( // $FlowFixMe we know it won't be null
    cache) {
      return func(props, cache, ref);
    });
  }; // $FlowFixMe


  return React.forwardRef(render);
};

if (!isBrowser$2) {
  var BasicProvider =
  /*#__PURE__*/
  function (_React$Component) {
    inheritsLoose(BasicProvider, _React$Component);

    function BasicProvider(props, context, updater) {
      var _this;

      _this = _React$Component.call(this, props, context, updater) || this;
      _this.state = {
        value: createCache()
      };
      return _this;
    }

    var _proto = BasicProvider.prototype;

    _proto.render = function render() {
      return React.createElement(EmotionCacheContext.Provider, this.state, this.props.children(this.state.value));
    };

    return BasicProvider;
  }(React.Component);

  withEmotionCache = function withEmotionCache(func) {
    return function (props) {
      return React.createElement(EmotionCacheContext.Consumer, null, function (context) {
        if (context === null) {
          return React.createElement(BasicProvider, null, function (newContext) {
            return func(props, newContext);
          });
        } else {
          return func(props, context);
        }
      });
    };
  };
}

// thus we only need to replace what is a valid character for JS, but not for CSS

var sanitizeIdentifier = function sanitizeIdentifier(identifier) {
  return identifier.replace(/\$/g, '-');
};

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var labelPropName = '__EMOTION_LABEL_PLEASE_DO_NOT_USE__';
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

var render = function render(cache, props, theme, ref) {
  var type = props[typePropName];
  var registeredStyles = [];
  var className = '';
  var cssProp = theme === null ? props.css : props.css(theme); // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  registeredStyles.push(cssProp);

  if (props.className !== undefined) {
    className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
  }

  var serialized = serializeStyles(registeredStyles);

  if (process.env.NODE_ENV !== 'production' && serialized.name.indexOf('-') === -1) {
    var labelFromStack = props[labelPropName];

    if (labelFromStack) {
      serialized = serializeStyles([serialized, 'label:' + labelFromStack + ';']);
    }
  }

  var rules = insertStyles(cache, serialized, typeof type === 'string');
  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty$1.call(props, key) && key !== 'css' && key !== typePropName && (process.env.NODE_ENV === 'production' || key !== labelPropName)) {
      newProps[key] = props[key];
    }
  }

  newProps.ref = ref;
  newProps.className = className;
  var ele = React.createElement(type, newProps);

  if (!isBrowser$2 && rules !== undefined) {
    var _ref;

    var serializedNames = serialized.name;
    var next = serialized.next;

    while (next !== undefined) {
      serializedNames += ' ' + next.name;
      next = next.next;
    }

    return React.createElement(React.Fragment, null, React.createElement("style", (_ref = {}, _ref["data-emotion-" + cache.key] = serializedNames, _ref.dangerouslySetInnerHTML = {
      __html: rules
    }, _ref.nonce = cache.sheet.nonce, _ref)), ele);
  }

  return ele;
};

var Emotion = withEmotionCache(function (props, cache, ref) {
  // use Context.read for the theme when it's stable
  if (typeof props.css === 'function') {
    return React.createElement(ThemeContext.Consumer, null, function (theme) {
      return render(cache, props, theme, ref);
    });
  }

  return render(cache, props, null, ref);
});

if (process.env.NODE_ENV !== 'production') {
  Emotion.displayName = 'EmotionCssPropInternal';
} // $FlowFixMe


var jsx = function jsx(type, props) {
  var args = arguments;

  if (props == null || props.css == null) {
    // $FlowFixMe
    return React.createElement.apply(undefined, args);
  }

  if (process.env.NODE_ENV !== 'production' && typeof props.css === 'string' && // check if there is a css declaration
  props.css.indexOf(':') !== -1) {
    throw new Error("Strings are not allowed as css prop values, please wrap it in a css template literal from '@emotion/css' like this: css`" + props.css + "`");
  }

  var argsLength = args.length;
  var createElementArgArray = new Array(argsLength);
  createElementArgArray[0] = Emotion;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty$1.call(props, key)) {
      newProps[key] = props[key];
    }
  }

  newProps[typePropName] = type;

  if (process.env.NODE_ENV !== 'production') {
    var error = new Error();

    if (error.stack) {
      // chrome
      var match = error.stack.match(/at jsx.*\n\s+at ([A-Z][A-Za-z$]+) /);

      if (!match) {
        // safari and firefox
        match = error.stack.match(/^.*\n([A-Z][A-Za-z$]+)@/);
      }

      if (match) {
        newProps[labelPropName] = sanitizeIdentifier(match[1]);
      }
    }
  }

  createElementArgArray[1] = newProps;

  for (var i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i];
  } // $FlowFixMe


  return React.createElement.apply(null, createElementArgArray);
};

var warnedAboutCssPropForGlobal = false;
var Global =
/* #__PURE__ */
withEmotionCache(function (props, cache) {
  if (process.env.NODE_ENV !== 'production' && !warnedAboutCssPropForGlobal && ( // check for className as well since the user is
  // probably using the custom createElement which
  // means it will be turned into a className prop
  // $FlowFixMe I don't really want to add it to the type since it shouldn't be used
  props.className || props.css)) {
    console.error("It looks like you're using the css prop on Global, did you mean to use the styles prop instead?");
    warnedAboutCssPropForGlobal = true;
  }

  var styles = props.styles;

  if (typeof styles === 'function') {
    return React.createElement(ThemeContext.Consumer, null, function (theme) {
      var serialized = serializeStyles([styles(theme)]);
      return React.createElement(InnerGlobal, {
        serialized: serialized,
        cache: cache
      });
    });
  }

  var serialized = serializeStyles([styles]);
  return React.createElement(InnerGlobal, {
    serialized: serialized,
    cache: cache
  });
});

// maintain place over rerenders.
// initial render from browser, insertBefore context.sheet.tags[0] or if a style hasn't been inserted there yet, appendChild
// initial client-side render from SSR, use place of hydrating tag
var InnerGlobal =
/*#__PURE__*/
function (_React$Component) {
  inheritsLoose(InnerGlobal, _React$Component);

  function InnerGlobal(props, context, updater) {
    return _React$Component.call(this, props, context, updater) || this;
  }

  var _proto = InnerGlobal.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.sheet = new StyleSheet({
      key: this.props.cache.key + "-global",
      nonce: this.props.cache.sheet.nonce,
      container: this.props.cache.sheet.container
    }); // $FlowFixMe

    var node = document.querySelector("style[data-emotion-" + this.props.cache.key + "=\"" + this.props.serialized.name + "\"]");

    if (node !== null) {
      this.sheet.tags.push(node);
    }

    if (this.props.cache.sheet.tags.length) {
      this.sheet.before = this.props.cache.sheet.tags[0];
    }

    this.insertStyles();
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.serialized.name !== this.props.serialized.name) {
      this.insertStyles();
    }
  };

  _proto.insertStyles = function insertStyles$1() {
    if (this.props.serialized.next !== undefined) {
      // insert keyframes
      insertStyles(this.props.cache, this.props.serialized.next, true);
    }

    if (this.sheet.tags.length) {
      // if this doesn't exist then it will be null so the style element will be appended
      var element = this.sheet.tags[this.sheet.tags.length - 1].nextElementSibling;
      this.sheet.before = element;
      this.sheet.flush();
    }

    this.props.cache.insert("", this.props.serialized, this.sheet, false);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.sheet.flush();
  };

  _proto.render = function render() {
    if (!isBrowser$2) {
      var serialized = this.props.serialized;
      var serializedNames = serialized.name;
      var serializedStyles = serialized.styles;
      var next = serialized.next;

      while (next !== undefined) {
        serializedNames += ' ' + next.name;
        serializedStyles += next.styles;
        next = next.next;
      }

      var shouldCache = this.props.cache.compat === true;
      var rules = this.props.cache.insert("", {
        name: serializedNames,
        styles: serializedStyles
      }, this.sheet, shouldCache);

      if (!shouldCache) {
        var _ref;

        return React.createElement("style", (_ref = {}, _ref["data-emotion-" + this.props.cache.key] = serializedNames, _ref.dangerouslySetInnerHTML = {
          __html: rules
        }, _ref.nonce = this.props.cache.sheet.nonce, _ref));
      }
    }

    return null;
  };

  return InnerGlobal;
}(React.Component);

var keyframes = function keyframes() {
  var insertable = css.apply(void 0, arguments);
  var name = "animation-" + insertable.name; // $FlowFixMe

  return {
    name: name,
    styles: "@keyframes " + name + "{" + insertable.styles + "}",
    anim: 1,
    toString: function toString() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
};

var classnames = function classnames(args) {
  var len = args.length;
  var i = 0;
  var cls = '';

  for (; i < len; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = getRegisteredStyles(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var ClassNames = withEmotionCache(function (props, context) {
  return React.createElement(ThemeContext.Consumer, null, function (theme) {
    var rules = '';
    var serializedHashes = '';
    var hasRendered = false;

    var css = function css() {
      if (hasRendered && process.env.NODE_ENV !== 'production') {
        throw new Error('css can only be used during render');
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var serialized = serializeStyles(args, context.registered);

      if (isBrowser$2) {
        insertStyles(context, serialized, false);
      } else {
        var res = insertStyles(context, serialized, false);

        if (res !== undefined) {
          rules += res;
        }
      }

      if (!isBrowser$2) {
        serializedHashes += " " + serialized.name;
      }

      return context.key + "-" + serialized.name;
    };

    var cx = function cx() {
      if (hasRendered && process.env.NODE_ENV !== 'production') {
        throw new Error('cx can only be used during render');
      }

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return merge(context.registered, css, classnames(args));
    };

    var content = {
      css: css,
      cx: cx,
      theme: theme
    };
    var ele = props.children(content);
    hasRendered = true;

    if (!isBrowser$2 && rules.length !== 0) {
      var _ref;

      return React.createElement(React.Fragment, null, React.createElement("style", (_ref = {}, _ref["data-emotion-" + context.key] = serializedHashes.substring(1), _ref.dangerouslySetInnerHTML = {
        __html: rules
      }, _ref.nonce = context.sheet.nonce, _ref)), ele);
    }

    return ele;
  });
});

var core_esm = /*#__PURE__*/Object.freeze({
    CacheProvider: CacheProvider,
    ClassNames: ClassNames,
    Global: Global,
    ThemeContext: ThemeContext,
    jsx: jsx,
    keyframes: keyframes,
    get withEmotionCache () { return withEmotionCache; },
    css: css
});

var interopRequireDefault = createCommonjsModule(function (module) {
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
});

unwrapExports(interopRequireDefault);

var setStatic_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = void 0;

var setStatic = function setStatic(key, value) {
  return function (BaseComponent) {
    /* eslint-disable no-param-reassign */
    BaseComponent[key] = value;
    /* eslint-enable no-param-reassign */

    return BaseComponent;
  };
};

var _default = setStatic;
exports.default = _default;
});

unwrapExports(setStatic_1);

var setDisplayName_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = void 0;

var _setStatic = interopRequireDefault(setStatic_1);

var setDisplayName = function setDisplayName(displayName) {
  return (0, _setStatic.default)('displayName', displayName);
};

var _default = setDisplayName;
exports.default = _default;
});

unwrapExports(setDisplayName_1);

var getDisplayName_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = void 0;

var getDisplayName = function getDisplayName(Component) {
  if (typeof Component === 'string') {
    return Component;
  }

  if (!Component) {
    return undefined;
  }

  return Component.displayName || Component.name || 'Component';
};

var _default = getDisplayName;
exports.default = _default;
});

unwrapExports(getDisplayName_1);

var wrapDisplayName_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = void 0;

var _getDisplayName = interopRequireDefault(getDisplayName_1);

var wrapDisplayName = function wrapDisplayName(BaseComponent, hocName) {
  return hocName + "(" + (0, _getDisplayName.default)(BaseComponent) + ")";
};

var _default = wrapDisplayName;
exports.default = _default;
});

unwrapExports(wrapDisplayName_1);

var shouldUpdate_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = interopRequireDefault(inheritsLoose);



var _setDisplayName = interopRequireDefault(setDisplayName_1);

var _wrapDisplayName = interopRequireDefault(wrapDisplayName_1);

var shouldUpdate = function shouldUpdate(test) {
  return function (BaseComponent) {
    var factory = (0, React__default.createFactory)(BaseComponent);

    var ShouldUpdate =
    /*#__PURE__*/
    function (_Component) {
      (0, _inheritsLoose2.default)(ShouldUpdate, _Component);

      function ShouldUpdate() {
        return _Component.apply(this, arguments) || this;
      }

      var _proto = ShouldUpdate.prototype;

      _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return test(this.props, nextProps);
      };

      _proto.render = function render() {
        return factory(this.props);
      };

      return ShouldUpdate;
    }(React__default.Component);

    if (process.env.NODE_ENV !== 'production') {
      return (0, _setDisplayName.default)((0, _wrapDisplayName.default)(BaseComponent, 'shouldUpdate'))(ShouldUpdate);
    }

    return ShouldUpdate;
  };
};

var _default = shouldUpdate;
exports.default = _default;
});

unwrapExports(shouldUpdate_1);

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

var hasOwnProperty$2 = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty$2.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

var shallowEqual_1 = shallowEqual;

var shallowEqual$1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = void 0;

var _shallowEqual = interopRequireDefault(shallowEqual_1);

var _default = _shallowEqual.default;
exports.default = _default;
});

unwrapExports(shallowEqual$1);

var pick_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = void 0;

var pick = function pick(obj, keys) {
  var result = {};

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

var _default = pick;
exports.default = _default;
});

unwrapExports(pick_1);

var onlyUpdateForKeys_1 = createCommonjsModule(function (module, exports) {



exports.__esModule = true;
exports.default = void 0;

var _shouldUpdate = interopRequireDefault(shouldUpdate_1);

var _shallowEqual = interopRequireDefault(shallowEqual$1);

var _setDisplayName = interopRequireDefault(setDisplayName_1);

var _wrapDisplayName = interopRequireDefault(wrapDisplayName_1);

var _pick = interopRequireDefault(pick_1);

var onlyUpdateForKeys = function onlyUpdateForKeys(propKeys) {
  var hoc = (0, _shouldUpdate.default)(function (props, nextProps) {
    return !(0, _shallowEqual.default)((0, _pick.default)(nextProps, propKeys), (0, _pick.default)(props, propKeys));
  });

  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return (0, _setDisplayName.default)((0, _wrapDisplayName.default)(BaseComponent, 'onlyUpdateForKeys'))(hoc(BaseComponent));
    };
  }

  return hoc;
};

var _default = onlyUpdateForKeys;
exports.default = _default;
});

unwrapExports(onlyUpdateForKeys_1);

var proptypes = createCommonjsModule(function (module, exports) {

(function (global, factory) {
  {
    factory(exports, PropTypes);
  }
})(void 0, function (exports, _propTypes) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.heightWidthRadiusDefaults = exports.heightWidthDefaults = exports.sizeMarginDefaults = exports.sizeDefaults = exports.heightWidthRadiusProps = exports.heightWidthProps = exports.sizeMarginProps = exports.sizeProps = exports.heightWidthRadiusKeys = exports.heightWidthKeys = exports.sizeMarginKeys = exports.sizeKeys = undefined;

  var _propTypes2 = _interopRequireDefault(_propTypes);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _common, _size, _heightWidth, _Object$assign2, _commonValues;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /*
   * List of string constants to represent different props
   */
  var LOADING = "loading";
  var COLOR = "color";
  var CSS = "css";
  var SIZE = "size";
  var SIZE_UNIT = "sizeUnit";
  var WIDTH = "width";
  var WIDTH_UNIT = "widthUnit";
  var HEIGHT = "height";
  var HEIGHT_UNIT = "heightUnit";
  var RADIUS = "radius";
  var RADIUS_UNIT = "radiusUnit";
  var MARGIN = "margin";
  /*
   * Array for onlyUpdateForKeys function
   */

  var commonStrings = [LOADING, COLOR, CSS];
  var sizeStrings = [SIZE, SIZE_UNIT];
  var heightWidthString = [HEIGHT, HEIGHT_UNIT, WIDTH, WIDTH_UNIT];
  var sizeKeys = exports.sizeKeys = commonStrings.concat(sizeStrings);
  var sizeMarginKeys = exports.sizeMarginKeys = sizeKeys.concat([MARGIN]);
  var heightWidthKeys = exports.heightWidthKeys = commonStrings.concat(heightWidthString);
  var heightWidthRadiusKeys = exports.heightWidthRadiusKeys = heightWidthKeys.concat([RADIUS, RADIUS_UNIT, MARGIN]);
  /*
   * PropType object for different loaders
   */

  var precompiledCssType = _propTypes2["default"].shape({
    name: _propTypes2["default"].string,
    styles: _propTypes2["default"].string
  });

  var common = (_common = {}, _defineProperty(_common, LOADING, _propTypes2["default"].bool), _defineProperty(_common, COLOR, _propTypes2["default"].string), _defineProperty(_common, CSS, _propTypes2["default"].oneOfType([_propTypes2["default"].string, precompiledCssType])), _common);
  var size = (_size = {}, _defineProperty(_size, SIZE, _propTypes2["default"].number), _defineProperty(_size, SIZE_UNIT, _propTypes2["default"].string), _size);
  var heightWidth = (_heightWidth = {}, _defineProperty(_heightWidth, WIDTH, _propTypes2["default"].number), _defineProperty(_heightWidth, WIDTH_UNIT, _propTypes2["default"].string), _defineProperty(_heightWidth, HEIGHT, _propTypes2["default"].number), _defineProperty(_heightWidth, HEIGHT_UNIT, _propTypes2["default"].string), _heightWidth);
  var sizeProps = exports.sizeProps = Object.assign({}, common, size);
  var sizeMarginProps = exports.sizeMarginProps = Object.assign({}, sizeProps, _defineProperty({}, MARGIN, _propTypes2["default"].string));
  var heightWidthProps = exports.heightWidthProps = Object.assign({}, common, heightWidth);
  var heightWidthRadiusProps = exports.heightWidthRadiusProps = Object.assign({}, heightWidthProps, (_Object$assign2 = {}, _defineProperty(_Object$assign2, RADIUS, _propTypes2["default"].number), _defineProperty(_Object$assign2, RADIUS_UNIT, _propTypes2["default"].string), _defineProperty(_Object$assign2, MARGIN, _propTypes2["default"].string), _Object$assign2));
  /*
   * DefaultProps object for different loaders
   */

  var commonValues = (_commonValues = {}, _defineProperty(_commonValues, LOADING, true), _defineProperty(_commonValues, COLOR, "#000000"), _defineProperty(_commonValues, CSS, {}), _commonValues);

  var heightWidthValues = function heightWidthValues(height, width) {
    var _ref;

    return _ref = {}, _defineProperty(_ref, HEIGHT, height), _defineProperty(_ref, HEIGHT_UNIT, "px"), _defineProperty(_ref, WIDTH, width), _defineProperty(_ref, WIDTH_UNIT, "px"), _ref;
  };

  var sizeValues = function sizeValues(sizeValue) {
    var _ref2;

    return _ref2 = {}, _defineProperty(_ref2, SIZE, sizeValue), _defineProperty(_ref2, SIZE_UNIT, "px"), _ref2;
  };

  var sizeDefaults = exports.sizeDefaults = function sizeDefaults(sizeValue) {
    return Object.assign({}, commonValues, sizeValues(sizeValue));
  };

  var sizeMarginDefaults = exports.sizeMarginDefaults = function sizeMarginDefaults(sizeValue) {
    return Object.assign({}, sizeDefaults(sizeValue), _defineProperty({}, MARGIN, "2px"));
  };

  var heightWidthDefaults = exports.heightWidthDefaults = function heightWidthDefaults(height, width) {
    return Object.assign({}, commonValues, heightWidthValues(height, width));
  };

  var heightWidthRadiusDefaults = exports.heightWidthRadiusDefaults = function heightWidthRadiusDefaults(height, width) {
    var _Object$assign4;

    var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
    return Object.assign({}, heightWidthDefaults(height, width), (_Object$assign4 = {}, _defineProperty(_Object$assign4, RADIUS, radius), _defineProperty(_Object$assign4, RADIUS_UNIT, "px"), _defineProperty(_Object$assign4, MARGIN, "2px"), _Object$assign4));
  };
});
});

unwrapExports(proptypes);

var helpers = createCommonjsModule(function (module, exports) {

(function (global, factory) {
  {
    factory(exports, proptypes);
  }
})(void 0, function (exports, _proptypes) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_proptypes).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _proptypes[key];
      }
    });
  });

  var calculateRgba = exports.calculateRgba = function calculateRgba(color, opacity) {
    if (color[0] === "#") {
      color = color.slice(1);
    }

    if (color.length === 3) {
      var res = "";
      color.split("").forEach(function (c) {
        res += c;
        res += c;
      });
      color = res;
    }

    var rgbValues = color.match(/.{2}/g).map(function (hex) {
      return parseInt(hex, 16);
    }).join(", ");
    return "rgba(".concat(rgbValues, ", ").concat(opacity, ")");
  };
});
});

unwrapExports(helpers);

var ScaleLoader = createCommonjsModule(function (module, exports) {

(function (global, factory) {
  {
    factory(exports, css, React__default, core_esm, onlyUpdateForKeys_1, helpers);
  }
})(void 0, function (exports, _css2, _react, _core, _onlyUpdateForKeys, _helpers) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _css3 = _interopRequireDefault(_css2);

  var _react2 = _interopRequireDefault(_react);

  var _onlyUpdateForKeys2 = _interopRequireDefault(_onlyUpdateForKeys);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _templateObject() {
    var data = _taggedTemplateLiteral(["\n  0% {transform: scaley(1.0)}\n  50% {transform: scaley(0.4)}\n  100% {transform: scaley(1.0)}\n"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  var scale = (0, _core.keyframes)(_templateObject());

  var Loader = function (_React$Component) {
    _inherits(Loader, _React$Component);

    function Loader() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Loader);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Loader)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "style", function (i) {
        var _this$props = _this.props,
            color = _this$props.color,
            width = _this$props.width,
            height = _this$props.height,
            margin = _this$props.margin,
            radius = _this$props.radius,
            widthUnit = _this$props.widthUnit,
            heightUnit = _this$props.heightUnit,
            radiusUnit = _this$props.radiusUnit;
        return (0, _core.css)("background-color:", color, ";width:", "".concat(width).concat(widthUnit), ";height:", "".concat(height).concat(heightUnit), ";margin:", margin, ";border-radius:", "".concat(radius).concat(radiusUnit), ";display:inline-block;animation:", scale, " 1s ", i * 0.1, "s infinite cubic-bezier(0.2,0.68,0.18,1.08);animation-fill-mode:both;label:style;" + (process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9TY2FsZUxvYWRlci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBb0JjIiwiZmlsZSI6InNyYy9TY2FsZUxvYWRlci5qc3giLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBqc3ggKi9cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGtleWZyYW1lcywgY3NzLCBqc3ggfSBmcm9tIFwiQGVtb3Rpb24vY29yZVwiO1xuaW1wb3J0IG9ubHlVcGRhdGVGb3JLZXlzIGZyb20gXCJyZWNvbXBvc2Uvb25seVVwZGF0ZUZvcktleXNcIjtcbmltcG9ydCB7XG4gIGhlaWdodFdpZHRoUmFkaXVzUHJvcHMsXG4gIGhlaWdodFdpZHRoUmFkaXVzRGVmYXVsdHMsXG4gIGhlaWdodFdpZHRoUmFkaXVzS2V5c1xufSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IHNjYWxlID0ga2V5ZnJhbWVzYFxuICAwJSB7dHJhbnNmb3JtOiBzY2FsZXkoMS4wKX1cbiAgNTAlIHt0cmFuc2Zvcm06IHNjYWxleSgwLjQpfVxuICAxMDAlIHt0cmFuc2Zvcm06IHNjYWxleSgxLjApfVxuYDtcblxuY2xhc3MgTG9hZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3R5bGUgPSAoaSkgPT4ge1xuICAgIGNvbnN0IHsgY29sb3IsIHdpZHRoLCBoZWlnaHQsIG1hcmdpbiwgcmFkaXVzLCB3aWR0aFVuaXQsIGhlaWdodFVuaXQsIHJhZGl1c1VuaXQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gY3NzYFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07XG4gICAgICB3aWR0aDogJHtgJHt3aWR0aH0ke3dpZHRoVW5pdH1gfTtcbiAgICAgIGhlaWdodDogJHtgJHtoZWlnaHR9JHtoZWlnaHRVbml0fWB9O1xuICAgICAgbWFyZ2luOiAke21hcmdpbn07XG4gICAgICBib3JkZXItcmFkaXVzOiAke2Ake3JhZGl1c30ke3JhZGl1c1VuaXR9YH07XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICBhbmltYXRpb246ICR7c2NhbGV9IDFzICR7aSAqIDAuMX1zIGluZmluaXRlIGN1YmljLWJlemllcigwLjIsIDAuNjgsIDAuMTgsIDEuMDgpO1xuICAgICAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcbiAgICBgO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGxvYWRpbmcsIGNzcyB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBsb2FkaW5nID8gKFxuICAgICAgPGRpdiBjc3M9e1tjc3NdfT5cbiAgICAgICAgPGRpdiBjc3M9e3RoaXMuc3R5bGUoMSl9IC8+XG4gICAgICAgIDxkaXYgY3NzPXt0aGlzLnN0eWxlKDIpfSAvPlxuICAgICAgICA8ZGl2IGNzcz17dGhpcy5zdHlsZSgzKX0gLz5cbiAgICAgICAgPGRpdiBjc3M9e3RoaXMuc3R5bGUoNCl9IC8+XG4gICAgICAgIDxkaXYgY3NzPXt0aGlzLnN0eWxlKDUpfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKSA6IG51bGw7XG4gIH1cbn1cblxuTG9hZGVyLnByb3BUeXBlcyA9IGhlaWdodFdpZHRoUmFkaXVzUHJvcHM7XG5cbkxvYWRlci5kZWZhdWx0UHJvcHMgPSBoZWlnaHRXaWR0aFJhZGl1c0RlZmF1bHRzKDM1LCA0LCAyKTtcblxuY29uc3QgQ29tcG9uZW50ID0gb25seVVwZGF0ZUZvcktleXMoaGVpZ2h0V2lkdGhSYWRpdXNLZXlzKShMb2FkZXIpO1xuQ29tcG9uZW50LmRlZmF1bHRQcm9wcyA9IExvYWRlci5kZWZhdWx0UHJvcHM7XG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7XG4iXX0= */"));
      });

      return _this;
    }

    _createClass(Loader, [{
      key: "render",
      value: function render() {
        var _this$props2 = this.props,
            loading = _this$props2.loading,
            css = _this$props2.css;
        return loading ? (0, _core.jsx)("div", {
          css: (0, _css3["default"])([css], "label:Loader;" + (process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9TY2FsZUxvYWRlci5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBb0NXIiwiZmlsZSI6InNyYy9TY2FsZUxvYWRlci5qc3giLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBqc3ggKi9cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGtleWZyYW1lcywgY3NzLCBqc3ggfSBmcm9tIFwiQGVtb3Rpb24vY29yZVwiO1xuaW1wb3J0IG9ubHlVcGRhdGVGb3JLZXlzIGZyb20gXCJyZWNvbXBvc2Uvb25seVVwZGF0ZUZvcktleXNcIjtcbmltcG9ydCB7XG4gIGhlaWdodFdpZHRoUmFkaXVzUHJvcHMsXG4gIGhlaWdodFdpZHRoUmFkaXVzRGVmYXVsdHMsXG4gIGhlaWdodFdpZHRoUmFkaXVzS2V5c1xufSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmNvbnN0IHNjYWxlID0ga2V5ZnJhbWVzYFxuICAwJSB7dHJhbnNmb3JtOiBzY2FsZXkoMS4wKX1cbiAgNTAlIHt0cmFuc2Zvcm06IHNjYWxleSgwLjQpfVxuICAxMDAlIHt0cmFuc2Zvcm06IHNjYWxleSgxLjApfVxuYDtcblxuY2xhc3MgTG9hZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3R5bGUgPSAoaSkgPT4ge1xuICAgIGNvbnN0IHsgY29sb3IsIHdpZHRoLCBoZWlnaHQsIG1hcmdpbiwgcmFkaXVzLCB3aWR0aFVuaXQsIGhlaWdodFVuaXQsIHJhZGl1c1VuaXQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gY3NzYFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07XG4gICAgICB3aWR0aDogJHtgJHt3aWR0aH0ke3dpZHRoVW5pdH1gfTtcbiAgICAgIGhlaWdodDogJHtgJHtoZWlnaHR9JHtoZWlnaHRVbml0fWB9O1xuICAgICAgbWFyZ2luOiAke21hcmdpbn07XG4gICAgICBib3JkZXItcmFkaXVzOiAke2Ake3JhZGl1c30ke3JhZGl1c1VuaXR9YH07XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICBhbmltYXRpb246ICR7c2NhbGV9IDFzICR7aSAqIDAuMX1zIGluZmluaXRlIGN1YmljLWJlemllcigwLjIsIDAuNjgsIDAuMTgsIDEuMDgpO1xuICAgICAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYm90aDtcbiAgICBgO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGxvYWRpbmcsIGNzcyB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBsb2FkaW5nID8gKFxuICAgICAgPGRpdiBjc3M9e1tjc3NdfT5cbiAgICAgICAgPGRpdiBjc3M9e3RoaXMuc3R5bGUoMSl9IC8+XG4gICAgICAgIDxkaXYgY3NzPXt0aGlzLnN0eWxlKDIpfSAvPlxuICAgICAgICA8ZGl2IGNzcz17dGhpcy5zdHlsZSgzKX0gLz5cbiAgICAgICAgPGRpdiBjc3M9e3RoaXMuc3R5bGUoNCl9IC8+XG4gICAgICAgIDxkaXYgY3NzPXt0aGlzLnN0eWxlKDUpfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKSA6IG51bGw7XG4gIH1cbn1cblxuTG9hZGVyLnByb3BUeXBlcyA9IGhlaWdodFdpZHRoUmFkaXVzUHJvcHM7XG5cbkxvYWRlci5kZWZhdWx0UHJvcHMgPSBoZWlnaHRXaWR0aFJhZGl1c0RlZmF1bHRzKDM1LCA0LCAyKTtcblxuY29uc3QgQ29tcG9uZW50ID0gb25seVVwZGF0ZUZvcktleXMoaGVpZ2h0V2lkdGhSYWRpdXNLZXlzKShMb2FkZXIpO1xuQ29tcG9uZW50LmRlZmF1bHRQcm9wcyA9IExvYWRlci5kZWZhdWx0UHJvcHM7XG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7XG4iXX0= */"))
        }, (0, _core.jsx)("div", {
          css: this.style(1)
        }), (0, _core.jsx)("div", {
          css: this.style(2)
        }), (0, _core.jsx)("div", {
          css: this.style(3)
        }), (0, _core.jsx)("div", {
          css: this.style(4)
        }), (0, _core.jsx)("div", {
          css: this.style(5)
        })) : null;
      }
    }]);

    return Loader;
  }(_react2["default"].Component);

  Loader.propTypes = _helpers.heightWidthRadiusProps;
  Loader.defaultProps = (0, _helpers.heightWidthRadiusDefaults)(35, 4, 2);
  var Component = (0, _onlyUpdateForKeys2["default"])(_helpers.heightWidthRadiusKeys)(Loader);
  Component.defaultProps = Loader.defaultProps;
  exports["default"] = Component;
});
});

var ScaleLoader$1 = unwrapExports(ScaleLoader);

const loaderContainerStyle = {
  textAlign: 'center',
  justifyContent: 'center'
};

class LoaderView extends React__default.Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  stateChange() {}

  componentDidUpdate() {}

  componentWillReceiveProps() {}

  render() {
    const {
      clients
    } = this.props;
    const {
      hasConnection
    } = clients[0]; // alert(hasConnection);

    return React__default.createElement("div", {
      className: "loader",
      style: loaderContainerStyle
    }, React__default.createElement(ScaleLoader$1, {
      sizeUnit: 'px',
      size: 50,
      color: '#636973',
      loading: !hasConnection
    }));
  }

}

LoaderView.propTypes = {
  clients: PropTypes.any.isRequired,
  store: PropTypes.any
};

const mapStateToProps$i = ({
  clientReducer
}) => {
  const {
    clients
  } = clientReducer;
  return {
    clients
  };
};

var LoaderView$1 = reactRedux.connect(mapStateToProps$i)(LoaderView);

class View {
  constructor(store) {
    this.Accounts = [];
    this.coinbase = null;
    this.store = store;
    this.helpers = new Web3Helpers(this.store);
  }

  async createCoinbaseView() {
    try {
      await this.helpers.getAccounts();
      ReactDOM.render(React__default.createElement(CoinbaseView$1, {
        store: this.store,
        helpers: this.helpers
      }), document.getElementById('accounts-list'));
    } catch (e) {
      console.log(e);
      this.helpers.showPanelError('No account exists! Please create one.');
      this.store.dispatch({
        type: SET_ACCOUNTS,
        payload: []
      });
      this.store.dispatch({
        type: SET_COINBASE,
        payload: '0x00'
      });
      ReactDOM.render(React__default.createElement(CoinbaseView$1, {
        store: this.store,
        helpers: this.helpers
      }), document.getElementById('accounts-list'));
      throw e;
    }
  }

  createButtonsView() {
    ReactDOM.render(React__default.createElement("div", null, React__default.createElement(CompileBtn$1, {
      store: this.store
    }), React__default.createElement("label", {
      style: {
        marginTop: '5px'
      }
    }, React__default.createElement("b", null, "Ctrl-S"), " to save and compile")), document.getElementById('compile_btn'));
  }

  createTabView() {
    ReactDOM.render(React__default.createElement(TabView$1, {
      store: this.store,
      helpers: this.helpers
    }), document.getElementById('tab_view'));
  }

  createVersionSelector() {
    ReactDOM.render(React__default.createElement(VersionSelector$1, {
      store: this.store
    }), document.getElementById('version_selector'));
  }

  createLoaderView() {
    ReactDOM.render(React__default.createElement(LoaderView$1, {
      store: this.store
    }), document.getElementById('loader'));
  }

  createTextareaR(text) {
    var textNode;
    this.text = text;
    textNode = document.createElement('pre');
    textNode.textContent = this.text;
    textNode.classList.add('large-code');
    return textNode;
  }

}

class Web3Env {
  constructor(store) {
    this.subscriptions = new atom$1.CompositeDisposable();
    this.web3Subscriptions = new atom$1.CompositeDisposable();
    this.saveSubscriptions = new atom$1.CompositeDisposable();
    this.compileSubscriptions = new atom$1.CompositeDisposable(); // binding local functions

    this.checkReduxState = this.checkReduxState.bind(this);
    this.subscribeToWeb3Commands = this.subscribeToWeb3Commands.bind(this);
    this.subscribeToWeb3Events = this.subscribeToWeb3Events.bind(this);
    this.store = store;
    this.helpers = new Web3Helpers(this.store);
    this.havConnection = this.store.getState().clientReducer.clients[0].hasConnection; // Subscribing the redux state

    this.store.subscribe(this.checkReduxState); // subscribe to transaction through helpers

    this.helpers.subscribeTransaction(); // subscribe to eth connection through helpers

    this.helpers.subscribeETHconnection();
    this.subscribeToWeb3Commands();
    this.subscribeToWeb3Events();
    this.helpers.checkConnection();
  }

  checkReduxState() {
    this.havConnection = this.store.getState().clientReducer.clients[0].hasConnection;
    let firstCheck = this.store.getState().clientReducer.clients[0].firstTimeCheck;

    if (this.havConnection && firstCheck) {
      this.subscribeToWeb3Events();
    }
  }

  dispose() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }

    this.subscriptions = null;

    if (this.saveSubscriptions) {
      this.saveSubscriptions.dispose();
    }

    this.saveSubscriptions = null;

    if (this.web3Subscriptions) {
      this.web3Subscriptions.dispose();
    }

    this.web3Subscriptions = null;
  }

  destroy() {
    if (this.saveSubscriptions) {
      this.saveSubscriptions.dispose();
    }

    this.saveSubscriptions = null;

    if (this.compileSubscriptions) {
      this.compileSubscriptions.dispose();
    }

    this.compileSubscriptions = null;

    if (this.web3Subscriptions) {
      this.web3Subscriptions.dispose();
    }

    this.web3Subscriptions = null;
  } // Subscriptions


  subscribeToWeb3Commands() {
    if (!this.web3Subscriptions) {
      return;
    }

    this.web3Subscriptions.add(atom.commands.add('atom-workspace', 'eth-interface:compile', () => {
      if (this.compileSubscriptions) {
        this.compileSubscriptions.dispose();
      }

      this.compileSubscriptions = new atom$1.CompositeDisposable();
      this.subscribeToCompileEvents();
    }));
  }

  async subscribeToWeb3Events() {
    if (!this.web3Subscriptions) {
      return;
    }

    const state = this.store.getState();
    const {
      clients
    } = state.clientReducer;
    const client = clients[0];
    this.view = new View(this.store);
    console.log(client);

    if (!client.hasConnection) {
      this.view.createLoaderView();
      this.view.createButtonsView();
      this.view.createTabView();
      this.view.createVersionSelector();
    } else if (client.hasConnection) {
      this.view.createCoinbaseView();
      this.view.createButtonsView();
      this.view.createTabView();
      this.view.createVersionSelector();
    }

    this.web3Subscriptions.add(atom.workspace.observeTextEditors(editor => {
      if (!editor || !editor.getBuffer()) {
        return;
      }

      this.web3Subscriptions.add(atom.config.observe('etheratom.compileOnSave', compileOnSave => {
        if (this.saveSubscriptions) {
          this.saveSubscriptions.dispose();
        }

        this.saveSubscriptions = new atom$1.CompositeDisposable();

        if (compileOnSave) {
          this.subscribeToSaveEvents();
        }
      }));
    }));
  } // Event subscriptions


  subscribeToSaveEvents() {
    if (!this.web3Subscriptions) {
      return;
    }

    this.saveSubscriptions.add(atom.workspace.observeTextEditors(editor => {
      if (!editor || !editor.getBuffer()) {
        return;
      }

      const bufferSubscriptions = new atom$1.CompositeDisposable();
      bufferSubscriptions.add(editor.getBuffer().onDidSave(filePath => {
        this.setSources(editor);
      }));
      bufferSubscriptions.add(editor.getBuffer().onDidDestroy(() => {
        bufferSubscriptions.dispose();
      }));
      this.saveSubscriptions.add(bufferSubscriptions);
    }));
  }

  subscribeToCompileEvents() {
    if (!this.web3Subscriptions) {
      return;
    }

    this.compileSubscriptions.add(atom.workspace.observeActiveTextEditor(editor => {
      if (!editor || !editor.getBuffer()) {
        return;
      }

      this.compile(editor);
    }));
  } // common functions


  async setSources(editor) {
    const filePath = editor.getPath();
    const filename = filePath.replace(/^.*[\\/]/, '');
    const regexSol = /([a-zA-Z0-9\s_\\.\-\(\):])+(.sol|.solidity)$/g;
    const regexVyp = /([a-zA-Z0-9\s_\\.\-\(\):])+(.vy|.v.py|.vyper.py)$/g;

    if (filePath.match(regexSol) || filePath.match(regexVyp)) {
      try {
        const dir = path.dirname(filePath);
        var sources = {};
        sources[filename] = {
          content: editor.getText()
        };
        sources = await combineSource(dir, sources);
        this.store.dispatch({
          type: SET_SOURCES,
          payload: sources
        });
      } catch (e) {
        console.error(e);
        showPanelError(e);
      }
    } else {
      const err = new Error('file type is not recognized as solidity or vyper file');
      console.error(err);
      showPanelError(err);
    }
  }

  async compile(editor) {
    const filePath = editor.getPath();
    const regexVyp = /([a-zA-Z0-9\s_\\.\-\(\):])+(.vy|.v.py|.vyper.py)$/g;
    const regexSol = /([a-zA-Z0-9\s_\\.\-\(\):])+(.sol|.solidity)$/g; // Reset redux store
    // this.store.dispatch({ type: SET_COMPILED, payload: null });

    this.store.dispatch({
      type: RESET_COMPILED
    });
    this.store.dispatch({
      type: SET_ERRORS,
      payload: []
    });
    this.store.dispatch({
      type: SET_EVENTS,
      payload: []
    });

    if (filePath.match(regexSol)) {
      console.log('%c Compiling contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
      this.store.dispatch({
        type: SET_COMPILING,
        payload: true
      });

      try {
        const state = this.store.getState();
        const {
          sources
        } = state.files;
        delete sources['remix_tests.sol'];
        delete sources['tests.sol']; // TODO: delete _test files

        for (let filename in sources) {
          if (/^(.+)(_test.sol)/g.test(filename)) {
            delete sources[filename];
          }
        }

        this.helpers.compileWeb3(sources);
        await this.helpers.getGasLimit();
      } catch (e) {
        console.error(e);
        showPanelError(e);
      }
    } else if (filePath.match(regexVyp)) {
      console.log('%c Compiling contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
      this.store.dispatch({
        type: SET_COMPILING,
        payload: true
      });

      try {
        const state = this.store.getState();
        const {
          sources
        } = state.files;
        this.helpers.compileVyper(sources);
      } catch (e) {
        console.error(e);
        showPanelError(e);
      }
    } else {
      const err = new Error('file type is not recognized as solidity or vyper file');
      console.error(err);
      showPanelError(err);
      return;
    }
  }

}

const INITIAL_STATE = {
  sources: {}
};
var FilesReducer = ((state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SOURCES:
      return _objectSpread({}, state, {
        sources: action.payload
      });

    case RESET_SOURCES:
      return _objectSpread({}, INITIAL_STATE);

    default:
      return state;
  }
});

const INITIAL_STATE$1 = {
  compiled: null,
  compiling: false,
  deployed: false,
  interfaces: null,
  contracts: null,
  instances: null,
  gasLimit: 0,
  gasEstimate: 90000
};
var ContractReducer = ((state = INITIAL_STATE$1, action) => {
  switch (action.type) {
    case SET_SOURCES:
      return _objectSpread({}, state, {
        sources: action.payload
      });

    case SET_COMPILING:
      return _objectSpread({}, state, {
        compiling: action.payload
      });

    case SET_DEPLOYED:
      return _objectSpread({}, state, {
        deployed: _objectSpread({}, state.deployed, {
          [action.payload.contractName]: action.payload.deployed
        })
      });

    case SET_COMPILED:
      return _objectSpread({}, state, {
        compiled: action.payload
      });

    case RESET_CONTRACTS:
      return _objectSpread({}, INITIAL_STATE$1);

    case RESET_COMPILED:
      return _objectSpread({}, state, {
        compiled: null,
        deployed: false,
        interfaces: null,
        instances: null
      });

    case SET_INSTANCE:
      return _objectSpread({}, state, {
        instances: _objectSpread({}, state.instances, {
          [action.payload.contractName]: action.payload.instance
        })
      });

    case SET_PARAMS:
      return _objectSpread({}, state, {
        interfaces: _objectSpread({}, state.interfaces, {
          [action.payload.contractName]: {
            interface: action.payload.interface
          }
        })
      });

    case ADD_INTERFACE:
      return _objectSpread({}, state, {
        interfaces: _objectSpread({}, state.interfaces, {
          [action.payload.contractName]: {
            interface: action.payload.interface
          }
        })
      });

    case UPDATE_INTERFACE:
      return _objectSpread({}, state, {
        interfaces: _objectSpread({}, state.interfaces, {
          [action.payload.contractName]: {
            interface: action.payload.interface
          }
        })
      });

    case UPDATE_OPTIONS:
      // We want to access contracts like following:
      // contracts[myContract].options, contracts[myContract].methods, contracts[myContract].events
      return _objectSpread({}, state, {
        contracts: _objectSpread({}, state.contracts, {
          [action.payload.contractName]: {
            options: action.payload.options,
            transactionHash: state.contracts && state.contracts[action.payload.contractName] ? state.contracts[action.payload.contractName].transactionHash : null
          }
        })
      });

    case ADD_TX_HASH:
      return _objectSpread({}, state, {
        contracts: _objectSpread({}, state.contracts, {
          [action.payload.contractName]: {
            transactionHash: action.payload.transactionHash,
            options: state.contracts[action.payload.contractName].options
          }
        })
      });

    case SET_GAS_LIMIT:
      return _objectSpread({}, state, {
        gasLimit: action.payload
      });

    case SET_GAS_ESTIMATE:
      return _objectSpread({}, state, {
        gasEstimate: action.payload.gasEstimate
      });

    default:
      return state;
  }
});

const INITIAL_STATE$2 = {
  coinbase: '',
  password: false,
  accounts: [],
  balance: 0.00
};
var AccountReducer = ((state = INITIAL_STATE$2, action) => {
  switch (action.type) {
    case SET_COINBASE:
      return _objectSpread({}, state, {
        coinbase: action.payload
      });

    case SET_PASSWORD:
      return _objectSpread({}, state, {
        password: action.payload.password
      });

    case SET_ACCOUNTS:
      return _objectSpread({}, state, {
        accounts: action.payload
      });

    case SET_BALANCE:
      return _objectSpread({}, state, {
        balance: action.payload
      });

    default:
      return state;
  }
});

const INITIAL_STATE$3 = {
  errormsg: []
};
var ErrorReducer = ((state = INITIAL_STATE$3, action) => {
  switch (action.type) {
    case SET_ERRORS:
      return _objectSpread({}, state, {
        errormsg: action.payload
      });

    case RESET_ERRORS:
      return _objectSpread({}, INITIAL_STATE$3);

    default:
      return state;
  }
});

const INITIAL_STATE$4 = {
  pendingTransactions: [],
  events: [],
  txAnalysis: {}
};
var EventReducer = ((state = INITIAL_STATE$4, action) => {
  switch (action.type) {
    case ADD_PENDING_TRANSACTION:
      return _objectSpread({}, state, {
        pendingTransactions: [...state.pendingTransactions, action.payload]
      });

    case ADD_EVENTS:
      return _objectSpread({}, state, {
        events: [...state.events, action.payload]
      });

    case SET_EVENTS:
      return _objectSpread({}, state, {
        events: []
      });

    case TEXT_ANALYSIS:
      return _objectSpread({}, state, {
        txAnalysis: action.payload
      });

    default:
      return state;
  }
});

const INITIAL_STATE$5 = {
  clients: [{
    provider: 'web3',
    desc: 'Backend ethereum node',
    hasConnection: false,
    firstTimeCheck: true,
    isWsProvider: false,
    isHttpProvider: false
  }]
};
var ClientReducer = ((state = INITIAL_STATE$5, action) => {
  switch (action.type) {
    case SET_CONNECTION_STATUS:
      return _objectSpread({}, state, {
        clients: action.payload
      });

    case FIRST_TIME_CHECK_ENABLE:
      // TODO: modify only one key:value
      return _objectSpread({}, state, {
        clients: action.payload
      });

    case IS_WS_PROVIDER:
      return _objectSpread({}, state, {
        clients: action.payload
      });

    case IS_HTTP_PROVIDER:
      return _objectSpread({}, state, {
        clients: action.payload
      });

    default:
      return state;
  }
});

const INITIAL_STATE$6 = {
  syncing: false,
  status: {},
  mining: false,
  hashRate: 0
};
var NodeReducer = ((state = INITIAL_STATE$6, action) => {
  switch (action.type) {
    case SET_SYNCING:
      return _objectSpread({}, state, {
        syncing: action.payload
      });

    case SET_SYNC_STATUS:
      return _objectSpread({}, state, {
        status: action.payload
      });

    case SET_MINING:
      return _objectSpread({}, state, {
        mining: action.payload
      });

    case SET_HASH_RATE:
      return _objectSpread({}, state, {
        hashRate: action.payload
      });

    default:
      return state;
  }
});

var etheratomReducers = redux.combineReducers({
  files: FilesReducer,
  contract: ContractReducer,
  account: AccountReducer,
  errors: ErrorReducer,
  eventReducer: EventReducer,
  clientReducer: ClientReducer,
  node: NodeReducer
});

function configureStore(initialState) {
  const middleWares = [ReduxThunk];

  if (atom.inDevMode()) {
    middleWares.push(logger);
  }

  const store = redux.createStore(etheratomReducers, initialState, redux.applyMiddleware(...middleWares));
  return store;
}

class Etheratom {
  constructor(props) {
    this.subscriptions = new atom$1.CompositeDisposable();
    this.atomSolidityView = new AtomSolidityView();
    this.modalPanel = null;
    this.loaded = false;
    this.store = configureStore();
  }

  activate() {
    require('atom-package-deps').install('etheratom', true).then(function () {
      console.log('All dependencies installed, good to go');
    });

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'eth-interface:toggle': (_this => {
        return function () {
          _this.toggleView();
        };
      })(this),
      'eth-interface:activate': (_this => {
        return function () {
          _this.toggleView();
        };
      })(this)
    }));
    this.modalPanel = atom.workspace.addRightPanel({
      item: this.atomSolidityView.getElement(),
      visible: false
    }); // Initiate env

    this.load();
  }

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomSolidityView.destroy();
  }

  load() {
    this.loadWeb3();
    this.loaded = true;
  }

  loadWeb3() {
    if (this.Web3Interface) {
      return this.Web3Interface;
    }

    this.Web3Interface = new Web3Env(this.store);
    this.subscriptions.add(this.Web3Interface);
    return this.Web3Interface;
  }

  toggleView() {
    if (this.modalPanel.isVisible()) {
      return this.modalPanel.hide();
    } else {
      return this.modalPanel.show();
    }
  }

}

module.exports = new Etheratom({
  config: atom.config,
  workspace: atom.workspace
});
