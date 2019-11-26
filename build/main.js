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
var React = _interopDefault(require('react'));
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
var reactSpinners = require('react-spinners');
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
        console.log('Got txHash');
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

class GasInput extends React.Component {
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
    return React.createElement("form", {
      className: "gas-estimate-form"
    }, React.createElement("button", {
      className: "input text-subtle"
    }, "Gas supply"), React.createElement("input", {
      id: contractName + '_gas',
      type: "number",
      className: "inputs",
      value: this.state.gas,
      onChange: this.props.onChange
    }), React.createElement("button", {
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

class InputsForm extends React.Component {
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
    return React.createElement("div", {
      id: contractName + '_inputs'
    }, abi.type === 'constructor' && abi.inputs.map((input, i) => {
      return React.createElement("form", {
        key: i,
        onSubmit: this.props.onSubmit
      }, React.createElement("button", {
        className: "input text-subtle"
      }, input.name), React.createElement("input", {
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

class CreateButton extends React.Component {
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
    return React.createElement("form", {
      onSubmit: this._handleSubmit,
      className: "padded"
    }, React.createElement("input", {
      type: "submit",
      value: "Deploy to blockchain",
      ref: contractName,
      className: "btn btn-primary inline-block-tight"
    }), React.createElement("input", {
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

class ContractCompiled extends React.Component {
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
    return React.createElement("div", {
      className: "contract-content",
      key: index
    }, React.createElement("span", {
      className: "contract-name inline-block highlight-success"
    }, contractName), React.createElement("div", {
      className: "byte-code"
    }, React.createElement("pre", {
      className: "large-code"
    }, JSON.stringify(bytecode))), React.createElement("div", {
      className: "abi-definition"
    }, React.createElement(reactTabs.Tabs, null, React.createElement(reactTabs.TabList, null, React.createElement("div", {
      className: "tab_btns"
    }, React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn"
    }, "Interface")), React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn"
    }, "Interface Object")), React.createElement("button", {
      className: "btn icon icon-desktop-download inline-block-tight icon-button",
      title: 'Save ' + savePath,
      onClick: this._saveABI
    }))), React.createElement(reactTabs.TabPanel, null, React.createElement("pre", {
      className: "large-code"
    }, JSON.stringify(ContractABI))), React.createElement(reactTabs.TabPanel, null, React.createElement(ReactJson, {
      src: ContractABI,
      theme: "chalk",
      displayDataTypes: false,
      name: false,
      collapsed: 2,
      collapseStringsAfterLength: 32,
      iconStyle: "triangle"
    })))), ContractABI.map((abi, i) => {
      return React.createElement(InputsForm$1, {
        key: i,
        contractName: contractName,
        abi: abi,
        onSubmit: this._handleInput
      });
    }), React.createElement(GasInput$1, {
      contractName: contractName,
      gas: estimatedGas,
      onChange: this._handleGasChange
    }), React.createElement(CreateButton$1, {
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

class FunctionABI extends React.Component {
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
    return React.createElement("div", {
      className: "abi-container"
    }, ContractABI.map((abi, i) => {
      if (abi.type === 'function') {
        return React.createElement("div", {
          key: i,
          className: "function-container"
        }, React.createElement("form", {
          key: i,
          onSubmit: () => this._handleSubmit(abi)
        }, React.createElement("input", {
          key: i,
          type: "submit",
          value: abi.name,
          className: "text-subtle call-button"
        }), abi.inputs.map((input, j) => {
          return React.createElement("input", {
            type: "text",
            className: "call-button-values",
            placeholder: input.name + ' ' + input.type,
            value: input.value,
            onChange: event => this._handleChange(i, j, event),
            key: j
          });
        }), abi.payable === true && React.createElement("input", {
          className: "call-button-values",
          type: "number",
          placeholder: "payable value in wei",
          onChange: event => this._handlePayableValue(abi, event)
        })));
      }

      if (abi.type === 'fallback') {
        return React.createElement("div", {
          className: "fallback-container"
        }, React.createElement("form", {
          key: i,
          onSubmit: () => {
            this._handleFallback(abi);
          }
        }, React.createElement("button", {
          className: "btn"
        }, "fallback"), abi.payable === true && React.createElement("input", {
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

class ContractExecution extends React.Component {
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
    return React.createElement("div", {
      className: "contract-content",
      key: index
    }, React.createElement("span", {
      className: "contract-name inline-block highlight-success"
    }, contractName), React.createElement("div", {
      className: "byte-code"
    }, React.createElement("pre", {
      className: "large-code"
    }, JSON.stringify(bytecode))), React.createElement("div", {
      className: "abi-definition"
    }, React.createElement(reactTabs.Tabs, null, React.createElement(reactTabs.TabList, null, React.createElement("div", {
      className: "tab_btns"
    }, React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn"
    }, "Interface")), React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn"
    }, "Interface Object")))), React.createElement(reactTabs.TabPanel, null, React.createElement("pre", {
      className: "large-code"
    }, JSON.stringify(ContractABI))), React.createElement(reactTabs.TabPanel, null, React.createElement(ReactJson, {
      src: ContractABI,
      theme: "ocean",
      displayDataTypes: false,
      name: false,
      collapsed: 2
    })))), transactionHash && React.createElement("div", {
      id: contractName + '_txHash'
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Transaction hash:"), React.createElement("pre", {
      className: "large-code"
    }, transactionHash)), !contractOptions.address && React.createElement("div", {
      id: contractName + '_stat'
    }, React.createElement("span", {
      className: "stat-mining stat-mining-align"
    }, "waiting to be mined"), React.createElement("span", {
      className: "loading loading-spinner-tiny inline-block stat-mining-align"
    })), contractOptions.address && React.createElement("div", {
      id: contractName + '_stat'
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Mined at:"), React.createElement("pre", {
      className: "large-code"
    }, contractOptions.address)), ContractABI.map((abi, i) => {
      return React.createElement(InputsForm$1, {
        contractName: contractName,
        abi: abi,
        key: i
      });
    }), React.createElement(FunctionABI$1, {
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

class ErrorView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      errormsg
    } = this.props;
    return React.createElement("ul", {
      className: "error-list block"
    }, errormsg.length > 0 && errormsg.map((msg, i) => {
      return React.createElement("li", {
        key: i,
        className: "list-item"
      }, msg.severity === 'warning' && React.createElement("span", {
        className: "icon icon-alert text-warning"
      }, msg.formattedMessage || msg.message), msg.severity === 'error' && React.createElement("span", {
        className: "icon icon-bug text-error"
      }, msg.formattedMessage || msg.message), !msg.severity && React.createElement("span", {
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

class CollapsedFile extends React.Component {
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
    return React.createElement("div", null, React.createElement("label", {
      className: "label file-collapse-label"
    }, React.createElement("h4", {
      className: "text-success"
    }, fileName), React.createElement("div", null, React.createElement("button", {
      className: toggleBtnStyle,
      onClick: this._toggleCollapse
    }, toggleBtnTxt))), React.createElement(reactCollapse.Collapse, {
      isOpened: isOpened
    }, Object.keys(compiled.contracts[fileName]).map((contractName, index) => {
      const bytecode = compiled.contracts[fileName][contractName].evm.bytecode.object;
      return React.createElement("div", {
        id: contractName,
        className: "contract-container",
        key: index
      }, !deployed[contractName] && interfaces !== null && interfaces[contractName] && compiling === false && React.createElement(ContractCompiled$1, {
        contractName: contractName,
        fileName: fileName,
        bytecode: bytecode,
        index: index,
        helpers: this.helpers
      }), deployed[contractName] && React.createElement(ContractExecution$1, {
        contractName: contractName,
        bytecode: bytecode,
        index: index,
        helpers: this.helpers
      }));
    })));
  }

}

class Contracts extends React.Component {
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
    return React.createElement(reactRedux.Provider, {
      store: this.props.store
    }, React.createElement("div", {
      id: "compiled-code",
      className: "compiled-code"
    }, compiled && compiled.contracts && Object.keys(compiled.contracts).map((fileName, index) => {
      return React.createElement(CollapsedFile, {
        fileName: fileName,
        compiled: compiled,
        deployed: deployed,
        compiling: compiling,
        interfaces: interfaces,
        helpers: this.helpers,
        key: index
      });
    }), !compiled && React.createElement("h2", {
      className: "text-warning no-header"
    }, "No compiled contract!"), React.createElement("div", {
      id: "compiled-error",
      className: "error-container"
    }, React.createElement(ErrorView$1, null))));
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

class TxAnalyzer extends React.Component {
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
    return React.createElement("div", {
      className: "tx-analyzer"
    }, React.createElement("div", {
      className: "flex-row"
    }, React.createElement("form", {
      className: "flex-row",
      onSubmit: this._handleTxHashSubmit
    }, React.createElement("div", {
      className: "inline-block"
    }, React.createElement("input", {
      type: "text",
      name: "txhash",
      value: this.state.txHash,
      onChange: this._handleTxHashChange,
      placeholder: "Transaction hash",
      className: "input-search"
    })), React.createElement("div", {
      className: "inline-block"
    }, React.createElement("input", {
      type: "submit",
      value: "Analyze",
      className: "btn"
    }))), React.createElement("button", {
      className: toggleBtnStyle,
      onClick: this._toggleCollapse
    }, "Transaction List")), React.createElement(reactCollapse.Collapse, {
      isOpened: isOpened
    }, transactions.length > 0 && React.createElement(VirtualList, {
      itemCount: transactions.length,
      itemSize: 30,
      class: "tx-list-container",
      overscanCount: 10,
      renderItem: ({
        index
      }) => React.createElement("div", {
        className: "tx-list-item"
      }, React.createElement("span", {
        className: "padded text-warning"
      }, transactions[index]))
    })), txAnalysis && txAnalysis.transaction && React.createElement("div", {
      className: "block"
    }, React.createElement("h2", {
      className: "block highlight-info tx-header"
    }, "Transaction"), React.createElement(ReactJson, {
      src: txAnalysis.transaction,
      theme: "chalk",
      displayDataTypes: false,
      name: false,
      collapseStringsAfterLength: 64,
      iconStyle: "triangle"
    })), txAnalysis && txAnalysis.transactionRecipt && React.createElement("div", {
      className: "block"
    }, React.createElement("h2", {
      className: "block highlight-info tx-header"
    }, "Transaction receipt"), React.createElement(ReactJson, {
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

class EventItem extends React.Component {
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
    return React.createElement("li", {
      className: "event-list-item"
    }, React.createElement("label", {
      className: "label event-collapse-label"
    }, React.createElement("h4", {
      className: "padded text-warning"
    }, event.id, " : ", event.event), React.createElement("button", {
      className: toggleBtnStyle,
      onClick: this._toggleCollapse
    }, toggleBtnTxt)), React.createElement(reactCollapse.Collapse, {
      isOpened: isOpened
    }, React.createElement(ReactJson, {
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

class Events extends React.Component {
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
    return React.createElement("div", {
      className: "events-container select-list"
    }, React.createElement("ul", {
      className: "list-group"
    }, events_.length > 0 && events_.map((event, i) => {
      return React.createElement(EventItem, {
        key: i,
        event: event
      });
    }), !(events_.length > 0) && React.createElement("h2", {
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

class RemixTest extends React.Component {
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
    return React.createElement(reactRedux.Provider, {
      store: this.props.store
    }, React.createElement("div", {
      id: "remix-tests"
    }, React.createElement("h3", {
      className: "block test-header"
    }, "Test files should have [foo]_test.sol suffix"), React.createElement("div", {
      className: "test-selector"
    }, React.createElement("button", {
      className: "btn btn-primary inline-block-tight",
      onClick: this._runRemixTests
    }, "Run tests"), running && React.createElement("span", {
      className: "loading loading-spinner-tiny inline-block"
    }), testResult && React.createElement("div", {
      className: "test-result"
    }, React.createElement("span", {
      className: "text-error"
    }, "Total failing: ", testResult.totalFailing, " "), React.createElement("span", {
      className: "text-success"
    }, "Total passing: ", testResult.totalPassing, " "), React.createElement("span", {
      className: "text-info"
    }, "Time: ", testResult.totalTime))), React.createElement(VirtualList, {
      height: "50vh",
      itemCount: testResults.length,
      itemSize: 30,
      className: "test-result-list-container",
      overscanCount: 10,
      renderItem: ({
        index
      }) => React.createElement("div", {
        key: index,
        className: "test-result-list-item"
      }, testResults[index].type === 'contract' && React.createElement("span", {
        className: "status-renamed icon icon-checklist"
      }), testResults[index].type === 'testPass' && React.createElement("span", {
        className: "status-added icon icon-check"
      }), testResults[index].type === 'testFailure' && React.createElement("span", {
        className: "status-removed icon icon-x"
      }), React.createElement("span", {
        className: "padded text-warning"
      }, testResults[index].value))
    }), React.createElement("div", {
      id: "test-error",
      className: "error-container"
    }, React.createElement(ErrorView$1, null))));
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

class RemixDebugger extends React.Component {
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
      console.log("debugger detected");
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    return React.createElement(reactRedux.Provider, {
      store: this.props.store
    }, React.createElement("div", {
      id: "remix-Debugger"
    }, React.createElement("h3", null, "Remix-Debugger"), React.createElement("button", {
      className: "btn btn-primary inline-block-tight",
      onClick: (blockNumber, txNumber, tx) => this._runRemixDebugging(blockNumber, txNumber, tx)
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

class NodeControl extends React.Component {
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
    return React.createElement("div", {
      id: "NodeControl"
    }, React.createElement("div", {
      id: "connections"
    }, React.createElement("ul", {
      className: "connection-urls list-group"
    }, React.createElement("li", {
      className: "list-item"
    }, React.createElement("form", {
      onSubmit: this._handleWsSubmit
    }, React.createElement("input", {
      type: "submit",
      value: "WS",
      className: wsProvider && connected ? 'btn btn-success smallbtn' : 'btn btn-error smallbtn'
    }), React.createElement("input", {
      type: "string",
      placeholder: "Address",
      className: "input-text",
      value: websocketAddress,
      onChange: this._handleWsChange
    }))), React.createElement("li", {
      className: "list-item"
    }, React.createElement("form", {
      onSubmit: this._handleRPCSubmit
    }, React.createElement("input", {
      type: "submit",
      value: "RPC",
      className: httpProvider && connected ? 'btn btn-success smallbtn' : 'btn btn-error smallbtn'
    }), React.createElement("input", {
      type: "string",
      placeholder: "Address",
      className: "input-text",
      value: rpcAddress,
      onChange: this._handleRPCChange
    }))), React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Connected:"), React.createElement("span", {
      className: "inline-block"
    }, `${connected}`)))), React.createElement("ul", {
      className: "list-group"
    }, React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Coinbase:"), React.createElement("span", {
      className: "inline-block"
    }, coinbase))), Object.keys(status).length > 0 && status instanceof Object && React.createElement("ul", {
      className: "list-group"
    }, React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Sync progress:"), React.createElement("progress", {
      className: "inline-block",
      max: "100",
      value: (100 * (status.currentBlock / status.highestBlock)).toFixed(2)
    }), React.createElement("span", {
      className: "inline-block"
    }, (100 * (status.currentBlock / status.highestBlock)).toFixed(2), "%")), React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Current Block:"), React.createElement("span", {
      className: "inline-block"
    }, status.currentBlock)), React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Highest Block:"), React.createElement("span", {
      className: "inline-block"
    }, status.highestBlock)), React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Known States:"), React.createElement("span", {
      className: "inline-block"
    }, status.knownStates)), React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Pulled States"), React.createElement("span", {
      className: "inline-block"
    }, status.pulledStates)), React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Starting Block:"), React.createElement("span", {
      className: "inline-block"
    }, status.startingBlock))), !syncing && React.createElement("ul", {
      className: "list-group"
    }, React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Syncing:"), React.createElement("span", {
      className: "inline-block"
    }, `${syncing}`))), React.createElement("ul", {
      className: "list-group"
    }, React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Mining:"), React.createElement("span", {
      className: "inline-block"
    }, `${mining}`)), React.createElement("li", {
      className: "list-item"
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Hashrate:"), React.createElement("span", {
      className: "inline-block"
    }, hashRate))), React.createElement("button", {
      className: "btn",
      onClick: this._refreshSync
    }, "Refresh"), React.createElement("form", {
      className: "row",
      onSubmit: this._handleSend
    }, React.createElement("input", {
      type: "string",
      placeholder: "To address",
      className: "input-text",
      value: toAddress,
      onChange: this._handleToAddrrChange
    }), React.createElement("input", {
      type: "number",
      placeholder: "Amount",
      className: "input-text",
      value: amount,
      onChange: this._handleAmountChange
    }), React.createElement("input", {
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

class StaticAnalysis extends React.Component {
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
    return React.createElement("div", {
      className: "static-analyzer"
    }, React.createElement(CheckboxTree, {
      nodes: nodes,
      checked: this.state.checked,
      expanded: this.state.expanded,
      onCheck: checked => this.setState({
        checked
      }),
      showNodeIcon: false
    }), React.createElement("button", {
      className: "btn btn-primary inline-block-tight",
      onClick: this._runAnalysis
    }, "Run analysis"), running && React.createElement("span", {
      className: "loading loading-spinner-tiny inline-block"
    }), analysis.length > 0 && analysis.map((a, j) => {
      if (a.report.length > 0) {
        return React.createElement("div", {
          className: "padded",
          key: j
        }, a.report.map((report, i) => {
          return React.createElement("div", {
            key: i
          }, report.location && React.createElement("span", {
            className: "text-info"
          }, report.location, ' '), report.warning && React.createElement("span", {
            className: "text-warning",
            dangerouslySetInnerHTML: {
              __html: report.warning
            }
          }), report.more && React.createElement("p", null, React.createElement("a", {
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

class TabView extends React.Component {
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
    return React.createElement(reactTabs.Tabs, {
      onSelect: index => this._handleTabSelect(index),
      className: "react-tabs vertical-tabs"
    }, React.createElement(reactTabs.TabList, {
      className: "react-tabs__tab-list vertical tablist"
    }, React.createElement("div", {
      className: "tab_btns"
    }, React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn"
    }, "Contract")), React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn"
    }, "Tests")), React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn"
    }, "Analysis")), React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: txBtnStyle
    }, "Transaction analyzer", newTxCounter > 0 && React.createElement("span", {
      className: "badge badge-small badge-error notify-badge"
    }, newTxCounter))), React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn"
    }, "Debugger")), React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: eventBtnStyle
    }, "Events", newEventCounter > 0 && React.createElement("span", {
      className: "badge badge-small badge-error notify-badge"
    }, newEventCounter))), React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn"
    }, "Node")), React.createElement(reactTabs.Tab, null, React.createElement("div", {
      className: "btn btn-warning"
    }, "Help")))), React.createElement(reactTabs.TabPanel, null, React.createElement(Contracts$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React.createElement(reactTabs.TabPanel, null, React.createElement(RemixTest$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React.createElement(reactTabs.TabPanel, null, React.createElement(StaticAnalysis$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React.createElement(reactTabs.TabPanel, null, React.createElement(TxAnalyzer$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React.createElement(reactTabs.TabPanel, null, React.createElement(RemixDebugger$1, {
      store: this.props.store
    })), React.createElement(reactTabs.TabPanel, null, React.createElement(Events$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React.createElement(reactTabs.TabPanel, null, React.createElement(NodeControl$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React.createElement(reactTabs.TabPanel, null, React.createElement("h2", {
      className: "text-warning"
    }, "Help Etheratom to keep solidity development interactive."), React.createElement("h4", {
      className: "text-success"
    }, "Donate Ethereum: 0xd22fE4aEFed0A984B1165dc24095728EE7005a36"), React.createElement("p", null, React.createElement("span", null, "Etheratom news "), React.createElement("a", {
      href: "https://twitter.com/hashtag/Etheratom"
    }, "#Etheratom")), React.createElement("p", null, React.createElement("span", null, "Etheratom support "), React.createElement("a", {
      href: "https://t.me/etheratom"
    }, "t.me/etheratom")), React.createElement("p", null, "Contact: ", React.createElement("a", {
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

class CoinbaseView extends React.Component {
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
    return React.createElement("div", {
      className: "content"
    }, accounts.length > 0 && React.createElement("div", {
      className: "row"
    }, React.createElement("div", {
      className: "icon icon-link btn copy-btn btn-success",
      onClick: this._linkClick
    }), React.createElement("select", {
      onChange: this._handleAccChange,
      value: coinbase
    }, accounts.map((account, i) => {
      return React.createElement("option", {
        key: i,
        value: account
      }, account);
    })), React.createElement("button", {
      onClick: this._refreshBal,
      className: "btn"
    }, " ", balance, " ETH ")), accounts.length > 0 && React.createElement("form", {
      className: "row",
      onSubmit: this._handleUnlock
    }, React.createElement("div", {
      className: "icon icon-lock"
    }), React.createElement("input", {
      type: "password",
      placeholder: "Password",
      value: password,
      onChange: this._handlePasswordChange
    }), React.createElement("input", {
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

class VersionSelector extends React.Component {
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
    return React.createElement("div", {
      className: "content"
    }, React.createElement("div", {
      className: "row"
    }, React.createElement("select", {
      onChange: this._handleVersionSelector,
      value: this.state.selectedVersion
    }, Object.keys(availableVersions).map((key, i) => {
      return React.createElement("option", {
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

class CompileBtn extends React.Component {
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
    return React.createElement("form", {
      className: "row",
      onSubmit: this._handleSubmit
    }, compiling && React.createElement("input", {
      type: "submit",
      value: "Compiling...",
      className: "btn copy-btn btn-success",
      disabled: true
    }), !compiling && React.createElement("input", {
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

const loaderContainerStyle = {
  textAlign: 'center',
  justifyContent: 'center'
};

class LoaderView extends React.Component {
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

    return React.createElement("div", {
      className: "loader",
      style: loaderContainerStyle
    }, React.createElement(reactSpinners.ScaleLoader, {
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
      ReactDOM.render(React.createElement(CoinbaseView$1, {
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
      ReactDOM.render(React.createElement(CoinbaseView$1, {
        store: this.store,
        helpers: this.helpers
      }), document.getElementById('accounts-list'));
      throw e;
    }
  }

  createButtonsView() {
    ReactDOM.render(React.createElement(CompileBtn$1, {
      store: this.store
    }), document.getElementById('compile_btn'));
  }

  createTabView() {
    ReactDOM.render(React.createElement(TabView$1, {
      store: this.store,
      helpers: this.helpers
    }), document.getElementById('tab_view'));
  }

  createVersionSelector() {
    ReactDOM.render(React.createElement(VersionSelector$1, {
      store: this.store
    }), document.getElementById('version_selector'));
  }

  createLoaderView() {
    ReactDOM.render(React.createElement(LoaderView$1, {
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

    this.compileSubscriptions.add(atom.workspace.observeTextEditors(editor => {
      if (!editor || !editor.getBuffer()) {
        return;
      }

      this.compile(editor);
    }));
  } // common functions


  async setSources(editor) {
    const filePath = editor.getPath();
    const filename = filePath.replace(/^.*[\\/]/, '');

    if (filePath.split('.').pop() == 'sol') {
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
    }
  }

  async compile(editor) {
    const filePath = editor.getPath(); // Reset redux store
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

    if (filePath.split('.').pop() == 'sol') {
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
        console.log(e);
        showPanelError(e);
      }
    } else {
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
            options: action.payload.options
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
