'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var ReactDOM = _interopDefault(require('react-dom'));
var atom$1 = require('atom');
var Solc = _interopDefault(require('solc'));
var Web3 = _interopDefault(require('web3'));
require('ethereumjs-abi');
require('ethereumjs-tx');
var EventEmitter = _interopDefault(require('events'));
var atomMessagePanel = require('atom-message-panel');
var axios = _interopDefault(require('axios'));
var path = _interopDefault(require('path'));
var url = _interopDefault(require('url'));
var validUrl = _interopDefault(require('valid-url'));
var fs = _interopDefault(require('fs'));
var reactRedux = require('react-redux');
var ReactJson = _interopDefault(require('react-json-view'));
var reactTabs = require('react-tabs');
var reactCollapse = require('react-collapse');
var VirtualList = _interopDefault(require('react-tiny-virtual-list'));
var remixSolidity = require('remix-solidity');
var CheckboxTree = _interopDefault(require('react-checkbox-tree'));
require('create-react-class');
require('react-addons-update');
var redux = require('redux');
var logger = _interopDefault(require('redux-logger'));
var ReduxThunk = _interopDefault(require('redux-thunk'));

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
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
};

var _extends = Object.assign || function (target) {
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

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var AtomSolidityView = function () {
	function AtomSolidityView() {
		classCallCheck(this, AtomSolidityView);

		this.element = document.createElement;
		this.element = document.createElement('atom-panel');
		this.element.classList.add('etheratom-panel');
		var att = null;

		// empty div to handle resize
		var resizeNode = document.createElement('div');
		resizeNode.onmousedown = this.handleMouseDown.bind(this);
		resizeNode.classList.add('etheratom-panel-resize-handle');
		resizeNode.setAttribute('ref', 'resizehandle');
		this.element.appendChild(resizeNode);

		var mainNode = document.createElement('div');
		mainNode.classList.add('etheratom');
		mainNode.classList.add('native-key-bindings');
		mainNode.setAttribute('tabindex', '-1');

		var message = document.createElement('div');
		message.textContent = "Etheratom IDE";
		message.classList.add('compiler-info');
		message.classList.add('block');
		message.classList.add('highlight-info');
		mainNode.appendChild(message);

		var compilerNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'client-options';
		compilerNode.setAttributeNode(att);
		mainNode.appendChild(compilerNode);

		var accountsNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'accounts-list';
		accountsNode.setAttributeNode(att);
		mainNode.appendChild(accountsNode);

		var buttonNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'common-buttons';
		buttonNode.setAttributeNode(att);
		buttonNode.classList.add('block');

		var compileButton = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'compile_btn';
		compileButton.setAttributeNode(att);
		compileButton.classList.add('inline-block');

		buttonNode.appendChild(compileButton);
		mainNode.appendChild(buttonNode);

		var tabNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'tab_view';
		tabNode.setAttributeNode(att);
		mainNode.appendChild(tabNode);

		var errorNode = document.createElement('div');
		att = document.createAttribute('id');
		att.value = 'compiled-error';
		errorNode.setAttributeNode(att);
		errorNode.classList.add('compiled-error');
		mainNode.appendChild(errorNode);

		// Finally append mainNode to element
		this.element.appendChild(mainNode);

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.dispose = this.dispose.bind(this);
		this.getElement = this.getElement.bind(this);
		this.destroy = this.destroy.bind(this);
	}

	createClass(AtomSolidityView, [{
		key: 'handleMouseDown',
		value: function handleMouseDown(e) {
			var _this = this;

			if (this.subscriptions != null) {
				this.subscriptions.dispose();
			}

			var mouseUpHandler = function mouseUpHandler(e) {
				return _this.handleMouseUp(e);
			};
			var mouseMoveHandler = function mouseMoveHandler(e) {
				return _this.handleMouseMove(e);
			};
			window.addEventListener('mousemove', mouseMoveHandler);
			window.addEventListener('mouseup', mouseUpHandler);

			this.subscriptions = new atom$1.CompositeDisposable({
				dispose: function dispose() {
					window.removeEventListener('mousemove', mouseMoveHandler);
				}
			}, {
				dispose: function dispose() {
					window.removeEventListener('mouseup', mouseUpHandler);
				}
			});
		}
	}, {
		key: 'handleMouseMove',
		value: function handleMouseMove(e) {
			// Currently only vertical panel is working, may be later I should add horizontal panel
			var width = this.element.getBoundingClientRect().right - e.pageX;
			var vwidth = window.innerWidth;
			var vw = width / vwidth * 100 + 'vw';
			this.element.style.width = vw;
		}
	}, {
		key: 'handleMouseUp',
		value: function handleMouseUp(e) {
			if (this.subscriptions) {
				this.subscriptions.dispose();
			}
		}
	}, {
		key: 'getElement',
		value: function getElement() {
			return this.element;
		}
	}, {
		key: 'dispose',
		value: function dispose() {
			this.destroy();
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			return this.element.remove();
		}
	}]);
	return AtomSolidityView;
}();

var Web3Helpers = function () {
	function Web3Helpers(web3) {
		classCallCheck(this, Web3Helpers);

		this.web3 = web3;
	}

	createClass(Web3Helpers, [{
		key: 'compileWeb3',
		value: function () {
			var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sources) {
				var outputSelection, settings, input, output;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.prev = 0;
								outputSelection = {
									// Enable the metadata and bytecode outputs of every single contract.
									"*": {
										"": ["legacyAST"],
										"*": ["abi", "evm.bytecode.object", "devdoc", "userdoc", "evm.gasEstimates"]
									}
								};
								settings = {
									optimizer: { enabled: true, runs: 500 },
									evmVersion: "byzantium",
									outputSelection: outputSelection
								};
								input = { language: "Solidity", sources: sources, settings: settings };
								_context.next = 6;
								return Solc.compileStandardWrapper(JSON.stringify(input));

							case 6:
								output = _context.sent;
								return _context.abrupt('return', JSON.parse(output));

							case 10:
								_context.prev = 10;
								_context.t0 = _context['catch'](0);
								throw _context.t0;

							case 13:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[0, 10]]);
			}));

			function compileWeb3(_x) {
				return _ref.apply(this, arguments);
			}

			return compileWeb3;
		}()
	}, {
		key: 'getGasEstimate',
		value: function () {
			var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(coinbase, bytecode) {
				var error, gasEstimate;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								if (coinbase) {
									_context2.next = 3;
									break;
								}

								error = new Error('No coinbase selected!');
								throw error;

							case 3:
								_context2.prev = 3;

								this.web3.eth.defaultAccount = coinbase;
								_context2.next = 7;
								return this.web3.eth.estimateGas({
									from: this.web3.eth.defaultAccount,
									data: '0x' + bytecode
								});

							case 7:
								gasEstimate = _context2.sent;
								return _context2.abrupt('return', gasEstimate);

							case 11:
								_context2.prev = 11;
								_context2.t0 = _context2['catch'](3);
								throw _context2.t0;

							case 14:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this, [[3, 11]]);
			}));

			function getGasEstimate(_x2, _x3) {
				return _ref2.apply(this, arguments);
			}

			return getGasEstimate;
		}()
	}, {
		key: 'getBalance',
		value: function () {
			var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(coinbase) {
				var error, weiBalance, ethBalance;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								if (coinbase) {
									_context3.next = 3;
									break;
								}

								error = new Error('No coinbase selected!');
								throw error;

							case 3:
								_context3.prev = 3;
								_context3.next = 6;
								return this.web3.eth.getBalance(coinbase);

							case 6:
								weiBalance = _context3.sent;
								_context3.next = 9;
								return this.web3.utils.fromWei(weiBalance, "ether");

							case 9:
								ethBalance = _context3.sent;
								return _context3.abrupt('return', ethBalance);

							case 13:
								_context3.prev = 13;
								_context3.t0 = _context3['catch'](3);
								throw _context3.t0;

							case 16:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this, [[3, 13]]);
			}));

			function getBalance(_x4) {
				return _ref3.apply(this, arguments);
			}

			return getBalance;
		}()
	}, {
		key: 'getSyncStat',
		value: function () {
			var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.prev = 0;
								return _context4.abrupt('return', this.web3.eth.isSyncing());

							case 4:
								_context4.prev = 4;
								_context4.t0 = _context4['catch'](0);
								throw _context4.t0;

							case 7:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this, [[0, 4]]);
			}));

			function getSyncStat() {
				return _ref4.apply(this, arguments);
			}

			return getSyncStat;
		}()
	}, {
		key: 'create',
		value: function () {
			var _ref6 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref5) {
				var args = objectWithoutProperties(_ref5, []);
				var coinbase, password, abi, code, gasSupply, error, unlocked, gasPrice, contract;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								console.log("%c Creating contract... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
								coinbase = args.coinbase;
								password = args.password;
								abi = args.abi;
								code = args.bytecode;
								gasSupply = args.gas;

								if (coinbase) {
									_context5.next = 10;
									break;
								}

								error = new Error('No coinbase selected!');
								throw error;

							case 10:
								this.web3.eth.defaultAccount = coinbase;
								_context5.prev = 11;

								if (!password) {
									_context5.next = 16;
									break;
								}

								_context5.next = 15;
								return this.web3.eth.personal.unlockAccount(coinbase, password);

							case 15:
								unlocked = _context5.sent;

							case 16:
								_context5.prev = 16;
								_context5.next = 19;
								return this.web3.eth.getGasPrice();

							case 19:
								gasPrice = _context5.sent;
								_context5.next = 22;
								return new this.web3.eth.Contract(abi, {
									from: this.web3.eth.defaultAccount,
									data: '0x' + code,
									gas: this.web3.utils.toHex(gasSupply),
									gasPrice: this.web3.utils.toHex(gasPrice)
								});

							case 22:
								contract = _context5.sent;
								return _context5.abrupt('return', contract);

							case 26:
								_context5.prev = 26;
								_context5.t0 = _context5['catch'](16);

								console.log(_context5.t0);
								throw _context5.t0;

							case 30:
								_context5.next = 36;
								break;

							case 32:
								_context5.prev = 32;
								_context5.t1 = _context5['catch'](11);

								console.log(_context5.t1);
								throw _context5.t1;

							case 36:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this, [[11, 32], [16, 26]]);
			}));

			function create(_x5) {
				return _ref6.apply(this, arguments);
			}

			return create;
		}()
	}, {
		key: 'deploy',
		value: function () {
			var _ref7 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(contract, params) {
				var ContractInstance, contractInstance, gasPrice;
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								console.log("%c Deploying contract... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');

								ContractInstance = function (_EventEmitter) {
									inherits(ContractInstance, _EventEmitter);

									function ContractInstance() {
										classCallCheck(this, ContractInstance);
										return possibleConstructorReturn(this, (ContractInstance.__proto__ || Object.getPrototypeOf(ContractInstance)).apply(this, arguments));
									}

									return ContractInstance;
								}(EventEmitter);
								contractInstance = new ContractInstance();
								_context6.prev = 4;

								params = params.map(function (param) {
									return param.type.endsWith('[]') ? param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',') : param.value;
								});
								_context6.next = 8;
								return this.web3.eth.getGasPrice();

							case 8:
								gasPrice = _context6.sent;

								contract.deploy({
									arguments: params
								}).send({
									from: this.web3.eth.defaultAccount
								}).on('transactionHash', function (transactionHash) {
									contractInstance.emit('transactionHash', transactionHash);
								}).on('receipt', function (txReceipt) {
									contractInstance.emit('receipt', txReceipt);
								}).on('confirmation', function (confirmationNumber) {
									contractInstance.emit('confirmation', confirmationNumber);
								}).on('error', function (error) {
									contractInstance.emit('error', error);
								}).then(function (instance) {
									contractInstance.emit('address', instance.options.address);
									contractInstance.emit('instance', instance);
								});
								return _context6.abrupt('return', contractInstance);

							case 13:
								_context6.prev = 13;
								_context6.t0 = _context6['catch'](4);

								console.log(_context6.t0);
								throw _context6.t0;

							case 17:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this, [[4, 13]]);
			}));

			function deploy(_x6, _x7) {
				return _ref7.apply(this, arguments);
			}

			return deploy;
		}()
	}, {
		key: 'call',
		value: function () {
			var _ref9 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref8) {
				var _this2 = this;

				var args = objectWithoutProperties(_ref8, []);

				var coinbase, password, contract, abiItem, params, _result, _contract$methods, _result3, _result2, _contract$methods2, _result4, result;

				return regeneratorRuntime.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								console.log("%c Web3 calling functions... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
								coinbase = args.coinbase;
								password = args.password;
								contract = args.contract;
								abiItem = args.abiItem;
								params = args.params || [];


								this.web3.eth.defaultAccount = coinbase;
								_context7.prev = 7;

								// Prepare params for call
								params = params.map(function (param) {
									if (param.type.endsWith('[]')) {
										return param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',');
									}
									if (param.type.indexOf('int') > -1) {
										return new _this2.web3.utils.BN(param.value);
									}
									return param.value;
								});

								// Handle fallback

								if (!(abiItem.type === 'fallback')) {
									_context7.next = 17;
									break;
								}

								if (!password) {
									_context7.next = 13;
									break;
								}

								_context7.next = 13;
								return this.web3.eth.personal.unlockAccount(coinbase, password);

							case 13:
								_context7.next = 15;
								return this.web3.eth.sendTransaction({
									from: coinbase,
									to: contract.options.address,
									value: abiItem.payableValue || 0
								});

							case 15:
								_result = _context7.sent;
								return _context7.abrupt('return', _result);

							case 17:
								if (!(abiItem.constant === false || abiItem.payable === true)) {
									_context7.next = 30;
									break;
								}

								if (!password) {
									_context7.next = 21;
									break;
								}

								_context7.next = 21;
								return this.web3.eth.personal.unlockAccount(coinbase, password);

							case 21:
								if (!(params.length > 0)) {
									_context7.next = 26;
									break;
								}

								_context7.next = 24;
								return (_contract$methods = contract.methods)[abiItem.name].apply(_contract$methods, toConsumableArray(params)).send({ from: coinbase, value: abiItem.payableValue });

							case 24:
								_result3 = _context7.sent;
								return _context7.abrupt('return', _result3);

							case 26:
								_context7.next = 28;
								return contract.methods[abiItem.name]().send({ from: coinbase, value: abiItem.payableValue });

							case 28:
								_result2 = _context7.sent;
								return _context7.abrupt('return', _result2);

							case 30:
								if (!(params.length > 0)) {
									_context7.next = 35;
									break;
								}

								_context7.next = 33;
								return (_contract$methods2 = contract.methods)[abiItem.name].apply(_contract$methods2, toConsumableArray(params)).call({ from: coinbase });

							case 33:
								_result4 = _context7.sent;
								return _context7.abrupt('return', _result4);

							case 35:
								_context7.next = 37;
								return contract.methods[abiItem.name]().call({ from: coinbase });

							case 37:
								result = _context7.sent;
								return _context7.abrupt('return', result);

							case 41:
								_context7.prev = 41;
								_context7.t0 = _context7['catch'](7);

								console.log(_context7.t0);
								throw _context7.t0;

							case 45:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, this, [[7, 41]]);
			}));

			function call(_x8) {
				return _ref9.apply(this, arguments);
			}

			return call;
		}()
	}, {
		key: 'funcParamsToArray',
		value: function () {
			var _ref10 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(contractFunction) {
				var _this3 = this;

				var inputElements;
				return regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								if (!(contractFunction && contractFunction.inputs.length > 0)) {
									_context9.next = 5;
									break;
								}

								_context9.next = 3;
								return Promise.all(contractFunction.inputs.map(function () {
									var _ref11 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(input) {
										return regeneratorRuntime.wrap(function _callee8$(_context8) {
											while (1) {
												switch (_context8.prev = _context8.next) {
													case 0:
														return _context8.abrupt('return', [input.type, input.name]);

													case 1:
													case 'end':
														return _context8.stop();
												}
											}
										}, _callee8, _this3);
									}));

									return function (_x10) {
										return _ref11.apply(this, arguments);
									};
								}()));

							case 3:
								inputElements = _context9.sent;
								return _context9.abrupt('return', inputElements);

							case 5:
								return _context9.abrupt('return', []);

							case 6:
							case 'end':
								return _context9.stop();
						}
					}
				}, _callee9, this);
			}));

			function funcParamsToArray(_x9) {
				return _ref10.apply(this, arguments);
			}

			return funcParamsToArray;
		}()
	}, {
		key: 'inputsToArray',
		value: function () {
			var _ref12 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(paramObject) {
				var _this4 = this;

				return regeneratorRuntime.wrap(function _callee10$(_context10) {
					while (1) {
						switch (_context10.prev = _context10.next) {
							case 0:
								if (!paramObject.type.endsWith('[]')) {
									_context10.next = 2;
									break;
								}

								return _context10.abrupt('return', paramObject.value.split(',').map(function (val) {
									return _this4.web3.utils.toHex(val.trim());
								}));

							case 2:
								return _context10.abrupt('return', this.web3.utils.toHex(paramObject.value));

							case 3:
							case 'end':
								return _context10.stop();
						}
					}
				}, _callee10, this);
			}));

			function inputsToArray(_x11) {
				return _ref12.apply(this, arguments);
			}

			return inputsToArray;
		}()
	}, {
		key: 'showPanelError',
		value: function showPanelError(err_message) {
			var messages = void 0;
			messages = new atomMessagePanel.MessagePanelView({ title: 'Etheratom report' });
			messages.attach();
			messages.add(new atomMessagePanel.PlainMessageView({ message: err_message, className: 'red-message' }));
		}
	}, {
		key: 'showOutput',
		value: function showOutput(_ref13) {
			var args = objectWithoutProperties(_ref13, []);

			var address = args.address;
			var data = args.data;
			var messages = new atomMessagePanel.MessagePanelView({ title: 'Etheratom output' });
			messages.attach();
			messages.add(new atomMessagePanel.PlainMessageView({
				message: 'Contract address: ' + address,
				className: 'green-message'
			}));
			if (data instanceof Object) {
				var rawMessage = '<h6>Contract output:</h6><pre>' + JSON.stringify(data, null, 4) + '</pre>';
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
		// Transaction analysis

	}, {
		key: 'getTxAnalysis',
		value: function () {
			var _ref14 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(txHash) {
				var transaction, transactionRecipt;
				return regeneratorRuntime.wrap(function _callee11$(_context11) {
					while (1) {
						switch (_context11.prev = _context11.next) {
							case 0:
								_context11.prev = 0;
								_context11.next = 3;
								return this.web3.eth.getTransaction(txHash);

							case 3:
								transaction = _context11.sent;
								_context11.next = 6;
								return this.web3.eth.getTransactionReceipt(txHash);

							case 6:
								transactionRecipt = _context11.sent;
								return _context11.abrupt('return', { transaction: transaction, transactionRecipt: transactionRecipt });

							case 10:
								_context11.prev = 10;
								_context11.t0 = _context11['catch'](0);
								throw _context11.t0;

							case 13:
							case 'end':
								return _context11.stop();
						}
					}
				}, _callee11, this, [[0, 10]]);
			}));

			function getTxAnalysis(_x12) {
				return _ref14.apply(this, arguments);
			}

			return getTxAnalysis;
		}()
		// Gas Limit

	}, {
		key: 'getGasLimit',
		value: function () {
			var _ref15 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
				var block;
				return regeneratorRuntime.wrap(function _callee12$(_context12) {
					while (1) {
						switch (_context12.prev = _context12.next) {
							case 0:
								_context12.prev = 0;
								_context12.next = 3;
								return this.web3.eth.getBlock('latest');

							case 3:
								block = _context12.sent;
								return _context12.abrupt('return', block.gasLimit);

							case 7:
								_context12.prev = 7;
								_context12.t0 = _context12['catch'](0);
								throw _context12.t0;

							case 10:
							case 'end':
								return _context12.stop();
						}
					}
				}, _callee12, this, [[0, 7]]);
			}));

			function getGasLimit() {
				return _ref15.apply(this, arguments);
			}

			return getGasLimit;
		}()
	}, {
		key: 'getAccounts',
		value: function () {
			var _ref16 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
				return regeneratorRuntime.wrap(function _callee13$(_context13) {
					while (1) {
						switch (_context13.prev = _context13.next) {
							case 0:
								_context13.prev = 0;
								_context13.next = 3;
								return this.web3.eth.getAccounts();

							case 3:
								return _context13.abrupt('return', _context13.sent);

							case 6:
								_context13.prev = 6;
								_context13.t0 = _context13['catch'](0);
								throw _context13.t0;

							case 9:
							case 'end':
								return _context13.stop();
						}
					}
				}, _callee13, this, [[0, 6]]);
			}));

			function getAccounts() {
				return _ref16.apply(this, arguments);
			}

			return getAccounts;
		}()
	}, {
		key: 'getMining',
		value: function () {
			var _ref17 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
				return regeneratorRuntime.wrap(function _callee14$(_context14) {
					while (1) {
						switch (_context14.prev = _context14.next) {
							case 0:
								_context14.prev = 0;
								_context14.next = 3;
								return this.web3.eth.isMining();

							case 3:
								return _context14.abrupt('return', _context14.sent);

							case 6:
								_context14.prev = 6;
								_context14.t0 = _context14['catch'](0);
								throw _context14.t0;

							case 9:
							case 'end':
								return _context14.stop();
						}
					}
				}, _callee14, this, [[0, 6]]);
			}));

			function getMining() {
				return _ref17.apply(this, arguments);
			}

			return getMining;
		}()
	}, {
		key: 'getHashrate',
		value: function () {
			var _ref18 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
				return regeneratorRuntime.wrap(function _callee15$(_context15) {
					while (1) {
						switch (_context15.prev = _context15.next) {
							case 0:
								_context15.prev = 0;
								_context15.next = 3;
								return this.web3.eth.getHashrate();

							case 3:
								return _context15.abrupt('return', _context15.sent);

							case 6:
								_context15.prev = 6;
								_context15.t0 = _context15['catch'](0);
								throw _context15.t0;

							case 9:
							case 'end':
								return _context15.stop();
						}
					}
				}, _callee15, this, [[0, 6]]);
			}));

			function getHashrate() {
				return _ref18.apply(this, arguments);
			}

			return getHashrate;
		}()
	}]);
	return Web3Helpers;
}();

var handleGithubCall = function () {
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fullpath, repoPath, path$$1, filename, fileRoot) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return axios({
                            method: 'get',
                            url: 'https://api.github.com/repos/' + repoPath + '/contents/' + path$$1,
                            responseType: 'json'
                        }).then(function (response) {
                            if ('content' in response.data) {
                                var buf = Buffer.from(response.data.content, 'base64');
                                fileRoot = fullpath.substring(0, fullpath.lastIndexOf("/"));
                                fileRoot = fileRoot + '/';
                                var resp = { filename: filename, content: buf.toString('UTF-8'), fileRoot: fileRoot };
                                return resp;
                            } else {
                                throw 'Content not received!';
                            }
                        });

                    case 2:
                        return _context.abrupt('return', _context.sent);

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function handleGithubCall(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
    };
}();

var handleLocalImport = function () {
    var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(pathString, filename, fileRoot) {
        var o, content, response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        o = { encoding: 'UTF-8' };
                        content = fs.readFileSync(path.resolve(fileRoot, pathString, filename), o);

                        fileRoot = path.resolve(fileRoot, pathString);
                        response = { filename: filename, content: content, fileRoot: fileRoot };
                        return _context2.abrupt('return', response);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function handleLocalImport(_x6, _x7, _x8) {
        return _ref2.apply(this, arguments);
    };
}();

var getHandlers = function () {
    var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        return _context5.abrupt('return', [{
                            type: 'local',
                            match: /(^(?!(?:http:\/\/)|(?:https:\/\/)?(?:www.)?(?:github.com)))(^\/*[\w+-_/]*\/)*?(\w+.sol)/g,
                            handle: function () {
                                var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(match, fileRoot) {
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    _context3.next = 2;
                                                    return handleLocalImport(match[2], match[3], fileRoot);

                                                case 2:
                                                    return _context3.abrupt('return', _context3.sent);

                                                case 3:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, _this);
                                }));

                                function handle(_x9, _x10) {
                                    return _ref4.apply(this, arguments);
                                }

                                return handle;
                            }()
                        }, {
                            type: 'github',
                            match: /^(https?:\/\/)?(www.)?github.com\/([^\/]*\/[^\/]*)(.*\/(\w+.sol))/g,
                            handle: function () {
                                var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(match, fileRoot) {
                                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                        while (1) {
                                            switch (_context4.prev = _context4.next) {
                                                case 0:
                                                    _context4.next = 2;
                                                    return handleGithubCall(match[0], match[3], match[4], match[5], fileRoot);

                                                case 2:
                                                    return _context4.abrupt('return', _context4.sent);

                                                case 3:
                                                case 'end':
                                                    return _context4.stop();
                                            }
                                        }
                                    }, _callee4, _this);
                                }));

                                function handle(_x11, _x12) {
                                    return _ref5.apply(this, arguments);
                                }

                                return handle;
                            }()
                        }]);

                    case 1:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function getHandlers() {
        return _ref3.apply(this, arguments);
    };
}();

var resolveImports = function () {
    var _ref6 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(fileRoot, sourcePath) {
        var handlers, response, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, handler, match;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return getHandlers();

                    case 2:
                        handlers = _context6.sent;
                        response = {};
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context6.prev = 7;
                        _iterator = handlers[Symbol.iterator]();

                    case 9:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context6.next = 26;
                            break;
                        }

                        handler = _step.value;
                        _context6.prev = 11;

                        // here we are trying to find type of import path github/swarm/ipfs/local
                        match = handler.match.exec(sourcePath);

                        if (!match) {
                            _context6.next = 18;
                            break;
                        }

                        _context6.next = 16;
                        return handler.handle(match, fileRoot);

                    case 16:
                        response = _context6.sent;
                        return _context6.abrupt('break', 26);

                    case 18:
                        _context6.next = 23;
                        break;

                    case 20:
                        _context6.prev = 20;
                        _context6.t0 = _context6['catch'](11);
                        throw _context6.t0;

                    case 23:
                        _iteratorNormalCompletion = true;
                        _context6.next = 9;
                        break;

                    case 26:
                        _context6.next = 32;
                        break;

                    case 28:
                        _context6.prev = 28;
                        _context6.t1 = _context6['catch'](7);
                        _didIteratorError = true;
                        _iteratorError = _context6.t1;

                    case 32:
                        _context6.prev = 32;
                        _context6.prev = 33;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 35:
                        _context6.prev = 35;

                        if (!_didIteratorError) {
                            _context6.next = 38;
                            break;
                        }

                        throw _iteratorError;

                    case 38:
                        return _context6.finish(35);

                    case 39:
                        return _context6.finish(32);

                    case 40:
                        return _context6.abrupt('return', response);

                    case 41:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this, [[7, 28, 32, 40], [11, 20], [33,, 35, 39]]);
    }));

    return function resolveImports(_x13, _x14) {
        return _ref6.apply(this, arguments);
    };
}();

var combineSource = function () {
    var _ref7 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(fileRoot, sources) {
        var fn, iline, ir, matches, match, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, fileName, source, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _match, subSorce, response;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        fn = void 0, iline = void 0, ir = void 0;
                        matches = [];

                        ir = /^import*\ [\'\"](.+)[\'\"]\;/gm;
                        match = null;
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context7.prev = 7;
                        _iterator2 = Object.keys(sources)[Symbol.iterator]();

                    case 9:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context7.next = 60;
                            break;
                        }

                        fileName = _step2.value;
                        source = sources[fileName].content;

                        while (match = ir.exec(source)) {
                            matches.push(match);
                        }
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context7.prev = 16;
                        _iterator3 = matches[Symbol.iterator]();

                    case 18:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context7.next = 43;
                            break;
                        }

                        _match = _step3.value;

                        iline = _match[0];
                        if (validUrl.isUri(fileRoot)) {
                            fn = url.resolve(fileRoot, _match[1]);
                        } else {
                            fn = _match[1];
                        }
                        _context7.prev = 22;
                        subSorce = {};
                        _context7.next = 26;
                        return resolveImports(fileRoot, fn);

                    case 26:
                        response = _context7.sent;

                        sources[fileName].content = sources[fileName].content.replace(iline, 'import \'' + response.filename + '\';');
                        subSorce[response.filename] = { content: response.content };
                        _context7.t0 = Object;
                        _context7.next = 32;
                        return combineSource(response.fileRoot, subSorce);

                    case 32:
                        _context7.t1 = _context7.sent;
                        _context7.t2 = sources;
                        sources = _context7.t0.assign.call(_context7.t0, _context7.t1, _context7.t2);
                        _context7.next = 40;
                        break;

                    case 37:
                        _context7.prev = 37;
                        _context7.t3 = _context7['catch'](22);
                        throw _context7.t3;

                    case 40:
                        _iteratorNormalCompletion3 = true;
                        _context7.next = 18;
                        break;

                    case 43:
                        _context7.next = 49;
                        break;

                    case 45:
                        _context7.prev = 45;
                        _context7.t4 = _context7['catch'](16);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context7.t4;

                    case 49:
                        _context7.prev = 49;
                        _context7.prev = 50;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 52:
                        _context7.prev = 52;

                        if (!_didIteratorError3) {
                            _context7.next = 55;
                            break;
                        }

                        throw _iteratorError3;

                    case 55:
                        return _context7.finish(52);

                    case 56:
                        return _context7.finish(49);

                    case 57:
                        _iteratorNormalCompletion2 = true;
                        _context7.next = 9;
                        break;

                    case 60:
                        _context7.next = 66;
                        break;

                    case 62:
                        _context7.prev = 62;
                        _context7.t5 = _context7['catch'](7);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context7.t5;

                    case 66:
                        _context7.prev = 66;
                        _context7.prev = 67;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 69:
                        _context7.prev = 69;

                        if (!_didIteratorError2) {
                            _context7.next = 72;
                            break;
                        }

                        throw _iteratorError2;

                    case 72:
                        return _context7.finish(69);

                    case 73:
                        return _context7.finish(66);

                    case 74:
                        return _context7.abrupt('return', sources);

                    case 75:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this, [[7, 62, 66, 74], [16, 45, 49, 57], [22, 37], [50,, 52, 56], [67,, 69, 73]]);
    }));

    return function combineSource(_x15, _x16) {
        return _ref7.apply(this, arguments);
    };
}();

var ClientSelector = function (_React$Component) {
    inherits(ClientSelector, _React$Component);

    function ClientSelector(props) {
        classCallCheck(this, ClientSelector);

        var _this = possibleConstructorReturn(this, (ClientSelector.__proto__ || Object.getPrototypeOf(ClientSelector)).call(this, props));

        _this.state = {
            selectedEnv: atom.config.get('etheratom.executionEnv')
        };
        _this._handleChange = _this._handleChange.bind(_this);
        return _this;
    }

    createClass(ClientSelector, [{
        key: '_handleChange',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                atom.config.set('etheratom.executionEnv', event.target.value);
                                this.setState({ selectedEnv: event.target.value });

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _handleChange(_x) {
                return _ref.apply(this, arguments);
            }

            return _handleChange;
        }()
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var clients = this.props.clients;

            return React.createElement(
                'div',
                { 'class': 'client-select' },
                React.createElement(
                    'form',
                    { 'class': 'row' },
                    React.createElement('span', { 'class': 'icon icon-plug' }),
                    React.createElement(
                        'div',
                        { 'class': 'clients' },
                        clients.map(function (client) {
                            return React.createElement(
                                'div',
                                { 'class': 'client-input' },
                                React.createElement('input', {
                                    type: 'radio', 'class': 'input-radio',
                                    value: client.provider,
                                    onChange: _this2._handleChange,
                                    checked: _this2.state.selectedEnv === client.provider
                                }),
                                React.createElement(
                                    'label',
                                    { 'class': 'input-label inline-block highlight' },
                                    React.createElement(
                                        'span',
                                        null,
                                        client.desc
                                    )
                                )
                            );
                        })
                    )
                )
            );
        }
    }]);
    return ClientSelector;
}(React.Component);

var mapStateToProps = function mapStateToProps(_ref2) {
    var clientReducer = _ref2.clientReducer;
    var clients = clientReducer.clients;

    return { clients: clients };
};

var ClientSelector$1 = reactRedux.connect(mapStateToProps, {})(ClientSelector);

// Copyright 2018 Etheratom Authors
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

var SET_COMPILING = 'set_compiling';
var SET_COMPILED = 'set_compiled';
var SET_PARAMS = 'set_params';
var ADD_INTERFACE = 'add_interface';
var SET_INSTANCE = 'set_instance';
var SET_DEPLOYED = 'set_deployed';
var SET_GAS_LIMIT = 'set_gas_limit';

var SET_COINBASE = 'set_coinbase';
var SET_PASSWORD = 'set_password';
var SET_ACCOUNTS = 'set_accounts';

var SET_ERRORS = 'set_errors';

// Ethereum client events
var ADD_PENDING_TRANSACTION = 'add_pending_transaction';
var ADD_EVENTS = 'add_logs';
var SET_EVENTS = 'set_events';

// Node variables
var SET_SYNC_STATUS = 'set_sync_status';
var SET_SYNCING = 'set_syncing';
var SET_MINING = 'set_mining';
var SET_HASH_RATE = 'set_hash_rate';

var setParamsInput = function setParamsInput(_ref) {
    var contractName = _ref.contractName,
        abi = _ref.abi;

    return function (dispatch) {
        dispatch({ type: SET_PARAMS, payload: { contractName: contractName, abi: abi } });
    };
};

var addInterface = function addInterface(_ref2) {
    var contractName = _ref2.contractName,
        ContractABI = _ref2.ContractABI;

    return function (dispatch) {
        dispatch({ type: ADD_INTERFACE, payload: { contractName: contractName, interface: ContractABI } });
    };
};

var setInstance = function setInstance(_ref3) {
    var contractName = _ref3.contractName,
        instance = _ref3.instance;

    return function (dispatch) {
        dispatch({ type: SET_INSTANCE, payload: { contractName: contractName, instance: instance } });
    };
};

var setDeployed = function setDeployed(_ref4) {
    var contractName = _ref4.contractName,
        deployed = _ref4.deployed;

    return function (dispatch) {
        dispatch({ type: SET_DEPLOYED, payload: { contractName: contractName, deployed: deployed } });
    };
};

var setCoinbase = function setCoinbase(coinbase) {
    return function (dispatch) {
        dispatch({ type: SET_COINBASE, payload: coinbase });
    };
};

var setPassword = function setPassword(_ref) {
    var password = _ref.password;

    return function (dispatch) {
        dispatch({ type: SET_PASSWORD, payload: { password: password } });
    };
};

var setAccounts = function setAccounts(_ref2) {
    var accounts = _ref2.accounts;

    return function (dispatch) {
        dispatch({ type: SET_ACCOUNTS, payload: accounts });
    };
};

var addNewEvents = function addNewEvents(_ref) {
    var payload = _ref.payload;

    return function (dispatch) {
        dispatch({ type: ADD_EVENTS, payload: payload });
    };
};

var setSyncStatus = function setSyncStatus(status) {
    return function (dispatch) {
        dispatch({ type: SET_SYNC_STATUS, payload: status });
    };
};

var setMining = function setMining(mining) {
    return function (dispatch) {
        dispatch({ type: SET_MINING, payload: mining });
    };
};

var setHashrate = function setHashrate(hashrate) {
    return function (dispatch) {
        dispatch({ type: SET_HASH_RATE, payload: hashrate });
    };
};

var GasInput = function (_React$Component) {
    inherits(GasInput, _React$Component);

    function GasInput(props) {
        classCallCheck(this, GasInput);

        var _this = possibleConstructorReturn(this, (GasInput.__proto__ || Object.getPrototypeOf(GasInput)).call(this, props));

        _this.state = {
            gas: props.gas
        };
        return _this;
    }

    createClass(GasInput, [{
        key: 'UNSAFE_componentWillReceiveProps',
        value: function UNSAFE_componentWillReceiveProps(nextProps) {
            var gas = nextProps.gas;

            this.setState({ gas: gas });
        }
    }, {
        key: 'render',
        value: function render() {
            var gasLimit = this.props.gasLimit;
            var contractName = this.props.contractName;

            return React.createElement(
                'form',
                { className: 'gas-estimate-form' },
                React.createElement(
                    'button',
                    { className: 'input text-subtle' },
                    'Gas supply'
                ),
                React.createElement('input', {
                    id: contractName + '_gas',
                    type: 'number',
                    className: 'inputs',
                    value: this.state.gas,
                    onChange: this.props.onChange }),
                React.createElement(
                    'button',
                    { className: 'btn btn-primary' },
                    'Gas Limit : ',
                    gasLimit
                )
            );
        }
    }]);
    return GasInput;
}(React.Component);

var mapStateToProps$1 = function mapStateToProps(_ref) {
    var contract = _ref.contract;
    var compiled = contract.compiled,
        gasLimit = contract.gasLimit;

    return { compiled: compiled, gasLimit: gasLimit };
};

var GasInput$1 = reactRedux.connect(mapStateToProps$1, {})(GasInput);

var InputsForm = function (_React$Component) {
    inherits(InputsForm, _React$Component);

    function InputsForm(props) {
        classCallCheck(this, InputsForm);

        var _this = possibleConstructorReturn(this, (InputsForm.__proto__ || Object.getPrototypeOf(InputsForm)).call(this, props));

        _this._handleChange = _this._handleChange.bind(_this);
        return _this;
    }

    createClass(InputsForm, [{
        key: '_handleChange',
        value: function _handleChange(input, event) {
            input.value = event.target.value;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                contractName = _props.contractName,
                abi = _props.abi;

            return React.createElement(
                'div',
                { id: contractName + '_inputs' },
                abi.type === 'constructor' && abi.inputs.map(function (input, i) {
                    return React.createElement(
                        'form',
                        { key: i, onSubmit: _this2.props.onSubmit },
                        React.createElement(
                            'button',
                            { className: 'input text-subtle' },
                            input.name
                        ),
                        React.createElement('input', {
                            id: i, type: 'text', className: 'inputs', placeholder: input.type,
                            value: input.value,
                            onChange: function onChange(e) {
                                return _this2._handleChange(input, e);
                            }
                        })
                    );
                })
            );
        }
    }]);
    return InputsForm;
}(React.Component);

var mapStateToProps$2 = function mapStateToProps(_ref) {
    var contract = _ref.contract;
    var compiled = contract.compiled;

    return { compiled: compiled };
};

var InputsForm$1 = reactRedux.connect(mapStateToProps$2, { setParamsInput: setParamsInput })(InputsForm);

var CreateButton = function (_React$Component) {
    inherits(CreateButton, _React$Component);

    function CreateButton(props) {
        classCallCheck(this, CreateButton);

        var _this = possibleConstructorReturn(this, (CreateButton.__proto__ || Object.getPrototypeOf(CreateButton)).call(this, props));

        _this.helpers = props.helpers;
        _this.state = {
            constructorParams: undefined,
            coinbase: props.coinbase,
            password: props.password,
            atAddress: undefined
        };
        _this._handleAtAddressChange = _this._handleAtAddressChange.bind(_this);
        _this._handleSubmit = _this._handleSubmit.bind(_this);
        return _this;
    }

    createClass(CreateButton, [{
        key: 'componentDidMount',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var abi, inputs, abiObj;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                abi = this.props.abi;
                                inputs = [];

                                for (abiObj in abi) {
                                    if (abi[abiObj].type === 'constructor' && abi[abiObj].inputs.length > 0) {
                                        inputs = abi[abiObj].inputs;
                                    }
                                }
                                this.setState({ constructorParams: inputs });

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function componentDidMount() {
                return _ref.apply(this, arguments);
            }

            return componentDidMount;
        }()
    }, {
        key: '_handleAtAddressChange',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.setState({ atAddress: event.target.value });

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _handleAtAddressChange(_x) {
                return _ref2.apply(this, arguments);
            }

            return _handleAtAddressChange;
        }()
    }, {
        key: '_handleSubmit',
        value: function () {
            var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this2 = this;

                var _props, abi, bytecode, contractName, gas, coinbase, password, atAddress, contractInterface, _constructor, params, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, input, contract, contractInstance;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                _props = this.props, abi = _props.abi, bytecode = _props.bytecode, contractName = _props.contractName, gas = _props.gas, coinbase = _props.coinbase, password = _props.password;
                                atAddress = this.state.atAddress;
                                contractInterface = this.props.interfaces[contractName].interface;
                                _constructor = contractInterface.find(function (interfaceItem) {
                                    return interfaceItem.type === 'constructor';
                                });
                                params = [];

                                if (!_constructor) {
                                    _context3.next = 26;
                                    break;
                                }

                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context3.prev = 10;

                                for (_iterator = _constructor.inputs[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    input = _step.value;

                                    if (input.value) {
                                        params.push(input);
                                    }
                                }
                                _context3.next = 18;
                                break;

                            case 14:
                                _context3.prev = 14;
                                _context3.t0 = _context3['catch'](10);
                                _didIteratorError = true;
                                _iteratorError = _context3.t0;

                            case 18:
                                _context3.prev = 18;
                                _context3.prev = 19;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 21:
                                _context3.prev = 21;

                                if (!_didIteratorError) {
                                    _context3.next = 24;
                                    break;
                                }

                                throw _iteratorError;

                            case 24:
                                return _context3.finish(21);

                            case 25:
                                return _context3.finish(18);

                            case 26:
                                _context3.next = 28;
                                return this.helpers.create({ coinbase: coinbase, password: password, atAddress: atAddress, abi: abi, bytecode: bytecode, contractName: contractName, gas: gas });

                            case 28:
                                contract = _context3.sent;

                                this.props.setInstance({ contractName: contractName, instance: Object.assign({}, contract) });

                                if (atAddress) {
                                    _context3.next = 42;
                                    break;
                                }

                                _context3.next = 33;
                                return this.helpers.deploy(contract, params);

                            case 33:
                                contractInstance = _context3.sent;

                                this.props.setDeployed({ contractName: contractName, deployed: true });
                                contractInstance.on('address', function (address) {
                                    contract.options.address = address;
                                    _this2.props.setInstance({ contractName: contractName, instance: Object.assign({}, contract) });
                                });
                                contractInstance.on('transactionHash', function (transactionHash) {
                                    contract.transactionHash = transactionHash;
                                    _this2.props.setInstance({ contractName: contractName, instance: Object.assign({}, contract) });
                                });
                                contractInstance.on('error', function (error) {
                                    _this2.helpers.showPanelError(error);
                                });
                                contractInstance.on('instance', function (instance) {
                                    instance.events.allEvents({ fromBlock: 'latest' }).on('logs', function (logs) {
                                        _this2.props.addNewEvents({ payload: logs });
                                    }).on('data', function (data) {
                                        _this2.props.addNewEvents({ payload: data });
                                    }).on('changed', function (changed) {
                                        _this2.props.addNewEvents({ payload: changed });
                                    }).on('error', function (error) {
                                        console.log(error);
                                    });
                                });
                                contractInstance.on('error', function (error) {
                                    _this2.helpers.showPanelError(error);
                                });
                                _context3.next = 46;
                                break;

                            case 42:
                                contract.options.address = atAddress;
                                this.props.setDeployed({ contractName: contractName, deployed: true });
                                this.props.setInstance({ contractName: contractName, instance: Object.assign({}, contract) });
                                contract.events.allEvents({ fromBlock: 'latest' }).on('logs', function (logs) {
                                    _this2.props.addNewEvents({ payload: logs });
                                }).on('data', function (data) {
                                    _this2.props.addNewEvents({ payload: data });
                                }).on('changed', function (changed) {
                                    _this2.props.addNewEvents({ payload: changed });
                                }).on('error', function (error) {
                                    console.log(error);
                                });

                            case 46:
                                _context3.next = 52;
                                break;

                            case 48:
                                _context3.prev = 48;
                                _context3.t1 = _context3['catch'](0);

                                console.log(_context3.t1);
                                this.helpers.showPanelError(_context3.t1);

                            case 52:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[0, 48], [10, 14, 18, 26], [19,, 21, 25]]);
            }));

            function _handleSubmit() {
                return _ref3.apply(this, arguments);
            }

            return _handleSubmit;
        }()
    }, {
        key: 'render',
        value: function render() {
            var contractName = this.props.contractName;

            return React.createElement(
                'form',
                { onSubmit: this._handleSubmit, className: 'padded' },
                React.createElement('input', {
                    type: 'submit',
                    value: 'Deploy to blockchain',
                    ref: contractName,
                    className: 'btn btn-primary inline-block-tight' }),
                React.createElement('input', {
                    type: 'text', placeholder: 'at:', className: 'inputs',
                    value: this.state.atAddress,
                    onChange: this._handleAtAddressChange
                })
            );
        }
    }]);
    return CreateButton;
}(React.Component);

var mapStateToProps$3 = function mapStateToProps(_ref4) {
    var contract = _ref4.contract,
        account = _ref4.account;
    var compiled = contract.compiled,
        interfaces = contract.interfaces;
    var coinbase = account.coinbase,
        password = account.password;

    return { compiled: compiled, interfaces: interfaces, coinbase: coinbase, password: password };
};

var CreateButton$1 = reactRedux.connect(mapStateToProps$3, { setDeployed: setDeployed, setInstance: setInstance, addNewEvents: addNewEvents })(CreateButton);

var ContractCompiled = function (_React$Component) {
    inherits(ContractCompiled, _React$Component);

    function ContractCompiled(props) {
        classCallCheck(this, ContractCompiled);

        var _this = possibleConstructorReturn(this, (ContractCompiled.__proto__ || Object.getPrototypeOf(ContractCompiled)).call(this, props));

        _this.helpers = props.helpers;
        _this.state = {
            estimatedGas: 9000000,
            ContractABI: props.interfaces[props.contractName].interface
        };
        _this._handleGasChange = _this._handleGasChange.bind(_this);
        _this._handleInput = _this._handleInput.bind(_this);
        return _this;
    }

    createClass(ContractCompiled, [{
        key: 'componentDidMount',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _props, coinbase, bytecode, gas;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _props = this.props, coinbase = _props.coinbase, bytecode = _props.bytecode;
                                _context.next = 4;
                                return this.helpers.getGasEstimate(coinbase, bytecode);

                            case 4:
                                gas = _context.sent;

                                this.setState({ estimatedGas: gas });
                                _context.next = 12;
                                break;

                            case 8:
                                _context.prev = 8;
                                _context.t0 = _context['catch'](0);

                                console.log(_context.t0);
                                this.helpers.showPanelError(_context.t0);

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 8]]);
            }));

            function componentDidMount() {
                return _ref.apply(this, arguments);
            }

            return componentDidMount;
        }()
    }, {
        key: '_handleGasChange',
        value: function _handleGasChange(event) {
            this.setState({ estimatedGas: event.target.value });
        }
    }, {
        key: '_handleInput',
        value: function _handleInput() {
            var contractName = this.props.contractName;
            var ContractABI = this.state.ContractABI;

            this.props.addInterface({ contractName: contractName, ContractABI: ContractABI });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props2 = this.props,
                contractName = _props2.contractName,
                bytecode = _props2.bytecode,
                index = _props2.index;
            var _state = this.state,
                estimatedGas = _state.estimatedGas,
                ContractABI = _state.ContractABI;

            return React.createElement(
                'div',
                { 'class': 'contract-content', key: index },
                React.createElement(
                    'span',
                    { 'class': 'contract-name inline-block highlight-success' },
                    contractName
                ),
                React.createElement(
                    'div',
                    { 'class': 'byte-code' },
                    React.createElement(
                        'pre',
                        { 'class': 'large-code' },
                        JSON.stringify(bytecode)
                    )
                ),
                React.createElement(
                    'div',
                    { 'class': 'abi-definition' },
                    React.createElement(
                        reactTabs.Tabs,
                        null,
                        React.createElement(
                            reactTabs.TabList,
                            null,
                            React.createElement(
                                'div',
                                { 'class': 'tab_btns' },
                                React.createElement(
                                    reactTabs.Tab,
                                    null,
                                    React.createElement(
                                        'div',
                                        { 'class': 'btn' },
                                        'Interface'
                                    )
                                ),
                                React.createElement(
                                    reactTabs.Tab,
                                    null,
                                    React.createElement(
                                        'div',
                                        { 'class': 'btn' },
                                        'Interface Object'
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            reactTabs.TabPanel,
                            null,
                            React.createElement(
                                'pre',
                                { 'class': 'large-code' },
                                JSON.stringify(ContractABI)
                            )
                        ),
                        React.createElement(
                            reactTabs.TabPanel,
                            null,
                            React.createElement(ReactJson, {
                                src: ContractABI,
                                theme: 'chalk',
                                displayDataTypes: false,
                                name: false,
                                collapsed: 2,
                                collapseStringsAfterLength: 32,
                                iconStyle: 'triangle'
                            })
                        )
                    )
                ),
                ContractABI.map(function (abi, i) {
                    return React.createElement(InputsForm$1, { key: i, contractName: contractName, abi: abi, onSubmit: _this2._handleInput });
                }),
                React.createElement(GasInput$1, { contractName: contractName, gas: estimatedGas, onChange: this._handleGasChange }),
                React.createElement(CreateButton$1, {
                    contractName: contractName,
                    bytecode: bytecode,
                    abi: ContractABI,
                    gas: estimatedGas,
                    helpers: this.helpers
                })
            );
        }
    }]);
    return ContractCompiled;
}(React.Component);

var mapStateToProps$4 = function mapStateToProps(_ref2) {
    var account = _ref2.account,
        contract = _ref2.contract;
    var compiled = contract.compiled,
        interfaces = contract.interfaces;
    var coinbase = account.coinbase;

    return { compiled: compiled, interfaces: interfaces, coinbase: coinbase };
};

var ContractCompiled$1 = reactRedux.connect(mapStateToProps$4, { addInterface: addInterface })(ContractCompiled);

var FunctionABI = function (_React$Component) {
    inherits(FunctionABI, _React$Component);

    function FunctionABI(props) {
        classCallCheck(this, FunctionABI);

        var _this = possibleConstructorReturn(this, (FunctionABI.__proto__ || Object.getPrototypeOf(FunctionABI)).call(this, props));

        _this.helpers = props.helpers;
        _this._handleChange = _this._handleChange.bind(_this);
        _this._handlePayableValue = _this._handlePayableValue.bind(_this);
        _this._handleFallback = _this._handleFallback.bind(_this);
        _this._handleSubmit = _this._handleSubmit.bind(_this);
        return _this;
    }

    createClass(FunctionABI, [{
        key: '_handleChange',
        value: function _handleChange(input, event) {
            input.value = event.target.value;
        }
    }, {
        key: '_handlePayableValue',
        value: function _handlePayableValue(abi, event) {
            abi.payableValue = event.target.value;
        }
    }, {
        key: '_handleFallback',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(abiItem) {
                var _props, contractName, coinbase, password, instances, contract, result;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _props = this.props, contractName = _props.contractName, coinbase = _props.coinbase, password = _props.password, instances = _props.instances;
                                contract = instances[contractName];
                                _context.prev = 2;
                                _context.next = 5;
                                return this.helpers.call({ coinbase: coinbase, password: password, contract: contract, abiItem: abiItem });

                            case 5:
                                result = _context.sent;

                                this.helpers.showOutput({ address: contract.options.address, data: result });
                                _context.next = 13;
                                break;

                            case 9:
                                _context.prev = 9;
                                _context.t0 = _context['catch'](2);

                                console.log(_context.t0);
                                this.helpers.showPanelError(_context.t0);

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[2, 9]]);
            }));

            function _handleFallback(_x) {
                return _ref.apply(this, arguments);
            }

            return _handleFallback;
        }()
    }, {
        key: '_handleSubmit',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(methodItem) {
                var _props2, contractName, coinbase, password, instances, contract, params, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, input, result;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                _props2 = this.props, contractName = _props2.contractName, coinbase = _props2.coinbase, password = _props2.password, instances = _props2.instances;
                                contract = instances[contractName];
                                params = [];
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context2.prev = 7;

                                for (_iterator = methodItem.inputs[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    input = _step.value;

                                    if (input.value) {
                                        params.push(input);
                                    }
                                }
                                _context2.next = 15;
                                break;

                            case 11:
                                _context2.prev = 11;
                                _context2.t0 = _context2['catch'](7);
                                _didIteratorError = true;
                                _iteratorError = _context2.t0;

                            case 15:
                                _context2.prev = 15;
                                _context2.prev = 16;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 18:
                                _context2.prev = 18;

                                if (!_didIteratorError) {
                                    _context2.next = 21;
                                    break;
                                }

                                throw _iteratorError;

                            case 21:
                                return _context2.finish(18);

                            case 22:
                                return _context2.finish(15);

                            case 23:
                                _context2.next = 25;
                                return this.helpers.call({ coinbase: coinbase, password: password, contract: contract, abiItem: methodItem, params: params });

                            case 25:
                                result = _context2.sent;

                                this.helpers.showOutput({ address: contract.options.address, data: result });
                                _context2.next = 33;
                                break;

                            case 29:
                                _context2.prev = 29;
                                _context2.t1 = _context2['catch'](0);

                                console.log(_context2.t1);
                                this.helpers.showPanelError(_context2.t1);

                            case 33:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 29], [7, 11, 15, 23], [16,, 18, 22]]);
            }));

            function _handleSubmit(_x2) {
                return _ref2.apply(this, arguments);
            }

            return _handleSubmit;
        }()
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props3 = this.props,
                contractName = _props3.contractName,
                interfaces = _props3.interfaces;

            var ContractABI = interfaces[contractName].interface;
            return React.createElement(
                'div',
                { className: 'abi-container' },
                ContractABI.map(function (abi, i) {
                    if (abi.type === 'function') {
                        return React.createElement(
                            'div',
                            { className: 'function-container' },
                            React.createElement(
                                'form',
                                { key: i, onSubmit: function onSubmit() {
                                        _this2._handleSubmit(abi);
                                    } },
                                React.createElement('input', { type: 'submit', value: abi.name, className: 'text-subtle call-button' }),
                                abi.inputs.map(function (input, j) {
                                    return React.createElement('input', {
                                        type: 'text',
                                        className: 'call-button-values',
                                        placeholder: input.name + ' ' + input.type,
                                        value: input.value,
                                        onChange: function onChange(event) {
                                            return _this2._handleChange(input, event);
                                        },
                                        key: j
                                    });
                                }),
                                abi.payable === true && React.createElement('input', {
                                    className: 'call-button-values',
                                    type: 'number',
                                    placeholder: 'payable value',
                                    onChange: function onChange(event) {
                                        return _this2._handlePayableValue(abi, event);
                                    }
                                })
                            )
                        );
                    }
                    if (abi.type === 'fallback') {
                        return React.createElement(
                            'div',
                            { className: 'fallback-container' },
                            React.createElement(
                                'form',
                                { key: i, onSubmit: function onSubmit() {
                                        _this2._handleFallback(abi);
                                    } },
                                React.createElement(
                                    'button',
                                    { className: 'btn' },
                                    'fallback'
                                ),
                                abi.payable === true && React.createElement('input', {
                                    className: 'call-button-values',
                                    type: 'number',
                                    placeholder: 'send ether to contract',
                                    onChange: function onChange(event) {
                                        return _this2._handlePayableValue(abi, event);
                                    }
                                })
                            )
                        );
                    }
                })
            );
        }
    }]);
    return FunctionABI;
}(React.Component);

var mapStateToProps$5 = function mapStateToProps(_ref3) {
    var contract = _ref3.contract,
        account = _ref3.account;
    var compiled = contract.compiled,
        interfaces = contract.interfaces,
        instances = contract.instances;
    var coinbase = account.coinbase,
        password = account.password;

    return { compiled: compiled, interfaces: interfaces, instances: instances, coinbase: coinbase, password: password };
};

var FunctionABI$1 = reactRedux.connect(mapStateToProps$5, {})(FunctionABI);

var ContractExecution = function (_React$Component) {
    inherits(ContractExecution, _React$Component);

    function ContractExecution(props) {
        classCallCheck(this, ContractExecution);

        var _this = possibleConstructorReturn(this, (ContractExecution.__proto__ || Object.getPrototypeOf(ContractExecution)).call(this, props));

        _this.helpers = props.helpers;
        return _this;
    }

    createClass(ContractExecution, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                contractName = _props.contractName,
                bytecode = _props.bytecode,
                index = _props.index,
                instances = _props.instances,
                interfaces = _props.interfaces;

            var contract = instances[contractName];
            var ContractABI = interfaces[contractName].interface;
            return React.createElement(
                'div',
                { 'class': 'contract-content', key: index },
                React.createElement(
                    'span',
                    { 'class': 'contract-name inline-block highlight-success' },
                    contractName
                ),
                React.createElement(
                    'div',
                    { 'class': 'byte-code' },
                    React.createElement(
                        'pre',
                        { 'class': 'large-code' },
                        JSON.stringify(bytecode)
                    )
                ),
                React.createElement(
                    'div',
                    { 'class': 'abi-definition' },
                    React.createElement(
                        reactTabs.Tabs,
                        null,
                        React.createElement(
                            reactTabs.TabList,
                            null,
                            React.createElement(
                                'div',
                                { 'class': 'tab_btns' },
                                React.createElement(
                                    reactTabs.Tab,
                                    null,
                                    React.createElement(
                                        'div',
                                        { 'class': 'btn' },
                                        'Interface'
                                    )
                                ),
                                React.createElement(
                                    reactTabs.Tab,
                                    null,
                                    React.createElement(
                                        'div',
                                        { 'class': 'btn' },
                                        'Interface Object'
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            reactTabs.TabPanel,
                            null,
                            React.createElement(
                                'pre',
                                { 'class': 'large-code' },
                                JSON.stringify(ContractABI)
                            )
                        ),
                        React.createElement(
                            reactTabs.TabPanel,
                            null,
                            React.createElement(ReactJson, {
                                src: ContractABI,
                                theme: 'ocean',
                                displayDataTypes: false,
                                name: false,
                                collapsed: 2
                            })
                        )
                    )
                ),
                contract.transactionHash && React.createElement(
                    'div',
                    { id: contractName + '_txHash' },
                    React.createElement(
                        'span',
                        { 'class': 'inline-block highlight' },
                        'Transaction hash:'
                    ),
                    React.createElement(
                        'pre',
                        { 'class': 'large-code' },
                        contract.transactionHash
                    )
                ),
                !contract.options.address && React.createElement(
                    'div',
                    { id: contractName + '_stat' },
                    React.createElement(
                        'span',
                        { 'class': 'stat-mining stat-mining-align' },
                        'waiting to be mined'
                    ),
                    React.createElement('span', { 'class': 'loading loading-spinner-tiny inline-block stat-mining-align' })
                ),
                contract.options.address && React.createElement(
                    'div',
                    { id: contractName + '_stat' },
                    React.createElement(
                        'span',
                        { 'class': 'inline-block highlight' },
                        'Mined at:'
                    ),
                    React.createElement(
                        'pre',
                        { 'class': 'large-code' },
                        contract.options.address
                    )
                ),
                ContractABI.map(function (abi) {
                    return React.createElement(InputsForm$1, { contractName: contractName, abi: abi });
                }),
                React.createElement(FunctionABI$1, { contractName: contractName, helpers: this.helpers })
            );
        }
    }]);
    return ContractExecution;
}(React.Component);

var mapStateToProps$6 = function mapStateToProps(_ref) {
    var contract = _ref.contract;
    var interfaces = contract.interfaces,
        instances = contract.instances;

    return { interfaces: interfaces, instances: instances };
};

var ContractExecution$1 = reactRedux.connect(mapStateToProps$6, {})(ContractExecution);

var ErrorView = function (_React$Component) {
    inherits(ErrorView, _React$Component);

    function ErrorView(props) {
        classCallCheck(this, ErrorView);
        return possibleConstructorReturn(this, (ErrorView.__proto__ || Object.getPrototypeOf(ErrorView)).call(this, props));
    }

    createClass(ErrorView, [{
        key: 'render',
        value: function render() {
            var errormsg = this.props.errormsg;

            return React.createElement(
                'ul',
                { className: 'error-list block' },
                errormsg.length > 0 && errormsg.map(function (msg, i) {
                    return React.createElement(
                        'li',
                        { key: i, className: 'list-item' },
                        msg.severity === 'warning' && React.createElement(
                            'span',
                            { className: 'icon icon-alert text-warning' },
                            msg.formattedMessage || msg.message
                        ),
                        msg.severity === 'error' && React.createElement(
                            'span',
                            { className: 'icon icon-bug text-error' },
                            msg.formattedMessage || msg.message
                        )
                    );
                })
            );
        }
    }]);
    return ErrorView;
}(React.Component);

var mapStateToProps$7 = function mapStateToProps(_ref) {
    var errors = _ref.errors;
    var errormsg = errors.errormsg;

    return { errormsg: errormsg };
};

var ErrorView$1 = reactRedux.connect(mapStateToProps$7, {})(ErrorView);

var CollapsedFile = function (_React$Component) {
    inherits(CollapsedFile, _React$Component);

    function CollapsedFile(props) {
        classCallCheck(this, CollapsedFile);

        var _this = possibleConstructorReturn(this, (CollapsedFile.__proto__ || Object.getPrototypeOf(CollapsedFile)).call(this, props));

        _this.helpers = props.helpers;
        _this.state = {
            isOpened: false,
            toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
            toggleBtnTxt: 'Expand'
        };
        _this._toggleCollapse = _this._toggleCollapse.bind(_this);
        return _this;
    }

    createClass(CollapsedFile, [{
        key: '_toggleCollapse',
        value: function _toggleCollapse() {
            var isOpened = this.state.isOpened;

            this.setState({ isOpened: !isOpened });
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
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                isOpened = _state.isOpened,
                toggleBtnStyle = _state.toggleBtnStyle,
                toggleBtnTxt = _state.toggleBtnTxt;
            var _props = this.props,
                fileName = _props.fileName,
                compiled = _props.compiled,
                deployed = _props.deployed,
                compiling = _props.compiling,
                interfaces = _props.interfaces;

            return React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    { 'class': 'label file-collapse-label' },
                    React.createElement(
                        'h4',
                        { 'class': 'text-success' },
                        fileName
                    ),
                    React.createElement(
                        'button',
                        { 'class': toggleBtnStyle, onClick: this._toggleCollapse },
                        toggleBtnTxt
                    )
                ),
                React.createElement(
                    reactCollapse.Collapse,
                    { isOpened: isOpened },
                    Object.keys(compiled.contracts[fileName]).map(function (contractName, index) {
                        var bytecode = compiled.contracts[fileName][contractName].evm.bytecode.object;
                        return React.createElement(
                            'div',
                            { id: contractName, 'class': 'contract-container' },
                            !deployed[contractName] && interfaces !== null && interfaces[contractName] && compiling === false && React.createElement(ContractCompiled$1, {
                                contractName: contractName,
                                bytecode: bytecode,
                                index: index,
                                helpers: _this2.helpers
                            }),
                            deployed[contractName] && React.createElement(ContractExecution$1, {
                                contractName: contractName,
                                bytecode: bytecode,
                                index: index,
                                helpers: _this2.helpers
                            })
                        );
                    })
                )
            );
        }
    }]);
    return CollapsedFile;
}(React.Component);

var Contracts = function (_React$Component2) {
    inherits(Contracts, _React$Component2);

    function Contracts(props) {
        classCallCheck(this, Contracts);

        var _this3 = possibleConstructorReturn(this, (Contracts.__proto__ || Object.getPrototypeOf(Contracts)).call(this, props));

        _this3.helpers = props.helpers;
        return _this3;
    }

    createClass(Contracts, [{
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _props2 = this.props,
                compiled = _props2.compiled,
                deployed = _props2.deployed,
                compiling = _props2.compiling,
                interfaces = _props2.interfaces;

            return React.createElement(
                reactRedux.Provider,
                { store: this.props.store },
                React.createElement(
                    'div',
                    { id: 'compiled-code', 'class': 'compiled-code' },
                    compiled && Object.keys(compiled.contracts).map(function (fileName, index) {
                        return React.createElement(CollapsedFile, {
                            fileName: fileName,
                            compiled: compiled,
                            deployed: deployed,
                            compiling: compiling,
                            interfaces: interfaces,
                            helpers: _this4.helpers
                        });
                    }),
                    !compiled && React.createElement(
                        'h2',
                        { 'class': 'text-warning no-header' },
                        'No compiled contract!'
                    ),
                    React.createElement(
                        'div',
                        { id: 'compiled-error', 'class': 'error-container' },
                        React.createElement(ErrorView$1, null)
                    )
                )
            );
        }
    }]);
    return Contracts;
}(React.Component);

var mapStateToProps$8 = function mapStateToProps(_ref) {
    var contract = _ref.contract;
    var compiled = contract.compiled,
        deployed = contract.deployed,
        compiling = contract.compiling,
        interfaces = contract.interfaces;

    return { compiled: compiled, deployed: deployed, compiling: compiling, interfaces: interfaces };
};

var Contracts$1 = reactRedux.connect(mapStateToProps$8, { addInterface: addInterface })(Contracts);

var TxAnalyzer = function (_React$Component) {
    inherits(TxAnalyzer, _React$Component);

    function TxAnalyzer(props) {
        classCallCheck(this, TxAnalyzer);

        var _this = possibleConstructorReturn(this, (TxAnalyzer.__proto__ || Object.getPrototypeOf(TxAnalyzer)).call(this, props));

        _this.helpers = props.helpers;
        _this.state = {
            txHash: undefined,
            txAnalysis: undefined,
            toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
            isOpened: false
        };
        _this._handleTxHashChange = _this._handleTxHashChange.bind(_this);
        _this._handleTxHashSubmit = _this._handleTxHashSubmit.bind(_this);
        _this._toggleCollapse = _this._toggleCollapse.bind(_this);
        return _this;
    }

    createClass(TxAnalyzer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var pendingTransactions = this.props.pendingTransactions;

            if (pendingTransactions.length < 10) {
                this.setState({
                    isOpened: true,
                    toggleBtnStyle: 'btn btn-success icon icon-fold inline-block-tight'
                });
            }
        }
    }, {
        key: '_toggleCollapse',
        value: function _toggleCollapse() {
            var isOpened = this.state.isOpened;

            this.setState({ isOpened: !isOpened });
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
    }, {
        key: '_handleTxHashChange',
        value: function _handleTxHashChange(event) {
            this.setState({ txHash: event.target.value });
        }
    }, {
        key: '_handleTxHashSubmit',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var txHash, txAnalysis;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                txHash = this.state.txHash;

                                if (!txHash) {
                                    _context.next = 12;
                                    break;
                                }

                                _context.prev = 2;
                                _context.next = 5;
                                return this.helpers.getTxAnalysis(txHash);

                            case 5:
                                txAnalysis = _context.sent;

                                this.setState({ txAnalysis: txAnalysis });
                                _context.next = 12;
                                break;

                            case 9:
                                _context.prev = 9;
                                _context.t0 = _context['catch'](2);

                                console.log(_context.t0);

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[2, 9]]);
            }));

            function _handleTxHashSubmit() {
                return _ref.apply(this, arguments);
            }

            return _handleTxHashSubmit;
        }()
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                toggleBtnStyle = _state.toggleBtnStyle,
                isOpened = _state.isOpened;
            var pendingTransactions = this.props.pendingTransactions;

            var transactions = pendingTransactions.slice();
            transactions.reverse();
            return React.createElement(
                'div',
                { className: 'tx-analyzer' },
                React.createElement(
                    'div',
                    { className: 'flex-row' },
                    React.createElement(
                        'form',
                        { className: 'flex-row', onSubmit: this._handleTxHashSubmit },
                        React.createElement(
                            'div',
                            { className: 'inline-block' },
                            React.createElement('input', { type: 'text', name: 'txhash', value: this.state.txHash, onChange: this._handleTxHashChange, placeholder: 'Transaction hash', 'class': 'input-search' })
                        ),
                        React.createElement(
                            'div',
                            { className: 'inline-block' },
                            React.createElement('input', { type: 'submit', value: 'Analyze', className: 'btn' })
                        )
                    ),
                    React.createElement(
                        'button',
                        { className: toggleBtnStyle, onClick: this._toggleCollapse },
                        'Transaction List'
                    )
                ),
                React.createElement(
                    reactCollapse.Collapse,
                    { isOpened: isOpened },
                    transactions.length > 0 && React.createElement(VirtualList, {
                        itemCount: transactions.length,
                        itemSize: 30,
                        'class': 'tx-list-container',
                        overscanCount: 10,
                        renderItem: function renderItem(_ref2) {
                            var index = _ref2.index;
                            return React.createElement(
                                'div',
                                { 'class': 'tx-list-item' },
                                React.createElement(
                                    'span',
                                    { 'class': 'padded text-warning' },
                                    transactions[index]
                                )
                            );
                        }
                    })
                ),
                this.state.txAnalysis && this.state.txAnalysis.transaction && React.createElement(
                    'div',
                    { className: 'block' },
                    React.createElement(
                        'h2',
                        { className: 'block highlight-info tx-header' },
                        'Transaction'
                    ),
                    React.createElement(ReactJson, {
                        src: this.state.txAnalysis.transaction,
                        theme: 'chalk',
                        displayDataTypes: false,
                        name: false,
                        collapseStringsAfterLength: 64,
                        iconStyle: 'triangle'
                    })
                ),
                this.state.txAnalysis && this.state.txAnalysis.transactionRecipt && React.createElement(
                    'div',
                    { className: 'block' },
                    React.createElement(
                        'h2',
                        { className: 'block highlight-info tx-header' },
                        'Transaction receipt'
                    ),
                    React.createElement(ReactJson, {
                        src: this.state.txAnalysis.transactionRecipt,
                        theme: 'chalk',
                        displayDataTypes: false,
                        name: false,
                        collapseStringsAfterLength: 64,
                        iconStyle: 'triangle'
                    })
                )
            );
        }
    }]);
    return TxAnalyzer;
}(React.Component);

var mapStateToProps$9 = function mapStateToProps(_ref3) {
    var eventReducer = _ref3.eventReducer;
    var pendingTransactions = eventReducer.pendingTransactions;

    return { pendingTransactions: pendingTransactions };
};

var TxAnalyzer$1 = reactRedux.connect(mapStateToProps$9, {})(TxAnalyzer);

var EventItem = function (_React$Component) {
    inherits(EventItem, _React$Component);

    function EventItem(props) {
        classCallCheck(this, EventItem);

        var _this = possibleConstructorReturn(this, (EventItem.__proto__ || Object.getPrototypeOf(EventItem)).call(this, props));

        _this.state = {
            isOpened: false,
            toggleBtnStyle: 'btn icon icon-unfold inline-block-tight',
            toggleBtnTxt: 'Expand'
        };
        _this._toggleCollapse = _this._toggleCollapse.bind(_this);
        return _this;
    }

    createClass(EventItem, [{
        key: '_toggleCollapse',
        value: function _toggleCollapse() {
            var isOpened = this.state.isOpened;

            this.setState({ isOpened: !isOpened });
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
    }, {
        key: 'render',
        value: function render() {
            var event = this.props.event;
            var _state = this.state,
                isOpened = _state.isOpened,
                toggleBtnStyle = _state.toggleBtnStyle,
                toggleBtnTxt = _state.toggleBtnTxt;

            return React.createElement(
                'li',
                { className: 'event-list-item' },
                React.createElement(
                    'label',
                    { className: 'label event-collapse-label' },
                    React.createElement(
                        'h4',
                        { className: 'padded text-warning' },
                        event.id,
                        ' : ',
                        event.event
                    ),
                    React.createElement(
                        'button',
                        { className: toggleBtnStyle, onClick: this._toggleCollapse },
                        toggleBtnTxt
                    )
                ),
                React.createElement(
                    reactCollapse.Collapse,
                    { isOpened: isOpened },
                    React.createElement(ReactJson, {
                        src: event,
                        theme: 'chalk',
                        displayDataTypes: false,
                        name: false,
                        collapseStringsAfterLength: 64,
                        iconStyle: 'triangle'
                    })
                )
            );
        }
    }]);
    return EventItem;
}(React.Component);

var Events = function (_React$Component) {
    inherits(Events, _React$Component);

    function Events(props) {
        classCallCheck(this, Events);

        var _this = possibleConstructorReturn(this, (Events.__proto__ || Object.getPrototypeOf(Events)).call(this, props));

        _this.helpers = props.helpers;
        return _this;
    }

    createClass(Events, [{
        key: 'render',
        value: function render() {
            var events = this.props.events;

            var events_ = events.slice();
            events_.reverse();
            return React.createElement(
                'div',
                { className: 'events-container select-list' },
                React.createElement(
                    'ul',
                    { className: 'list-group' },
                    events_.length > 0 && events_.map(function (event, i) {
                        return React.createElement(EventItem, { key: i, event: event });
                    }),
                    !(events_.length > 0) && React.createElement(
                        'h2',
                        { className: 'text-warning no-header' },
                        'No events found!'
                    )
                )
            );
        }
    }]);
    return Events;
}(React.Component);

var mapStateToProps$a = function mapStateToProps(_ref) {
    var eventReducer = _ref.eventReducer;
    var events = eventReducer.events;

    return { events: events };
};

var Events$1 = reactRedux.connect(mapStateToProps$a, {})(Events);

var NodeControl = function (_React$Component) {
    inherits(NodeControl, _React$Component);

    function NodeControl(props) {
        classCallCheck(this, NodeControl);

        var _this = possibleConstructorReturn(this, (NodeControl.__proto__ || Object.getPrototypeOf(NodeControl)).call(this, props));

        _this.helpers = props.helpers;
        _this._refreshSync = _this._refreshSync.bind(_this);
        _this.getNodeInfo = _this.getNodeInfo.bind(_this);
        return _this;
    }

    createClass(NodeControl, [{
        key: 'componentDidMount',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.getNodeInfo();

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function componentDidMount() {
                return _ref.apply(this, arguments);
            }

            return componentDidMount;
        }()
    }, {
        key: '_refreshSync',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var accounts;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.helpers.getAccounts();

                            case 2:
                                accounts = _context2.sent;

                                this.props.setAccounts({ accounts: accounts });
                                this.getNodeInfo();

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _refreshSync() {
                return _ref2.apply(this, arguments);
            }

            return _refreshSync;
        }()
    }, {
        key: 'getNodeInfo',
        value: function () {
            var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var syncStat, mining, hashRate;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.helpers.getSyncStat();

                            case 2:
                                syncStat = _context3.sent;

                                this.props.setSyncStatus(syncStat);
                                // get mining status
                                _context3.next = 6;
                                return this.helpers.getMining();

                            case 6:
                                mining = _context3.sent;

                                this.props.setMining(mining);
                                // get hashrate
                                _context3.next = 10;
                                return this.helpers.getHashrate();

                            case 10:
                                hashRate = _context3.sent;

                                this.props.setHashrate(hashRate);

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getNodeInfo() {
                return _ref3.apply(this, arguments);
            }

            return getNodeInfo;
        }()
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                coinbase = _props.coinbase,
                status = _props.status,
                syncing = _props.syncing,
                mining = _props.mining,
                hashRate = _props.hashRate;


            return React.createElement(
                'div',
                { id: 'NodeControl' },
                React.createElement(
                    'ul',
                    { className: 'list-group' },
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Coinbase:'
                        ),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            coinbase
                        )
                    )
                ),
                Object.keys(status).length > 0 && status instanceof Object && React.createElement(
                    'ul',
                    { className: 'list-group' },
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Sync progress:'
                        ),
                        React.createElement('progress', { className: 'inline-block', max: '100', value: (100 * (status.currentBlock / status.highestBlock)).toFixed(2) }),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            (100 * (status.currentBlock / status.highestBlock)).toFixed(2),
                            '%'
                        )
                    ),
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Current Block:'
                        ),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            status.currentBlock
                        )
                    ),
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Highest Block:'
                        ),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            status.highestBlock
                        )
                    ),
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Known States:'
                        ),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            status.knownStates
                        )
                    ),
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Pulled States'
                        ),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            status.pulledStates
                        )
                    ),
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Starting Block:'
                        ),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            status.startingBlock
                        )
                    )
                ),
                !syncing && React.createElement(
                    'ul',
                    { className: 'list-group' },
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Syncing:'
                        ),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            '' + syncing
                        )
                    )
                ),
                React.createElement(
                    'ul',
                    { className: 'list-group' },
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Mining:'
                        ),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            '' + mining
                        )
                    ),
                    React.createElement(
                        'li',
                        { className: 'list-item' },
                        React.createElement(
                            'span',
                            { className: 'inline-block highlight' },
                            'Hashrate:'
                        ),
                        React.createElement(
                            'span',
                            { className: 'inline-block' },
                            hashRate
                        )
                    )
                ),
                React.createElement(
                    'button',
                    { className: 'btn', onClick: this._refreshSync },
                    'Refresh'
                )
            );
        }
    }]);
    return NodeControl;
}(React.Component);

var mapStateToProps$b = function mapStateToProps(_ref4) {
    var account = _ref4.account,
        node = _ref4.node;
    var coinbase = account.coinbase;
    var status = node.status,
        syncing = node.syncing,
        mining = node.mining,
        hashRate = node.hashRate;

    return { coinbase: coinbase, status: status, syncing: syncing, mining: mining, hashRate: hashRate };
};

var NodeControl$1 = reactRedux.connect(mapStateToProps$b, { setAccounts: setAccounts, setSyncStatus: setSyncStatus, setMining: setMining, setHashrate: setHashrate })(NodeControl);

var StaticAnalysis = function (_React$Component) {
    inherits(StaticAnalysis, _React$Component);

    function StaticAnalysis(props) {
        classCallCheck(this, StaticAnalysis);

        var _this = possibleConstructorReturn(this, (StaticAnalysis.__proto__ || Object.getPrototypeOf(StaticAnalysis)).call(this, props));

        _this.helpers = props.helpers;
        _this.anlsRunner = new remixSolidity.CodeAnalysis();
        _this.state = {
            anlsModules: _this.anlsRunner.modules(),
            nodes: _this._getNodes(_this.anlsRunner.modules()),
            checked: [],
            analysis: []
        };
        _this._runAnalysis = _this._runAnalysis.bind(_this);
        return _this;
    }

    createClass(StaticAnalysis, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // Mark all modules checked in the begining
            var nodes = this.state.nodes;

            var checked = [];
            for (var i = 0; i < nodes.length; i++) {
                checked.push(i);
            }
            this.setState({ checked: checked });
        }
    }, {
        key: '_getNodes',
        value: function _getNodes(modules) {
            return modules.map(function (module, i) {
                return Object.assign({}, {}, { value: i, label: module.description, index: i });
            });
        }
    }, {
        key: '_runAnalysis',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var checked, compiled, analysis;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                checked = this.state.checked;
                                compiled = this.props.compiled;

                                if (!(compiled != null)) {
                                    _context.next = 14;
                                    break;
                                }

                                _context.prev = 3;
                                _context.next = 6;
                                return this.getAnalysis(compiled, checked);

                            case 6:
                                analysis = _context.sent;

                                console.log(analysis);
                                this.setState({ analysis: analysis });
                                _context.next = 14;
                                break;

                            case 11:
                                _context.prev = 11;
                                _context.t0 = _context['catch'](3);
                                throw _context.t0;

                            case 14:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 11]]);
            }));

            function _runAnalysis() {
                return _ref.apply(this, arguments);
            }

            return _runAnalysis;
        }()
    }, {
        key: 'getAnalysis',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(compiled, checked) {
                var _this2 = this;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.abrupt('return', new Promise(function (resolve, reject) {
                                    _this2.anlsRunner.run(compiled, checked, function (analysis, error) {
                                        if (error) {
                                            reject(error);
                                            return;
                                        }
                                        resolve(analysis);
                                    });
                                }));

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getAnalysis(_x, _x2) {
                return _ref2.apply(this, arguments);
            }

            return getAnalysis;
        }()
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _state = this.state,
                nodes = _state.nodes,
                analysis = _state.analysis;

            return React.createElement(
                'div',
                { className: 'static-analyzer' },
                React.createElement(CheckboxTree, {
                    nodes: nodes,
                    checked: this.state.checked,
                    expanded: this.state.expanded,
                    onCheck: function onCheck(checked) {
                        return _this3.setState({ checked: checked });
                    },
                    showNodeIcon: false
                }),
                React.createElement(
                    'button',
                    { className: 'btn btn-primary inline-block-tight', onClick: this._runAnalysis },
                    'Run analysis'
                ),
                analysis.length > 0 && analysis.map(function (a) {
                    if (a.report.length > 0) {
                        return React.createElement(
                            'div',
                            { className: 'padded' },
                            a.report.map(function (report, i) {
                                return React.createElement(
                                    'div',
                                    { key: i },
                                    report.location && React.createElement(
                                        'span',
                                        { className: 'text-info' },
                                        report.location,
                                        ' '
                                    ),
                                    report.warning && React.createElement('span', { className: 'text-warning', dangerouslySetInnerHTML: { __html: report.warning } }),
                                    report.more && React.createElement(
                                        'p',
                                        null,
                                        React.createElement(
                                            'a',
                                            { className: 'text-info', href: report.more },
                                            report.more
                                        )
                                    )
                                );
                            })
                        );
                    }
                    return;
                })
            );
        }
    }]);
    return StaticAnalysis;
}(React.Component);

var mapStateToProps$c = function mapStateToProps(_ref3) {
    var contract = _ref3.contract;
    var compiled = contract.compiled;

    return { compiled: compiled };
};

var StaticAnalysis$1 = reactRedux.connect(mapStateToProps$c, {})(StaticAnalysis);

var TabView = function (_React$Component) {
    inherits(TabView, _React$Component);

    function TabView(props) {
        classCallCheck(this, TabView);

        var _this = possibleConstructorReturn(this, (TabView.__proto__ || Object.getPrototypeOf(TabView)).call(this, props));

        _this.helpers = props.helpers;
        _this.state = {
            txBtnStyle: 'btn',
            eventBtnStyle: 'btn',
            newTxCounter: 0,
            newEventCounter: 0
        };
        _this._handleTabSelect = _this._handleTabSelect.bind(_this);
        return _this;
    }

    createClass(TabView, [{
        key: '_handleTabSelect',
        value: function _handleTabSelect(index) {
            if (index === 2) {
                this.setState({ newTxCounter: 0, txBtnStyle: 'btn' });
            }
            if (index === 3) {
                this.setState({ newEventCounter: 0, eventBtnStyle: 'btn' });
            }
        }
    }, {
        key: 'UNSAFE_componentWillReceiveProps',
        value: function UNSAFE_componentWillReceiveProps(nextProps) {
            var _state = this.state,
                newTxCounter = _state.newTxCounter,
                newEventCounter = _state.newEventCounter;

            if (this.props.pendingTransactions !== nextProps.pendingTransactions) {
                this.setState({ newTxCounter: newTxCounter + 1, txBtnStyle: 'btn btn-error' });
            }
            if (this.props.events !== nextProps.events && nextProps.events.length > 0) {
                this.setState({ newEventCounter: newEventCounter + 1, eventBtnStyle: 'btn btn-error' });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state2 = this.state,
                eventBtnStyle = _state2.eventBtnStyle,
                txBtnStyle = _state2.txBtnStyle,
                newTxCounter = _state2.newTxCounter,
                newEventCounter = _state2.newEventCounter;


            return React.createElement(
                reactTabs.Tabs,
                { onSelect: function onSelect(index) {
                        return _this2._handleTabSelect(index);
                    }, className: 'react-tabs vertical-tabs' },
                React.createElement(
                    reactTabs.TabList,
                    { className: 'react-tabs__tab-list vertical tablist' },
                    React.createElement(
                        'div',
                        { className: 'tab_btns' },
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { className: 'btn' },
                                'Contract'
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { className: 'btn' },
                                'Analysis'
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { className: txBtnStyle },
                                'Transaction analyzer',
                                newTxCounter > 0 && React.createElement(
                                    'span',
                                    { className: 'badge badge-small badge-error notify-badge' },
                                    newTxCounter
                                )
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { className: eventBtnStyle },
                                'Events',
                                newEventCounter > 0 && React.createElement(
                                    'span',
                                    { className: 'badge badge-small badge-error notify-badge' },
                                    newEventCounter
                                )
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { className: 'btn' },
                                'Node'
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { className: 'btn btn-warning' },
                                'Help'
                            )
                        )
                    )
                ),
                React.createElement(
                    reactTabs.TabPanel,
                    null,
                    React.createElement(Contracts$1, { store: this.props.store, helpers: this.helpers })
                ),
                React.createElement(
                    reactTabs.TabPanel,
                    null,
                    React.createElement(StaticAnalysis$1, { store: this.props.store, helpers: this.helpers })
                ),
                React.createElement(
                    reactTabs.TabPanel,
                    null,
                    React.createElement(TxAnalyzer$1, { store: this.props.store, helpers: this.helpers })
                ),
                React.createElement(
                    reactTabs.TabPanel,
                    null,
                    React.createElement(Events$1, { store: this.props.store, helpers: this.helpers })
                ),
                React.createElement(
                    reactTabs.TabPanel,
                    null,
                    React.createElement(NodeControl$1, { store: this.props.store, helpers: this.helpers })
                ),
                React.createElement(
                    reactTabs.TabPanel,
                    null,
                    React.createElement(
                        'h2',
                        { className: 'text-warning' },
                        'Help Etheratom to keep solidity development interactive.'
                    ),
                    React.createElement(
                        'h4',
                        { className: 'text-success' },
                        'Donate Ethereum: 0xd22fE4aEFed0A984B1165dc24095728EE7005a36'
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'span',
                            null,
                            'Etheratom news '
                        ),
                        React.createElement(
                            'a',
                            { href: 'https://twitter.com/hashtag/Etheratom' },
                            '#Etheratom'
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Contact: ',
                        React.createElement(
                            'a',
                            { href: 'mailto:0mkar@protonmail.com', target: '_top' },
                            '0mkar@protonmail.com'
                        )
                    )
                )
            );
        }
    }]);
    return TabView;
}(React.Component);

var mapStateToProps$d = function mapStateToProps(_ref) {
    var contract = _ref.contract,
        eventReducer = _ref.eventReducer;
    var compiled = contract.compiled;
    var pendingTransactions = eventReducer.pendingTransactions,
        events = eventReducer.events;

    return { compiled: compiled, pendingTransactions: pendingTransactions, events: events };
};

var TabView$1 = reactRedux.connect(mapStateToProps$d, {})(TabView);

var CoinbaseView = function (_React$Component) {
    inherits(CoinbaseView, _React$Component);

    function CoinbaseView(props) {
        classCallCheck(this, CoinbaseView);

        var _this = possibleConstructorReturn(this, (CoinbaseView.__proto__ || Object.getPrototypeOf(CoinbaseView)).call(this, props));

        _this.helpers = props.helpers;
        _this.state = {
            coinbase: props.accounts[0],
            balance: 0.00,
            password: '',
            unlock_style: 'unlock-default'
        };
        _this._handleAccChange = _this._handleAccChange.bind(_this);
        _this._handlePasswordChange = _this._handlePasswordChange.bind(_this);
        _this._handleUnlock = _this._handleUnlock.bind(_this);
        _this._linkClick = _this._linkClick.bind(_this);
        return _this;
    }

    createClass(CoinbaseView, [{
        key: 'componentDidMount',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var coinbase, balance;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                coinbase = this.state.coinbase;
                                _context.next = 3;
                                return this.helpers.getBalance(coinbase);

                            case 3:
                                balance = _context.sent;

                                this.setState({ balance: balance });

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function componentDidMount() {
                return _ref.apply(this, arguments);
            }

            return componentDidMount;
        }()
    }, {
        key: '_linkClick',
        value: function _linkClick(event) {
            var coinbase = this.state.coinbase;

            atom.clipboard.write(coinbase);
        }
    }, {
        key: '_handleAccChange',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
                var coinbase, balance;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                coinbase = event.target.value;
                                _context2.next = 3;
                                return this.helpers.getBalance(coinbase);

                            case 3:
                                balance = _context2.sent;

                                this.props.setCoinbase(coinbase);
                                this.setState({ coinbase: coinbase, balance: balance });

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _handleAccChange(_x) {
                return _ref2.apply(this, arguments);
            }

            return _handleAccChange;
        }()
    }, {
        key: '_handlePasswordChange',
        value: function _handlePasswordChange(event) {
            var password = event.target.value;
            this.setState({ password: password });
            // TODO: unless we show some indicator on `Unlock` let password set on change
            if (!(password.length - 1 > 0)) {
                this.setState({ unlock_style: 'unlock-default' });
            }
        }
    }, {
        key: '_handleUnlock',
        value: function _handleUnlock(event) {
            // TODO: here try to unlock geth backend node using coinbase and password and show result
            var password = this.state.password;

            if (password.length > 0) {
                this.props.setPassword({ password: password });
                this.setState({ unlock_style: 'unlock-active' });
            }
            event.preventDefault();
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                balance = _state.balance,
                password = _state.password;
            var accounts = this.props.accounts;

            return React.createElement(
                'div',
                { 'class': 'content' },
                React.createElement(
                    'div',
                    { 'class': 'row' },
                    React.createElement('div', { 'class': 'icon icon-link btn copy-btn btn-success', onClick: this._linkClick }),
                    React.createElement(
                        'select',
                        { onChange: this._handleAccChange, value: this.state.coinbase },
                        accounts.map(function (account, i) {
                            return React.createElement(
                                'option',
                                { value: account },
                                account
                            );
                        })
                    ),
                    React.createElement(
                        'button',
                        { 'class': 'btn' },
                        balance,
                        ' ETH'
                    )
                ),
                React.createElement(
                    'form',
                    { 'class': 'row', onSubmit: this._handleUnlock },
                    React.createElement('div', { 'class': 'icon icon-lock' }),
                    React.createElement('input', {
                        type: 'password', placeholder: 'Password',
                        value: password,
                        onChange: this._handlePasswordChange
                    }),
                    React.createElement('input', {
                        type: 'submit',
                        'class': this.state.unlock_style,
                        value: 'Unlock'
                    })
                )
            );
        }
    }]);
    return CoinbaseView;
}(React.Component);

var mapStateToProps$e = function mapStateToProps(_ref3) {
    var account = _ref3.account;
    var coinbase = account.coinbase,
        password = account.password,
        accounts = account.accounts;

    return { coinbase: coinbase, password: password, accounts: accounts };
};

var CoinbaseView$1 = reactRedux.connect(mapStateToProps$e, { setCoinbase: setCoinbase, setPassword: setPassword })(CoinbaseView);

var CompileBtn = function (_React$Component) {
    inherits(CompileBtn, _React$Component);

    function CompileBtn(props) {
        classCallCheck(this, CompileBtn);

        var _this = possibleConstructorReturn(this, (CompileBtn.__proto__ || Object.getPrototypeOf(CompileBtn)).call(this, props));

        _this._handleSubmit = _this._handleSubmit.bind(_this);
        return _this;
    }

    createClass(CompileBtn, [{
        key: '_handleSubmit',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var workspaceElement;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                workspaceElement = atom.views.getView(atom.workspace);
                                _context.next = 3;
                                return atom.commands.dispatch(workspaceElement, 'eth-interface:compile');

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _handleSubmit() {
                return _ref.apply(this, arguments);
            }

            return _handleSubmit;
        }()
    }, {
        key: 'render',
        value: function render() {
            var compiling = this.props.compiling;

            return React.createElement(
                'form',
                { 'class': 'row', onSubmit: this._handleSubmit },
                compiling && React.createElement('input', { type: 'submit', value: 'Compiling...', 'class': 'btn copy-btn btn-success', disabled: true }),
                !compiling && React.createElement('input', { type: 'submit', value: 'Compile', 'class': 'btn copy-btn btn-success' })
            );
        }
    }]);
    return CompileBtn;
}(React.Component);

var mapStateToProps$f = function mapStateToProps(_ref2) {
    var contract = _ref2.contract;
    var compiling = contract.compiling;

    return { compiling: compiling };
};

var CompileBtn$1 = reactRedux.connect(mapStateToProps$f, {})(CompileBtn);

var View = function () {
	function View(store, web3) {
		classCallCheck(this, View);

		this.Accounts = [];
		this.coinbase = null;
		this.web3 = web3;
		this.store = store;
		this.helpers = new Web3Helpers(this.web3);
	}

	createClass(View, [{
		key: 'createCompilerOptionsView',
		value: function createCompilerOptionsView() {
			ReactDOM.render(React.createElement(ClientSelector$1, { store: this.store }), document.getElementById('client-options'));
		}
	}, {
		key: 'createCoinbaseView',
		value: function () {
			var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
				var accounts;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.prev = 0;
								_context.next = 3;
								return this.web3.eth.getAccounts();

							case 3:
								accounts = _context.sent;

								this.store.dispatch({ type: SET_ACCOUNTS, payload: accounts });
								this.store.dispatch({ type: SET_COINBASE, payload: accounts[0] });
								ReactDOM.render(React.createElement(CoinbaseView$1, { store: this.store, helpers: this.helpers }), document.getElementById('accounts-list'));
								_context.next = 14;
								break;

							case 9:
								_context.prev = 9;
								_context.t0 = _context['catch'](0);

								console.log(_context.t0);
								this.helpers.showPanelError("No account exists! Please create one.");
								throw _context.t0;

							case 14:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[0, 9]]);
			}));

			function createCoinbaseView() {
				return _ref.apply(this, arguments);
			}

			return createCoinbaseView;
		}()
	}, {
		key: 'createButtonsView',
		value: function createButtonsView() {
			ReactDOM.render(React.createElement(CompileBtn$1, { store: this.store }), document.getElementById('compile_btn'));
		}
	}, {
		key: 'createTabView',
		value: function createTabView() {
			ReactDOM.render(React.createElement(TabView$1, { store: this.store, helpers: this.helpers }), document.getElementById('tab_view'));
		}
	}, {
		key: 'createTextareaR',
		value: function createTextareaR(text) {
			var textNode;
			this.text = text;
			textNode = document.createElement('pre');
			textNode.textContent = this.text;
			textNode.classList.add('large-code');
			return textNode;
		}
	}, {
		key: 'getAddresses',
		value: function () {
			var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(callback) {
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								return _context2.abrupt('return', this.web3.eth.getAccounts(function (err, accounts) {
									if (err) {
										return callback('Error no base account!', null);
									} else {
										return callback(null, accounts);
									}
								}));

							case 1:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function getAddresses(_x) {
				return _ref2.apply(this, arguments);
			}

			return getAddresses;
		}()
	}]);
	return View;
}();

var Web3Env = function () {
	function Web3Env(store) {
		classCallCheck(this, Web3Env);

		this.subscriptions = new atom$1.CompositeDisposable();
		this.web3Subscriptions = new atom$1.CompositeDisposable();
		this.saveSubscriptions = new atom$1.CompositeDisposable();
		this.compileSubscriptions = new atom$1.CompositeDisposable();
		this.store = store;
		this.observeConfig();
	}

	createClass(Web3Env, [{
		key: 'dispose',
		value: function dispose() {
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
	}, {
		key: 'destroy',
		value: function destroy() {
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
		}
	}, {
		key: 'observeConfig',
		value: function observeConfig() {
			var _this = this;

			this.subscriptions.add(atom.config.observe('etheratom.executionEnv', function (executionEnv) {
				if (_this.web3Subscriptions) {
					_this.destroy();
				}
				_this.web3Subscriptions = new atom$1.CompositeDisposable();
				if (executionEnv == 'web3') {
					_this.subscribeToWeb3Commands();
					_this.subscribeToWeb3Events();
				} else {
					return;
				}
			}));
			this.subscriptions.add(atom.config.onDidChange('etheratom.executionEnv', function (envChange) {
				if (envChange.newValue !== 'web3') {
					_this.destroy();
				}
				if (envChange.newValue == 'web3') {
					if (_this.web3Subscriptions) {
						_this.web3Subscriptions.dispose();
					}
					_this.web3Subscriptions = new atom$1.CompositeDisposable();
					_this.subscribeToWeb3Commands();
					_this.subscribeToWeb3Events();
				}
			}));
		}

		// Subscriptions

	}, {
		key: 'subscribeToWeb3Commands',
		value: function subscribeToWeb3Commands() {
			var _this2 = this;

			if (!this.web3Subscriptions) {
				return;
			}
			this.web3Subscriptions.add(atom.commands.add('atom-workspace', 'eth-interface:compile', function () {
				if (_this2.compileSubscriptions) {
					_this2.compileSubscriptions.dispose();
				}
				_this2.compileSubscriptions = new atom$1.CompositeDisposable();
				_this2.subscribeToCompileEvents();
			}));
		}
	}, {
		key: 'subscribeToWeb3Events',
		value: function subscribeToWeb3Events() {
			var _this3 = this;

			if (!this.web3Subscriptions) {
				return;
			}
			var rpcAddress = atom.config.get('etheratom.rpcAddress');
			var websocketAddress = atom.config.get('etheratom.websocketAddress');
			if (typeof this.web3 !== 'undefined') {
				this.web3 = new Web3(this.web3.currentProvider);
			} else {
				this.web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(rpcAddress));
				if (websocketAddress) {
					this.web3.setProvider(new Web3.providers.WebsocketProvider(websocketAddress));
				}
				this.helpers = new Web3Helpers(this.web3);
			}
			this.view = new View(this.store, this.web3);
			if (Object.is(this.web3.currentProvider.constructor, Web3.providers.WebsocketProvider)) {
				console.log("%c Provider is websocket. Creating subscriptions... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
				// newBlockHeaders subscriber
				this.web3.eth.subscribe('newBlockHeaders').on("data", function (blocks) {
					console.log("%c newBlockHeaders:data ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
					console.log(blocks);
				}).on('error', function (e) {
					console.log("%c newBlockHeaders:error ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
					console.log(e);
				});
				// pendingTransactions subscriber
				this.web3.eth.subscribe('pendingTransactions').on("data", function (transaction) {
					/*console.log("%c pendingTransactions:data ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
     console.log(transaction);*/
					_this3.store.dispatch({ type: ADD_PENDING_TRANSACTION, payload: transaction });
				}).on('error', function (e) {
					console.log("%c pendingTransactions:error ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
					console.log(e);
				});
				// syncing subscription
				this.web3.eth.subscribe('syncing').on("data", function (sync) {
					console.log("%c syncing:data ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
					console.log(sync);
					if (typeof sync === 'boolean') {
						_this3.store.dispatch({ type: SET_SYNCING, payload: sync });
					}
					if ((typeof sync === 'undefined' ? 'undefined' : _typeof(sync)) === 'object') {
						_this3.store.dispatch({ type: SET_SYNCING, payload: sync.syncing });
						var status = {
							currentBlock: sync.status.CurrentBlock,
							highestBlock: sync.status.HighestBlock,
							knownStates: sync.status.KnownStates,
							pulledStates: sync.status.PulledStates,
							startingBlock: sync.status.StartingBlock
						};
						_this3.store.dispatch({ type: SET_SYNC_STATUS, payload: status });
					}
				}).on('changed', function (isSyncing) {
					console.log("%c syncing:changed ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
					console.log(isSyncing);
				}).on('error', function (e) {
					console.log("%c syncing:error ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
					console.log(e);
				});
			}
			this.checkConnection(function (error, connection) {
				if (error) {
					_this3.helpers.showPanelError(error);
				} else if (connection) {
					_this3.view.createCompilerOptionsView();
					_this3.view.createCoinbaseView();
					_this3.view.createButtonsView();
					_this3.view.createTabView();
				}
			});
			this.web3Subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
				if (!editor || !editor.getBuffer()) {
					return;
				}

				_this3.web3Subscriptions.add(atom.config.observe('etheratom.compileOnSave', function (compileOnSave) {
					if (_this3.saveSubscriptions) {
						_this3.saveSubscriptions.dispose();
					}
					_this3.saveSubscriptions = new atom$1.CompositeDisposable();
					if (compileOnSave) {
						_this3.subscribeToSaveEvents();
					}
				}));
			}));
		}

		// Event subscriptions

	}, {
		key: 'subscribeToSaveEvents',
		value: function subscribeToSaveEvents() {
			var _this4 = this;

			if (!this.web3Subscriptions) {
				return;
			}
			this.saveSubscriptions.add(atom.workspace.observeTextEditors(function (editor) {
				if (!editor || !editor.getBuffer()) {
					return;
				}

				var bufferSubscriptions = new atom$1.CompositeDisposable();
				bufferSubscriptions.add(editor.getBuffer().onDidSave(function (filePath) {
					_this4.compile(editor);
				}));
				bufferSubscriptions.add(editor.getBuffer().onDidDestroy(function () {
					bufferSubscriptions.dispose();
				}));
				_this4.saveSubscriptions.add(bufferSubscriptions);
			}));
		}
	}, {
		key: 'subscribeToCompileEvents',
		value: function subscribeToCompileEvents() {
			var _this5 = this;

			if (!this.web3Subscriptions) {
				return;
			}
			this.compileSubscriptions.add(atom.workspace.observeTextEditors(function (editor) {
				if (!editor || !editor.getBuffer()) {
					return;
				}
				_this5.compile(editor);
			}));
		}

		// common functions

	}, {
		key: 'checkConnection',
		value: function checkConnection(callback) {
			var haveConn = void 0;
			haveConn = this.web3.currentProvider;
			if (!haveConn) {
				return callback('Error could not connect to local geth instance!', null);
			} else {
				return callback(null, true);
			}
		}
	}, {
		key: 'compile',
		value: function () {
			var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(editor) {
				var filePath, filename, dir, sources, compiled, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _ref2, _ref3, fileName, contracts, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _ref4, _ref5, contractName, contract, gasLimit;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								filePath = editor.getPath();
								filename = filePath.replace(/^.*[\\\/]/, '');

								if (!(filePath.split('.').pop() == 'sol')) {
									_context.next = 81;
									break;
								}

								console.log("%c Compiling contract... ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
								this.store.dispatch({ type: SET_COMPILING, payload: true });
								dir = path.dirname(filePath);
								sources = {};

								sources[filename] = { content: editor.getText() };
								_context.next = 10;
								return combineSource(dir, sources);

							case 10:
								sources = _context.sent;

								console.log(sources);
								_context.prev = 12;

								// Reset redux store
								this.store.dispatch({ type: SET_COMPILED, payload: null });
								this.store.dispatch({ type: SET_ERRORS, payload: [] });
								this.store.dispatch({ type: SET_EVENTS, payload: [] });
								_context.next = 18;
								return this.helpers.compileWeb3(sources);

							case 18:
								compiled = _context.sent;

								this.store.dispatch({ type: SET_COMPILED, payload: compiled });

								if (!compiled.contracts) {
									_context.next = 67;
									break;
								}

								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 24;
								_iterator = Object.entries(compiled.contracts)[Symbol.iterator]();

							case 26:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context.next = 53;
									break;
								}

								_ref2 = _step.value;
								_ref3 = slicedToArray(_ref2, 2);
								fileName = _ref3[0];
								contracts = _ref3[1];
								_iteratorNormalCompletion2 = true;
								_didIteratorError2 = false;
								_iteratorError2 = undefined;
								_context.prev = 34;

								for (_iterator2 = Object.entries(contracts)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
									_ref4 = _step2.value;
									_ref5 = slicedToArray(_ref4, 2);
									contractName = _ref5[0];
									contract = _ref5[1];

									// Add interface to redux
									this.store.dispatch({ type: ADD_INTERFACE, payload: { contractName: contractName, interface: contract.abi } });
								}
								_context.next = 42;
								break;

							case 38:
								_context.prev = 38;
								_context.t0 = _context['catch'](34);
								_didIteratorError2 = true;
								_iteratorError2 = _context.t0;

							case 42:
								_context.prev = 42;
								_context.prev = 43;

								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}

							case 45:
								_context.prev = 45;

								if (!_didIteratorError2) {
									_context.next = 48;
									break;
								}

								throw _iteratorError2;

							case 48:
								return _context.finish(45);

							case 49:
								return _context.finish(42);

							case 50:
								_iteratorNormalCompletion = true;
								_context.next = 26;
								break;

							case 53:
								_context.next = 59;
								break;

							case 55:
								_context.prev = 55;
								_context.t1 = _context['catch'](24);
								_didIteratorError = true;
								_iteratorError = _context.t1;

							case 59:
								_context.prev = 59;
								_context.prev = 60;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 62:
								_context.prev = 62;

								if (!_didIteratorError) {
									_context.next = 65;
									break;
								}

								throw _iteratorError;

							case 65:
								return _context.finish(62);

							case 66:
								return _context.finish(59);

							case 67:
								if (compiled.errors) {
									this.store.dispatch({ type: SET_ERRORS, payload: compiled.errors });
								}
								_context.next = 70;
								return this.helpers.getGasLimit();

							case 70:
								gasLimit = _context.sent;

								this.store.dispatch({ type: SET_GAS_LIMIT, payload: gasLimit });
								this.store.dispatch({ type: SET_COMPILING, payload: false });
								_context.next = 79;
								break;

							case 75:
								_context.prev = 75;
								_context.t2 = _context['catch'](12);

								console.log(_context.t2);
								this.helpers.showPanelError(_context.t2);

							case 79:
								_context.next = 82;
								break;

							case 81:
								return _context.abrupt('return');

							case 82:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[12, 75], [24, 55, 59, 67], [34, 38, 42, 50], [43,, 45, 49], [60,, 62, 66]]);
			}));

			function compile(_x) {
				return _ref.apply(this, arguments);
			}

			return compile;
		}()
	}]);
	return Web3Env;
}();

var INITIAL_STATE = {
    compiled: null,
    compiling: false,
    deployed: false,
    interfaces: null,
    instances: null,
    gasLimit: 0
};
var ContractReducer = (function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
        case SET_COMPILING:
            return _extends({}, state, { compiling: action.payload });
        case SET_DEPLOYED:
            return _extends({}, state, { deployed: _extends({}, state.deployed, defineProperty({}, action.payload.contractName, action.payload.deployed)) });
        case SET_COMPILED:
            return _extends({}, INITIAL_STATE, { compiled: action.payload });
        case SET_INSTANCE:
            return _extends({}, state, { instances: _extends({}, state.instances, defineProperty({}, action.payload.contractName, action.payload.instance)) });
        case SET_PARAMS:
            return _extends({}, state, { interfaces: _extends({}, state.interfaces, defineProperty({}, action.payload.contractName, { interface: action.payload.interface })) });
        case ADD_INTERFACE:
            return _extends({}, state, { interfaces: _extends({}, state.interfaces, defineProperty({}, action.payload.contractName, { interface: action.payload.interface })) });
        case SET_GAS_LIMIT:
            return _extends({}, state, { gasLimit: action.payload });
        default:
            return state;
    }
});

var INITIAL_STATE$1 = {
    coinbase: null,
    password: false,
    accounts: []
};
var AccountReducer = (function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE$1;
    var action = arguments[1];

    switch (action.type) {
        case SET_COINBASE:
            return _extends({}, state, { coinbase: action.payload });
        case SET_PASSWORD:
            return _extends({}, state, { password: action.payload.password });
        case SET_ACCOUNTS:
            return _extends({}, state, { accounts: action.payload });
        default:
            return state;
    }
});

var INITIAL_STATE$2 = {
    errormsg: []
};
var ErrorReducer = (function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE$2;
    var action = arguments[1];

    switch (action.type) {
        case SET_ERRORS:
            return _extends({}, state, { errormsg: action.payload });
        default:
            return state;
    }
});

var INITIAL_STATE$3 = {
    pendingTransactions: [],
    events: []
};
var EventReducer = (function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE$3;
    var action = arguments[1];

    switch (action.type) {
        case ADD_PENDING_TRANSACTION:
            return _extends({}, state, { pendingTransactions: [].concat(toConsumableArray(state.pendingTransactions), [action.payload]) });
        case ADD_EVENTS:
            return _extends({}, state, { events: [].concat(toConsumableArray(state.events), [action.payload]) });
        case SET_EVENTS:
            return _extends({}, state, { events: [] });
        default:
            return state;
    }
});

// Copyright 2018 Etheratom Authors
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

var INITIAL_STATE$4 = {
    clients: [
    /*{
        provider: 'solcjs',
        desc: 'Javascript VM'
    },*/
    {
        provider: 'web3',
        desc: 'Backend ethereum node'
    }]
};
var ClientReducer = (function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE$4;
    var action = arguments[1];

    switch (action.type) {
        default:
            return state;
    }
});

var INITIAL_STATE$5 = {
    syncing: false,
    status: {},
    mining: false,
    hashRate: 0
};
var NodeReducer = (function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE$5;
    var action = arguments[1];

    switch (action.type) {
        case SET_SYNCING:
            return _extends({}, state, { syncing: action.payload });
        case SET_SYNC_STATUS:
            return _extends({}, state, { status: action.payload });
        case SET_MINING:
            return _extends({}, state, { mining: action.payload });
        case SET_HASH_RATE:
            return _extends({}, state, { hashRate: action.payload });
        default:
            return state;
    }
});

var etheratomReducers = redux.combineReducers({
    contract: ContractReducer,
    account: AccountReducer,
    errors: ErrorReducer,
    eventReducer: EventReducer,
    clientReducer: ClientReducer,
    node: NodeReducer
});

function configureStore(initialState) {
    var middleWares = [ReduxThunk];
    if (atom.inDevMode()) {
        middleWares.push(logger);
    }
    var store = redux.createStore(etheratomReducers, initialState, redux.applyMiddleware.apply(undefined, middleWares));
    return store;
}

var Etheratom = function () {
	function Etheratom(props) {
		classCallCheck(this, Etheratom);

		this.subscriptions = new atom$1.CompositeDisposable();
		this.atomSolidityView = new AtomSolidityView();
		this.modalPanel = null;
		this.loaded = false;
		this.store = configureStore();
	}

	createClass(Etheratom, [{
		key: 'activate',
		value: function activate() {
			require('atom-package-deps').install('etheratom', true).then(function () {
				console.log('All dependencies installed, good to go');
			});
			this.subscriptions.add(atom.commands.add('atom-workspace', {
				'eth-interface:toggle': function (_this) {
					return function () {
						_this.toggleView();
					};
				}(this),
				'eth-interface:activate': function (_this) {
					return function () {
						_this.toggleView();
					};
				}(this)
			}));
			this.modalPanel = atom.workspace.addRightPanel({
				item: this.atomSolidityView.getElement(),
				visible: false
			});
			// Initiate env
			this.load();
		}
	}, {
		key: 'deactivate',
		value: function deactivate() {
			this.modalPanel.destroy();
			this.subscriptions.dispose();
			this.atomSolidityView.destroy();
		}
	}, {
		key: 'load',
		value: function load() {
			this.loadWeb3();
			this.loaded = true;
		}
	}, {
		key: 'loadWeb3',
		value: function loadWeb3() {
			if (this.Web3Interface) {
				return this.Web3Interface;
			}
			this.Web3Interface = new Web3Env(this.store);
			this.subscriptions.add(this.Web3Interface);
			return this.Web3Interface;
		}
	}, {
		key: 'toggleView',
		value: function toggleView() {
			if (this.modalPanel.isVisible()) {
				return this.modalPanel.hide();
			} else {
				return this.modalPanel.show();
			}
		}
	}]);
	return Etheratom;
}();

module.exports = new Etheratom({
    config: atom.config,
    workspace: atom.workspace
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL2xpYi9pbmRleC5qcyIsIi4uL2xpYi9ldGhlcmV1bS1pbnRlcmZhY2Utdmlldy5qcyIsIi4uL2xpYi93ZWIzL21ldGhvZHMuanMiLCIuLi9saWIvaGVscGVycy9jb21waWxlci1pbXBvcnRzLmpzIiwiLi4vbGliL2NvbXBvbmVudHMvQ2xpZW50U2VsZWN0b3IvaW5kZXguanMiLCIuLi9saWIvYWN0aW9ucy90eXBlcy5qcyIsIi4uL2xpYi9hY3Rpb25zL0NvbnRyYWN0QWN0aW9ucy5qcyIsIi4uL2xpYi9hY3Rpb25zL0FjY291bnRBY3Rpb25zLmpzIiwiLi4vbGliL2FjdGlvbnMvRXZlbnRBY3Rpb25zLmpzIiwiLi4vbGliL2FjdGlvbnMvTm9kZUFjdGlvbnMuanMiLCIuLi9saWIvY29tcG9uZW50cy9HYXNJbnB1dC9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0lucHV0c0Zvcm0vaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9DcmVhdGVCdXR0b24vaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9Db250cmFjdENvbXBpbGVkL2luZGV4LmpzIiwiLi4vbGliL2NvbXBvbmVudHMvRnVuY3Rpb25BQkkvaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9Db250cmFjdEV4ZWN1dGlvbi9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0Vycm9yVmlldy9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0NvbnRyYWN0cy9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL1R4QW5hbHl6ZXIvaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9FdmVudEl0ZW0vaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9FdmVudHMvaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9Ob2RlQ29udHJvbC9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL1N0YXRpY0FuYWx5c2lzL2luZGV4LmpzIiwiLi4vbGliL2NvbXBvbmVudHMvVGFiVmlldy9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0NvaW5iYXNlVmlldy9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0NvbXBpbGVCdG4vaW5kZXguanMiLCIuLi9saWIvd2ViMy92aWV3LmpzIiwiLi4vbGliL3dlYjMvd2ViMy5qcyIsIi4uL2xpYi9yZWR1Y2Vycy9Db250cmFjdFJlZHVjZXIuanMiLCIuLi9saWIvcmVkdWNlcnMvQWNjb3VudFJlZHVjZXIuanMiLCIuLi9saWIvcmVkdWNlcnMvRXJyb3JSZWR1Y2VyLmpzIiwiLi4vbGliL3JlZHVjZXJzL0V2ZW50UmVkdWNlci5qcyIsIi4uL2xpYi9yZWR1Y2Vycy9DbGllbnRSZWR1Y2VyLmpzIiwiLi4vbGliL3JlZHVjZXJzL05vZGVSZWR1Y2VyLmpzIiwiLi4vbGliL3JlZHVjZXJzL2luZGV4LmpzIiwiLi4vbGliL2hlbHBlcnMvY29uZmlndXJlU3RvcmUuanMiLCIuLi9saWIvZXRoZXJldW0taW50ZXJmYWNlLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJjb3JlLWpzL3NoaW1cIik7XG5cbnJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWVcIik7XG5cbnJlcXVpcmUoXCJjb3JlLWpzL2ZuL3JlZ2V4cC9lc2NhcGVcIik7XG5cbmlmIChnbG9iYWwuX2JhYmVsUG9seWZpbGwpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwib25seSBvbmUgaW5zdGFuY2Ugb2YgYmFiZWwtcG9seWZpbGwgaXMgYWxsb3dlZFwiKTtcbn1cbmdsb2JhbC5fYmFiZWxQb2x5ZmlsbCA9IHRydWU7XG5cbnZhciBERUZJTkVfUFJPUEVSVFkgPSBcImRlZmluZVByb3BlcnR5XCI7XG5mdW5jdGlvbiBkZWZpbmUoTywga2V5LCB2YWx1ZSkge1xuICBPW2tleV0gfHwgT2JqZWN0W0RFRklORV9QUk9QRVJUWV0oTywga2V5LCB7XG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9KTtcbn1cblxuZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIFwicGFkTGVmdFwiLCBcIlwiLnBhZFN0YXJ0KTtcbmRlZmluZShTdHJpbmcucHJvdG90eXBlLCBcInBhZFJpZ2h0XCIsIFwiXCIucGFkRW5kKTtcblxuXCJwb3AscmV2ZXJzZSxzaGlmdCxrZXlzLHZhbHVlcyxlbnRyaWVzLGluZGV4T2YsZXZlcnksc29tZSxmb3JFYWNoLG1hcCxmaWx0ZXIsZmluZCxmaW5kSW5kZXgsaW5jbHVkZXMsam9pbixzbGljZSxjb25jYXQscHVzaCxzcGxpY2UsdW5zaGlmdCxzb3J0LGxhc3RJbmRleE9mLHJlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGxcIi5zcGxpdChcIixcIikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIFtdW2tleV0gJiYgZGVmaW5lKEFycmF5LCBrZXksIEZ1bmN0aW9uLmNhbGwuYmluZChbXVtrZXldKSk7XG59KTsiLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuZXhwb3J0IGNsYXNzIEF0b21Tb2xpZGl0eVZpZXcge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50O1xuXHRcdHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F0b20tcGFuZWwnKTtcblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXRoZXJhdG9tLXBhbmVsJyk7XG5cdFx0bGV0IGF0dCA9IG51bGw7XG5cblx0XHQvLyBlbXB0eSBkaXYgdG8gaGFuZGxlIHJlc2l6ZVxuXHRcdGxldCByZXNpemVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cmVzaXplTm9kZS5vbm1vdXNlZG93biA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcyk7XG5cdFx0cmVzaXplTm9kZS5jbGFzc0xpc3QuYWRkKCdldGhlcmF0b20tcGFuZWwtcmVzaXplLWhhbmRsZScpO1xuXHRcdHJlc2l6ZU5vZGUuc2V0QXR0cmlidXRlKCdyZWYnLCAncmVzaXplaGFuZGxlJyk7XG5cdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJlc2l6ZU5vZGUpO1xuXG5cdFx0bGV0IG1haW5Ob2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0bWFpbk5vZGUuY2xhc3NMaXN0LmFkZCgnZXRoZXJhdG9tJyk7XG5cdFx0bWFpbk5vZGUuY2xhc3NMaXN0LmFkZCgnbmF0aXZlLWtleS1iaW5kaW5ncycpO1xuXHRcdG1haW5Ob2RlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcblxuXHRcdGxldCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0bWVzc2FnZS50ZXh0Q29udGVudCA9IFwiRXRoZXJhdG9tIElERVwiO1xuXHRcdG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnY29tcGlsZXItaW5mbycpO1xuXHRcdG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYmxvY2snKTtcblx0XHRtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodC1pbmZvJyk7XG5cdFx0bWFpbk5vZGUuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cblx0XHRsZXQgY29tcGlsZXJOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0YXR0ID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKCdpZCcpO1xuXHRcdGF0dC52YWx1ZSA9ICdjbGllbnQtb3B0aW9ucyc7XG5cdFx0Y29tcGlsZXJOb2RlLnNldEF0dHJpYnV0ZU5vZGUoYXR0KTtcblx0XHRtYWluTm9kZS5hcHBlbmRDaGlsZChjb21waWxlck5vZGUpO1xuXG5cdFx0bGV0IGFjY291bnRzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGF0dCA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZSgnaWQnKTtcblx0XHRhdHQudmFsdWUgPSAnYWNjb3VudHMtbGlzdCc7XG5cdFx0YWNjb3VudHNOb2RlLnNldEF0dHJpYnV0ZU5vZGUoYXR0KTtcblx0XHRtYWluTm9kZS5hcHBlbmRDaGlsZChhY2NvdW50c05vZGUpO1xuXG5cdFx0bGV0IGJ1dHRvbk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRhdHQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0YXR0LnZhbHVlID0gJ2NvbW1vbi1idXR0b25zJztcblx0XHRidXR0b25Ob2RlLnNldEF0dHJpYnV0ZU5vZGUoYXR0KTtcblx0XHRidXR0b25Ob2RlLmNsYXNzTGlzdC5hZGQoJ2Jsb2NrJyk7XG5cblx0XHRsZXQgY29tcGlsZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGF0dCA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZSgnaWQnKTtcblx0XHRhdHQudmFsdWUgPSAnY29tcGlsZV9idG4nO1xuXHRcdGNvbXBpbGVCdXR0b24uc2V0QXR0cmlidXRlTm9kZShhdHQpO1xuXHRcdGNvbXBpbGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJyk7XG5cblx0XHRidXR0b25Ob2RlLmFwcGVuZENoaWxkKGNvbXBpbGVCdXR0b24pO1xuXHRcdG1haW5Ob2RlLmFwcGVuZENoaWxkKGJ1dHRvbk5vZGUpO1xuXG5cdFx0bGV0IHRhYk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRhdHQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0YXR0LnZhbHVlID0gJ3RhYl92aWV3Jztcblx0XHR0YWJOb2RlLnNldEF0dHJpYnV0ZU5vZGUoYXR0KTtcblx0XHRtYWluTm9kZS5hcHBlbmRDaGlsZCh0YWJOb2RlKTtcblxuXHRcdGxldCBlcnJvck5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRhdHQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0YXR0LnZhbHVlID0gJ2NvbXBpbGVkLWVycm9yJztcblx0XHRlcnJvck5vZGUuc2V0QXR0cmlidXRlTm9kZShhdHQpO1xuXHRcdGVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKCdjb21waWxlZC1lcnJvcicpO1xuXHRcdG1haW5Ob2RlLmFwcGVuZENoaWxkKGVycm9yTm9kZSk7XG5cblx0XHQvLyBGaW5hbGx5IGFwcGVuZCBtYWluTm9kZSB0byBlbGVtZW50XG5cdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1haW5Ob2RlKTtcblxuXHRcdHRoaXMuaGFuZGxlTW91c2VEb3duID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZU1vdXNlTW92ZSA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVNb3VzZVVwID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5kaXNwb3NlID0gdGhpcy5kaXNwb3NlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5nZXRFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5kZXN0cm95ID0gdGhpcy5kZXN0cm95LmJpbmQodGhpcyk7XG5cdH1cblx0aGFuZGxlTW91c2VEb3duKGUpIHtcblx0XHRpZih0aGlzLnN1YnNjcmlwdGlvbnMgIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXHRcdH1cblxuXHRcdGNvbnN0IG1vdXNlVXBIYW5kbGVyID0gKGUpID0+IHRoaXMuaGFuZGxlTW91c2VVcChlKVxuXHRcdGNvbnN0IG1vdXNlTW92ZUhhbmRsZXIgPSAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZU1vdmUoZSlcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlcilcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKVxuXG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoe1xuXHRcdFx0ZGlzcG9zZTogKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlcilcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRkaXNwb3NlOiAoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXHRoYW5kbGVNb3VzZU1vdmUoZSkge1xuXHRcdC8vIEN1cnJlbnRseSBvbmx5IHZlcnRpY2FsIHBhbmVsIGlzIHdvcmtpbmcsIG1heSBiZSBsYXRlciBJIHNob3VsZCBhZGQgaG9yaXpvbnRhbCBwYW5lbFxuXHRcdGNvbnN0IHdpZHRoID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0IC0gZS5wYWdlWDtcblx0XHRjb25zdCB2d2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHRjb25zdCB2dyA9ICh3aWR0aCAvIHZ3aWR0aCkgKiAxMDAgKyAndncnO1xuXHRcdHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHZ3O1xuXHR9XG5cdGhhbmRsZU1vdXNlVXAoZSkge1xuXHRcdGlmKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuXHRcdFx0dGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXHRcdH1cblx0fVxuXHRnZXRFbGVtZW50KCkge1xuXHRcdHJldHVybiB0aGlzLmVsZW1lbnQ7XG5cdH1cblx0ZGlzcG9zZSgpIHtcblx0XHR0aGlzLmRlc3Ryb3koKVxuXHR9XG5cdGRlc3Ryb3koKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcblx0fVxufVxuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuLy8gbWV0aG9kcy5qcyBhcmUgY29sbGVjdGlvbiBvZiB2YXJpb3VzIGZ1bmN0aW9ucyB1c2VkIHRvIGV4ZWN1dGUgY2FsbHMgb24gd2ViM1xuaW1wb3J0IFNvbGMgZnJvbSAnc29sYydcbmltcG9ydCBXZWIzIGZyb20gJ3dlYjMnXG5pbXBvcnQgZXRoSlNBQkkgZnJvbSAnZXRoZXJldW1qcy1hYmknXG5pbXBvcnQgRXRoSlNUWCBmcm9tICdldGhlcmV1bWpzLXR4J1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5pbXBvcnQgeyBNZXNzYWdlUGFuZWxWaWV3LCBQbGFpbk1lc3NhZ2VWaWV3LCBMaW5lTWVzc2FnZVZpZXcgfSBmcm9tICdhdG9tLW1lc3NhZ2UtcGFuZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYjNIZWxwZXJzIHtcblx0Y29uc3RydWN0b3Iod2ViMykge1xuXHRcdHRoaXMud2ViMyA9IHdlYjM7XG5cdH1cblx0YXN5bmMgY29tcGlsZVdlYjMoc291cmNlcykge1xuXHRcdC8vIGNvbXBpbGUgc29saWRpdHkgdXNpbmcgc29sY2pzXG5cdFx0Ly8gc291cmNlcyBoYXZlIENvbXBpbGVyIElucHV0IEpTT04gc291cmNlcyBmb3JtYXRcblx0XHQvLyBodHRwczovL3NvbGlkaXR5LnJlYWR0aGVkb2NzLmlvL2VuL2RldmVsb3AvdXNpbmctdGhlLWNvbXBpbGVyLmh0bWwjY29tcGlsZXItaW5wdXQtYW5kLW91dHB1dC1qc29uLWRlc2NyaXB0aW9uXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IG91dHB1dFNlbGVjdGlvbiA9IHtcblx0XHRcdFx0Ly8gRW5hYmxlIHRoZSBtZXRhZGF0YSBhbmQgYnl0ZWNvZGUgb3V0cHV0cyBvZiBldmVyeSBzaW5nbGUgY29udHJhY3QuXG5cdFx0XHRcdFwiKlwiOiB7XG5cdFx0XHRcdFx0XCJcIjogW1wibGVnYWN5QVNUXCJdLFxuXHRcdFx0XHRcdFwiKlwiOiBbXCJhYmlcIiwgXCJldm0uYnl0ZWNvZGUub2JqZWN0XCIsIFwiZGV2ZG9jXCIsIFwidXNlcmRvY1wiLCBcImV2bS5nYXNFc3RpbWF0ZXNcIl1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0ge1xuXHRcdFx0XHRvcHRpbWl6ZXI6IHsgZW5hYmxlZDogdHJ1ZSwgcnVuczogNTAwIH0sXG5cdFx0XHRcdGV2bVZlcnNpb246IFwiYnl6YW50aXVtXCIsXG5cdFx0XHRcdG91dHB1dFNlbGVjdGlvblxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IGlucHV0ID0geyBsYW5ndWFnZTogXCJTb2xpZGl0eVwiLCBzb3VyY2VzLCBzZXR0aW5ncyB9O1xuXHRcdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgU29sYy5jb21waWxlU3RhbmRhcmRXcmFwcGVyKEpTT04uc3RyaW5naWZ5KGlucHV0KSk7XG5cdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShvdXRwdXQpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHR9XG5cdGFzeW5jIGdldEdhc0VzdGltYXRlKGNvaW5iYXNlLCBieXRlY29kZSkge1xuXHRcdGlmKCFjb2luYmFzZSkge1xuXHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ05vIGNvaW5iYXNlIHNlbGVjdGVkIScpO1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLndlYjMuZXRoLmRlZmF1bHRBY2NvdW50ID0gY29pbmJhc2U7XG5cdFx0XHRjb25zdCBnYXNFc3RpbWF0ZSA9IGF3YWl0IHRoaXMud2ViMy5ldGguZXN0aW1hdGVHYXMoe1xuXHRcdFx0XHRmcm9tOiB0aGlzLndlYjMuZXRoLmRlZmF1bHRBY2NvdW50LFxuXHRcdFx0XHRkYXRhOiAnMHgnICsgYnl0ZWNvZGUsXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBnYXNFc3RpbWF0ZTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBnZXRCYWxhbmNlKGNvaW5iYXNlKSB7XG5cdFx0aWYoIWNvaW5iYXNlKSB7XG5cdFx0XHRjb25zdCBlcnJvciA9IG5ldyBFcnJvcignTm8gY29pbmJhc2Ugc2VsZWN0ZWQhJyk7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHdlaUJhbGFuY2UgPSBhd2FpdCB0aGlzLndlYjMuZXRoLmdldEJhbGFuY2UoY29pbmJhc2UpO1xuXHRcdFx0Y29uc3QgZXRoQmFsYW5jZSA9IGF3YWl0IHRoaXMud2ViMy51dGlscy5mcm9tV2VpKHdlaUJhbGFuY2UsIFwiZXRoZXJcIik7XG5cdFx0XHRyZXR1cm4gZXRoQmFsYW5jZTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHR9XG5cdGFzeW5jIGdldFN5bmNTdGF0KCkge1xuXHRcdHRyeSB7XG5cdFx0XHRyZXR1cm4gdGhpcy53ZWIzLmV0aC5pc1N5bmNpbmcoKTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHR9XG5cdGFzeW5jIGNyZWF0ZSh7Li4uYXJnc30pIHtcblx0XHRjb25zb2xlLmxvZyhcIiVjIENyZWF0aW5nIGNvbnRyYWN0Li4uIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0Y29uc3QgY29pbmJhc2UgPSBhcmdzLmNvaW5iYXNlO1xuXHRcdGNvbnN0IHBhc3N3b3JkID0gYXJncy5wYXNzd29yZDtcblx0XHRjb25zdCBhYmkgPSBhcmdzLmFiaTtcblx0XHRjb25zdCBjb2RlID0gYXJncy5ieXRlY29kZTtcblx0XHRjb25zdCBjb250cmFjdE5hbWUgPSBhcmdzLmNvbnRyYWN0TmFtZTtcblx0XHRjb25zdCBnYXNTdXBwbHkgPSBhcmdzLmdhcztcblxuXHRcdGlmKCFjb2luYmFzZSkge1xuXHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ05vIGNvaW5iYXNlIHNlbGVjdGVkIScpO1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHRcdHRoaXMud2ViMy5ldGguZGVmYXVsdEFjY291bnQgPSBjb2luYmFzZTtcblx0XHR0cnkge1xuXHRcdFx0aWYocGFzc3dvcmQpIHtcblx0XHRcdFx0Y29uc3QgdW5sb2NrZWQgPSBhd2FpdCB0aGlzLndlYjMuZXRoLnBlcnNvbmFsLnVubG9ja0FjY291bnQoY29pbmJhc2UsIHBhc3N3b3JkKTtcblx0XHRcdH1cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGdhc1ByaWNlID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRHYXNQcmljZSgpO1xuXHRcdFx0XHRjb25zdCBjb250cmFjdCA9IGF3YWl0IG5ldyB0aGlzLndlYjMuZXRoLkNvbnRyYWN0KGFiaSwge1xuXHRcdFx0XHRcdGZyb206IHRoaXMud2ViMy5ldGguZGVmYXVsdEFjY291bnQsXG5cdFx0XHRcdFx0ZGF0YTogJzB4JyArIGNvZGUsXG5cdFx0XHRcdFx0Z2FzOiB0aGlzLndlYjMudXRpbHMudG9IZXgoZ2FzU3VwcGx5KSxcblx0XHRcdFx0XHRnYXNQcmljZTogdGhpcy53ZWIzLnV0aWxzLnRvSGV4KGdhc1ByaWNlKVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGNvbnRyYWN0O1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdFx0dGhyb3cgZTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHR9XG5cdGFzeW5jIGRlcGxveShjb250cmFjdCwgcGFyYW1zKSB7XG5cdFx0Y29uc29sZS5sb2coXCIlYyBEZXBsb3lpbmcgY29udHJhY3QuLi4gXCIsICdiYWNrZ3JvdW5kOiByZ2JhKDM2LCAxOTQsIDIwMywgMC4zKTsgY29sb3I6ICNFRjUyNUInKTtcblx0XHRjbGFzcyBDb250cmFjdEluc3RhbmNlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHt9O1xuXHRcdGNvbnN0IGNvbnRyYWN0SW5zdGFuY2UgPSBuZXcgQ29udHJhY3RJbnN0YW5jZSgpO1xuXHRcdHRyeSB7XG5cdFx0XHRwYXJhbXMgPSBwYXJhbXMubWFwKHBhcmFtID0+IHtcblx0XHRcdFx0cmV0dXJuIHBhcmFtLnR5cGUuZW5kc1dpdGgoJ1tdJykgPyBwYXJhbS52YWx1ZS5zZWFyY2goJywgJykgPiAwID8gcGFyYW0udmFsdWUuc3BsaXQoJywgJykgOiBwYXJhbS52YWx1ZS5zcGxpdCgnLCcpIDogcGFyYW0udmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGdhc1ByaWNlID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRHYXNQcmljZSgpO1xuXHRcdFx0Y29udHJhY3QuZGVwbG95KHtcblx0XHRcdFx0YXJndW1lbnRzOiBwYXJhbXNcblx0XHRcdH0pXG5cdFx0XHQuc2VuZCh7XG5cdFx0XHRcdGZyb206IHRoaXMud2ViMy5ldGguZGVmYXVsdEFjY291bnRcblx0XHRcdH0pXG5cdFx0XHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIHRyYW5zYWN0aW9uSGFzaCA9PiB7XG5cdFx0XHRcdGNvbnRyYWN0SW5zdGFuY2UuZW1pdCgndHJhbnNhY3Rpb25IYXNoJywgdHJhbnNhY3Rpb25IYXNoKTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ3JlY2VpcHQnLCB0eFJlY2VpcHQgPT4ge1xuXHRcdFx0XHRjb250cmFjdEluc3RhbmNlLmVtaXQoJ3JlY2VpcHQnLCB0eFJlY2VpcHQpO1xuXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdjb25maXJtYXRpb24nLCBjb25maXJtYXRpb25OdW1iZXIgPT4ge1xuXHRcdFx0XHRjb250cmFjdEluc3RhbmNlLmVtaXQoJ2NvbmZpcm1hdGlvbicsIGNvbmZpcm1hdGlvbk51bWJlcik7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdlcnJvcicsIGVycm9yID0+IHtcblx0XHRcdFx0Y29udHJhY3RJbnN0YW5jZS5lbWl0KCdlcnJvcicsIGVycm9yKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihpbnN0YW5jZSA9PiB7XG5cdFx0XHRcdGNvbnRyYWN0SW5zdGFuY2UuZW1pdCgnYWRkcmVzcycsIGluc3RhbmNlLm9wdGlvbnMuYWRkcmVzcyk7XG5cdFx0XHRcdGNvbnRyYWN0SW5zdGFuY2UuZW1pdCgnaW5zdGFuY2UnLCBpbnN0YW5jZSk7XG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIGNvbnRyYWN0SW5zdGFuY2U7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBjYWxsKHsuLi5hcmdzfSkge1xuXHRcdGNvbnNvbGUubG9nKFwiJWMgV2ViMyBjYWxsaW5nIGZ1bmN0aW9ucy4uLiBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdGNvbnN0IGNvaW5iYXNlID0gYXJncy5jb2luYmFzZTtcblx0XHRjb25zdCBwYXNzd29yZCA9IGFyZ3MucGFzc3dvcmQ7XG5cdFx0Y29uc3QgY29udHJhY3QgPSBhcmdzLmNvbnRyYWN0O1xuXHRcdGNvbnN0IGFiaUl0ZW0gPSBhcmdzLmFiaUl0ZW07XG5cdFx0dmFyIHBhcmFtcyA9IGFyZ3MucGFyYW1zIHx8IFtdO1xuXG5cdFx0dGhpcy53ZWIzLmV0aC5kZWZhdWx0QWNjb3VudCA9IGNvaW5iYXNlO1xuXHRcdHRyeSB7XG5cdFx0XHQvLyBQcmVwYXJlIHBhcmFtcyBmb3IgY2FsbFxuXHRcdFx0cGFyYW1zID0gcGFyYW1zLm1hcChwYXJhbSA9PiB7XG5cdFx0XHRcdGlmKHBhcmFtLnR5cGUuZW5kc1dpdGgoJ1tdJykpIHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyYW0udmFsdWUuc2VhcmNoKCcsICcpID4gMCA/IHBhcmFtLnZhbHVlLnNwbGl0KCcsICcpIDogcGFyYW0udmFsdWUuc3BsaXQoJywnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihwYXJhbS50eXBlLmluZGV4T2YoJ2ludCcpID4gLTEpIHtcblx0XHRcdFx0XHRyZXR1cm4gbmV3IHRoaXMud2ViMy51dGlscy5CTihwYXJhbS52YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHBhcmFtLnZhbHVlO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEhhbmRsZSBmYWxsYmFja1xuXHRcdFx0aWYoYWJpSXRlbS50eXBlID09PSAnZmFsbGJhY2snKSB7XG5cdFx0XHRcdGlmKHBhc3N3b3JkKSB7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy53ZWIzLmV0aC5wZXJzb25hbC51bmxvY2tBY2NvdW50KGNvaW5iYXNlLCBwYXNzd29yZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5zZW5kVHJhbnNhY3Rpb24oe1xuXHRcdFx0XHRcdGZyb206IGNvaW5iYXNlLFxuXHRcdFx0XHRcdHRvOiBjb250cmFjdC5vcHRpb25zLmFkZHJlc3MsXG5cdFx0XHRcdFx0dmFsdWU6IGFiaUl0ZW0ucGF5YWJsZVZhbHVlIHx8IDBcblx0XHRcdFx0fSlcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblxuXHRcdFx0aWYoYWJpSXRlbS5jb25zdGFudCA9PT0gZmFsc2UgfHwgYWJpSXRlbS5wYXlhYmxlID09PSB0cnVlKSB7XG5cdFx0XHRcdGlmKHBhc3N3b3JkKSB7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy53ZWIzLmV0aC5wZXJzb25hbC51bmxvY2tBY2NvdW50KGNvaW5iYXNlLCBwYXNzd29yZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYocGFyYW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBjb250cmFjdC5tZXRob2RzW2FiaUl0ZW0ubmFtZV0oLi4ucGFyYW1zKS5zZW5kKHsgZnJvbTogY29pbmJhc2UsIHZhbHVlOiBhYmlJdGVtLnBheWFibGVWYWx1ZSB9KTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbnRyYWN0Lm1ldGhvZHNbYWJpSXRlbS5uYW1lXSgpLnNlbmQoeyBmcm9tOiBjb2luYmFzZSwgdmFsdWU6IGFiaUl0ZW0ucGF5YWJsZVZhbHVlIH0pO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdFx0aWYocGFyYW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgY29udHJhY3QubWV0aG9kc1thYmlJdGVtLm5hbWVdKC4uLnBhcmFtcykuY2FsbCh7IGZyb206IGNvaW5iYXNlIH0pO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgY29udHJhY3QubWV0aG9kc1thYmlJdGVtLm5hbWVdKCkuY2FsbCh7IGZyb206IGNvaW5iYXNlIH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0Y2F0Y2goZSkge1xuXHRcdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBmdW5jUGFyYW1zVG9BcnJheShjb250cmFjdEZ1bmN0aW9uKSB7XG5cdFx0aWYoY29udHJhY3RGdW5jdGlvbiAmJiBjb250cmFjdEZ1bmN0aW9uLmlucHV0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBpbnB1dEVsZW1lbnRzID0gYXdhaXQgUHJvbWlzZS5hbGwoY29udHJhY3RGdW5jdGlvbi5pbnB1dHMubWFwKGFzeW5jIChpbnB1dCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW2lucHV0LnR5cGUsIGlucHV0Lm5hbWVdO1xuXHRcdFx0fSkpO1xuXHRcdFx0cmV0dXJuIGlucHV0RWxlbWVudHM7XG5cdFx0fVxuXHRcdHJldHVybiBbXTtcblx0fVxuXHRhc3luYyBpbnB1dHNUb0FycmF5KHBhcmFtT2JqZWN0KSB7XG5cdFx0aWYocGFyYW1PYmplY3QudHlwZS5lbmRzV2l0aCgnW10nKSkge1xuXHRcdFx0cmV0dXJuIHBhcmFtT2JqZWN0LnZhbHVlLnNwbGl0KCcsJykubWFwKHZhbCA9PiB0aGlzLndlYjMudXRpbHMudG9IZXgodmFsLnRyaW0oKSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy53ZWIzLnV0aWxzLnRvSGV4KHBhcmFtT2JqZWN0LnZhbHVlKTtcblx0fVxuXHRzaG93UGFuZWxFcnJvcihlcnJfbWVzc2FnZSkge1xuXHRcdGxldCBtZXNzYWdlcztcblx0XHRtZXNzYWdlcyA9IG5ldyBNZXNzYWdlUGFuZWxWaWV3KHsgdGl0bGU6ICdFdGhlcmF0b20gcmVwb3J0JyB9KTtcblx0XHRtZXNzYWdlcy5hdHRhY2goKTtcblx0XHRtZXNzYWdlcy5hZGQobmV3IFBsYWluTWVzc2FnZVZpZXcoeyBtZXNzYWdlOiBlcnJfbWVzc2FnZSwgY2xhc3NOYW1lOiAncmVkLW1lc3NhZ2UnIH0pKTtcblx0fVxuXHRzaG93T3V0cHV0KHsuLi5hcmdzfSkge1xuXHRcdGNvbnN0IGFkZHJlc3MgPSBhcmdzLmFkZHJlc3M7XG5cdFx0Y29uc3QgZGF0YSA9IGFyZ3MuZGF0YTtcblx0XHRjb25zdCBtZXNzYWdlcyA9IG5ldyBNZXNzYWdlUGFuZWxWaWV3KHsgdGl0bGU6ICdFdGhlcmF0b20gb3V0cHV0JyB9KTtcblx0XHRtZXNzYWdlcy5hdHRhY2goKTtcblx0XHRtZXNzYWdlcy5hZGQobmV3IFBsYWluTWVzc2FnZVZpZXcoe1xuXHRcdFx0bWVzc2FnZTogJ0NvbnRyYWN0IGFkZHJlc3M6ICcgKyBhZGRyZXNzLFxuXHRcdFx0Y2xhc3NOYW1lOiAnZ3JlZW4tbWVzc2FnZSdcblx0XHR9KSk7XG5cdFx0aWYoZGF0YSBpbnN0YW5jZW9mIE9iamVjdCkge1xuXHRcdFx0Y29uc3QgcmF3TWVzc2FnZSA9IGA8aDY+Q29udHJhY3Qgb3V0cHV0OjwvaDY+PHByZT4ke0pTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDQpfTwvcHJlPmBcblx0XHRcdG1lc3NhZ2VzLmFkZChuZXcgUGxhaW5NZXNzYWdlVmlldyh7XG5cdFx0XHRcdG1lc3NhZ2U6IHJhd01lc3NhZ2UsXG5cdFx0XHRcdHJhdzogdHJ1ZSxcblx0XHRcdFx0Y2xhc3NOYW1lOiAnZ3JlZW4tbWVzc2FnZSdcblx0XHRcdH0pKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0bWVzc2FnZXMuYWRkKG5ldyBQbGFpbk1lc3NhZ2VWaWV3KHtcblx0XHRcdG1lc3NhZ2U6ICdDb250cmFjdCBvdXRwdXQ6ICcgKyBkYXRhLFxuXHRcdFx0Y2xhc3NOYW1lOiAnZ3JlZW4tbWVzc2FnZSdcblx0XHR9KSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdC8vIFRyYW5zYWN0aW9uIGFuYWx5c2lzXG5cdGFzeW5jIGdldFR4QW5hbHlzaXModHhIYXNoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRUcmFuc2FjdGlvbih0eEhhc2gpO1xuXHRcdFx0Y29uc3QgdHJhbnNhY3Rpb25SZWNpcHQgPSBhd2FpdCB0aGlzLndlYjMuZXRoLmdldFRyYW5zYWN0aW9uUmVjZWlwdCh0eEhhc2gpO1xuXHRcdFx0cmV0dXJuIHsgdHJhbnNhY3Rpb24sIHRyYW5zYWN0aW9uUmVjaXB0IH07XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHQvLyBHYXMgTGltaXRcblx0YXN5bmMgZ2V0R2FzTGltaXQoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGJsb2NrID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRCbG9jaygnbGF0ZXN0Jyk7XG5cdFx0XHRyZXR1cm4gYmxvY2suZ2FzTGltaXQ7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBnZXRBY2NvdW50cygpIHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGF3YWl0IHRoaXMud2ViMy5ldGguZ2V0QWNjb3VudHMoKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBnZXRNaW5pbmcoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBhd2FpdCB0aGlzLndlYjMuZXRoLmlzTWluaW5nKCk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YXN5bmMgZ2V0SGFzaHJhdGUoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBhd2FpdCB0aGlzLndlYjMuZXRoLmdldEhhc2hyYXRlKCk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cbn1cbiIsIid1c2UgYmFiZWwnXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHVybCBmcm9tICd1cmwnXG5pbXBvcnQgdmFsaWRVcmwgZnJvbSAndmFsaWQtdXJsJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVHaXRodWJDYWxsKGZ1bGxwYXRoLCByZXBvUGF0aCwgcGF0aCwgZmlsZW5hbWUsIGZpbGVSb290KSB7XG4gICAgcmV0dXJuIGF3YWl0IGF4aW9zKHtcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy8nICsgcmVwb1BhdGggKyAnL2NvbnRlbnRzLycgKyBwYXRoLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJ1xuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYoJ2NvbnRlbnQnIGluIHJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1ZiA9IEJ1ZmZlci5mcm9tKHJlc3BvbnNlLmRhdGEuY29udGVudCwgJ2Jhc2U2NCcpO1xuICAgICAgICAgICAgZmlsZVJvb3QgPSBmdWxscGF0aC5zdWJzdHJpbmcoMCwgZnVsbHBhdGgubGFzdEluZGV4T2YoXCIvXCIpKTtcbiAgICAgICAgICAgIGZpbGVSb290ID0gZmlsZVJvb3QgKyAnLyc7XG4gICAgICAgICAgICBjb25zdCByZXNwID0geyBmaWxlbmFtZSwgY29udGVudDogYnVmLnRvU3RyaW5nKCdVVEYtOCcpLCBmaWxlUm9vdCB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyAnQ29udGVudCBub3QgcmVjZWl2ZWQhJztcbiAgICAgICAgfVxuICAgIH0pXG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVMb2NhbEltcG9ydChwYXRoU3RyaW5nLCBmaWxlbmFtZSwgZmlsZVJvb3QpIHtcbiAgICBjb25zdCBvID0geyBlbmNvZGluZzogJ1VURi04JyB9O1xuICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKGZpbGVSb290LCBwYXRoU3RyaW5nLCBmaWxlbmFtZSksIG8pO1xuICAgIGZpbGVSb290ID0gcGF0aC5yZXNvbHZlKGZpbGVSb290LCBwYXRoU3RyaW5nKTtcbiAgICBjb25zdCByZXNwb25zZSA9IHsgZmlsZW5hbWUsIGNvbnRlbnQsIGZpbGVSb290IH07XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0SGFuZGxlcnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ2xvY2FsJyxcbiAgICAgICAgICAgIG1hdGNoOiAvKF4oPyEoPzpodHRwOlxcL1xcLyl8KD86aHR0cHM6XFwvXFwvKT8oPzp3d3cuKT8oPzpnaXRodWIuY29tKSkpKF5cXC8qW1xcdystXy9dKlxcLykqPyhcXHcrLnNvbCkvZyxcbiAgICAgICAgICAgIGhhbmRsZTogYXN5bmMgKG1hdGNoLCBmaWxlUm9vdCkgPT4geyByZXR1cm4gYXdhaXQgaGFuZGxlTG9jYWxJbXBvcnQobWF0Y2hbMl0sIG1hdGNoWzNdLCBmaWxlUm9vdCkgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnZ2l0aHViJyxcbiAgICAgICAgICAgIG1hdGNoOiAvXihodHRwcz86XFwvXFwvKT8od3d3Lik/Z2l0aHViLmNvbVxcLyhbXlxcL10qXFwvW15cXC9dKikoLipcXC8oXFx3Ky5zb2wpKS9nLFxuICAgICAgICAgICAgaGFuZGxlOiBhc3luYyAobWF0Y2gsIGZpbGVSb290KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGhhbmRsZUdpdGh1YkNhbGwobWF0Y2hbMF0sIG1hdGNoWzNdLCBtYXRjaFs0XSwgbWF0Y2hbNV0sIGZpbGVSb290KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlc29sdmVJbXBvcnRzKGZpbGVSb290LCBzb3VyY2VQYXRoKSB7XG4gICAgY29uc3QgaGFuZGxlcnMgPSBhd2FpdCBnZXRIYW5kbGVycygpO1xuICAgIGxldCByZXNwb25zZSA9IHt9O1xuICAgIGZvcihjb25zdCBoYW5kbGVyIG9mIGhhbmRsZXJzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBoZXJlIHdlIGFyZSB0cnlpbmcgdG8gZmluZCB0eXBlIG9mIGltcG9ydCBwYXRoIGdpdGh1Yi9zd2FybS9pcGZzL2xvY2FsXG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IGhhbmRsZXIubWF0Y2guZXhlYyhzb3VyY2VQYXRoKTtcbiAgICAgICAgICAgIGlmKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBoYW5kbGVyLmhhbmRsZShtYXRjaCwgZmlsZVJvb3QpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbWJpbmVTb3VyY2UoZmlsZVJvb3QsIHNvdXJjZXMpIHtcbiAgICBsZXQgZm4sIGlsaW5lLCBpcjtcbiAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgIGlyID0gL15pbXBvcnQqXFwgW1xcJ1xcXCJdKC4rKVtcXCdcXFwiXVxcOy9nbTtcbiAgICBsZXQgbWF0Y2ggPSBudWxsO1xuICAgIGZvciAoY29uc3QgZmlsZU5hbWUgb2YgT2JqZWN0LmtleXMoc291cmNlcykpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gc291cmNlc1tmaWxlTmFtZV0uY29udGVudDtcbiAgICAgICAgd2hpbGUobWF0Y2ggPSBpci5leGVjKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIG1hdGNoZXMucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBtYXRjaCBvZiBtYXRjaGVzKSB7XG4gICAgICAgICAgICBpbGluZSA9IG1hdGNoWzBdO1xuICAgICAgICAgICAgaWYodmFsaWRVcmwuaXNVcmkoZmlsZVJvb3QpKSB7XG4gICAgICAgICAgICAgICAgZm4gPSB1cmwucmVzb2x2ZShmaWxlUm9vdCwgbWF0Y2hbMV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbiA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgc3ViU29yY2UgPSB7fTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlc29sdmVJbXBvcnRzKGZpbGVSb290LCBmbik7XG4gICAgICAgICAgICAgICAgc291cmNlc1tmaWxlTmFtZV0uY29udGVudCA9IHNvdXJjZXNbZmlsZU5hbWVdLmNvbnRlbnQucmVwbGFjZShpbGluZSwgJ2ltcG9ydCBcXCcnICsgcmVzcG9uc2UuZmlsZW5hbWUgKyAnXFwnOycpO1xuICAgICAgICAgICAgICAgIHN1YlNvcmNlW3Jlc3BvbnNlLmZpbGVuYW1lXSA9IHsgY29udGVudDogcmVzcG9uc2UuY29udGVudCB9O1xuICAgICAgICAgICAgICAgIHNvdXJjZXMgPSBPYmplY3QuYXNzaWduKGF3YWl0IGNvbWJpbmVTb3VyY2UocmVzcG9uc2UuZmlsZVJvb3QsIHN1YlNvcmNlKSwgc291cmNlcyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc291cmNlcztcbn1cbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmNsYXNzIENsaWVudFNlbGVjdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBzZWxlY3RlZEVudjogYXRvbS5jb25maWcuZ2V0KCdldGhlcmF0b20uZXhlY3V0aW9uRW52JylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9oYW5kbGVDaGFuZ2UgPSB0aGlzLl9oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgYXN5bmMgX2hhbmRsZUNoYW5nZShldmVudCkge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2V0aGVyYXRvbS5leGVjdXRpb25FbnYnLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRFbnY6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGNsaWVudHMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xpZW50LXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbiBpY29uLXBsdWdcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbGllbnRzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50cy5tYXAoKGNsaWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsaWVudC1pbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwicmFkaW9cIiBjbGFzcz1cImlucHV0LXJhZGlvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NsaWVudC5wcm92aWRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZEVudiA9PT0gY2xpZW50LnByb3ZpZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiaW5wdXQtbGFiZWwgaW5saW5lLWJsb2NrIGhpZ2hsaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Y2xpZW50LmRlc2N9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGNsaWVudFJlZHVjZXIgfSkgPT4ge1xuICAgIGNvbnN0IHsgY2xpZW50cyB9ID0gY2xpZW50UmVkdWNlcjtcbiAgICByZXR1cm4geyBjbGllbnRzIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywge30pKENsaWVudFNlbGVjdG9yKTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5leHBvcnQgY29uc3QgU0VUX0NPTVBJTElORyA9ICdzZXRfY29tcGlsaW5nJztcbmV4cG9ydCBjb25zdCBTRVRfQ09NUElMRUQgPSAnc2V0X2NvbXBpbGVkJztcbmV4cG9ydCBjb25zdCBTRVRfUEFSQU1TID0gJ3NldF9wYXJhbXMnO1xuZXhwb3J0IGNvbnN0IEFERF9JTlRFUkZBQ0UgPSAnYWRkX2ludGVyZmFjZSc7XG5leHBvcnQgY29uc3QgU0VUX0lOU1RBTkNFID0gJ3NldF9pbnN0YW5jZSc7XG5leHBvcnQgY29uc3QgU0VUX0RFUExPWUVEID0gJ3NldF9kZXBsb3llZCc7XG5leHBvcnQgY29uc3QgU0VUX0dBU19MSU1JVCA9ICdzZXRfZ2FzX2xpbWl0JztcblxuZXhwb3J0IGNvbnN0IFNFVF9DT0lOQkFTRSA9ICdzZXRfY29pbmJhc2UnO1xuZXhwb3J0IGNvbnN0IFNFVF9QQVNTV09SRCA9ICdzZXRfcGFzc3dvcmQnO1xuZXhwb3J0IGNvbnN0IFNFVF9BQ0NPVU5UUyA9ICdzZXRfYWNjb3VudHMnO1xuXG5leHBvcnQgY29uc3QgU0VUX0VSUk9SUyA9ICdzZXRfZXJyb3JzJztcblxuLy8gRXRoZXJldW0gY2xpZW50IGV2ZW50c1xuZXhwb3J0IGNvbnN0IEFERF9QRU5ESU5HX1RSQU5TQUNUSU9OID0gJ2FkZF9wZW5kaW5nX3RyYW5zYWN0aW9uJztcbmV4cG9ydCBjb25zdCBBRERfRVZFTlRTID0gJ2FkZF9sb2dzJztcbmV4cG9ydCBjb25zdCBTRVRfRVZFTlRTID0gJ3NldF9ldmVudHMnO1xuXG4vLyBOb2RlIHZhcmlhYmxlc1xuZXhwb3J0IGNvbnN0IFNFVF9TWU5DX1NUQVRVUyA9ICdzZXRfc3luY19zdGF0dXMnO1xuZXhwb3J0IGNvbnN0IFNFVF9TWU5DSU5HID0gJ3NldF9zeW5jaW5nJztcbmV4cG9ydCBjb25zdCBTRVRfTUlOSU5HID0gJ3NldF9taW5pbmcnO1xuZXhwb3J0IGNvbnN0IFNFVF9IQVNIX1JBVEUgPSAnc2V0X2hhc2hfcmF0ZSc7XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IHsgU0VUX0NPTVBJTEVELCBTRVRfUEFSQU1TLCBBRERfSU5URVJGQUNFLCBTRVRfREVQTE9ZRUQsIFNFVF9JTlNUQU5DRSB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgY29udHJhY3RDb21waWxlZCA9IChkaXNwYXRjaCwgY29tcGlsZWQpID0+IHtcbiAgICBkaXNwYXRjaCh7IHR5cGU6IFNFVF9DT01QSUxFRCwgcGF5bG9hZDogY29tcGlsZWQgfSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0UGFyYW1zSW5wdXQgPSAoeyBjb250cmFjdE5hbWUsIGFiaSB9KSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFNFVF9QQVJBTVMsIHBheWxvYWQ6IHsgY29udHJhY3ROYW1lLCBhYmkgfSB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3QgYWRkSW50ZXJmYWNlID0gKHsgY29udHJhY3ROYW1lLCBDb250cmFjdEFCSSB9KSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IEFERF9JTlRFUkZBQ0UsIHBheWxvYWQ6IHsgY29udHJhY3ROYW1lLCBpbnRlcmZhY2U6IENvbnRyYWN0QUJJIH0gfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNldEluc3RhbmNlID0gKHsgY29udHJhY3ROYW1lLCBpbnN0YW5jZSB9KSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFNFVF9JTlNUQU5DRSwgcGF5bG9hZDogeyBjb250cmFjdE5hbWUsIGluc3RhbmNlIH0gfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNldERlcGxveWVkID0gKHsgY29udHJhY3ROYW1lLCBkZXBsb3llZCB9KSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFNFVF9ERVBMT1lFRCwgcGF5bG9hZDogeyBjb250cmFjdE5hbWUsIGRlcGxveWVkIH0gfSk7XG4gICAgfVxufTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgeyBTRVRfQUNDT1VOVFMsIFNFVF9DT0lOQkFTRSwgU0VUX1BBU1NXT1JEIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBzZXRDb2luYmFzZSA9IChjb2luYmFzZSkgPT4ge1xuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBTRVRfQ09JTkJBU0UsIHBheWxvYWQ6IGNvaW5iYXNlIH0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzZXRQYXNzd29yZCA9ICh7IHBhc3N3b3JkIH0pID0+IHtcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogU0VUX1BBU1NXT1JELCBwYXlsb2FkOiB7IHBhc3N3b3JkIH0gfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNldEFjY291bnRzID0gKHsgYWNjb3VudHMgfSkgPT4ge1xuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBTRVRfQUNDT1VOVFMsIHBheWxvYWQ6IGFjY291bnRzIH0pO1xuICAgIH1cbn07XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IHsgQUREX0VWRU5UUyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgYWRkTmV3RXZlbnRzID0gKHsgcGF5bG9hZCB9KSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IEFERF9FVkVOVFMsIHBheWxvYWQgfSk7XG4gICAgfVxufTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgeyBTRVRfU1lOQ19TVEFUVVMsIFNFVF9NSU5JTkcsIFNFVF9IQVNIX1JBVEUgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IHNldFN5bmNTdGF0dXMgPSAoc3RhdHVzKSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFNFVF9TWU5DX1NUQVRVUywgcGF5bG9hZDogc3RhdHVzIH0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzZXRNaW5pbmcgPSAobWluaW5nKSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFNFVF9NSU5JTkcsIHBheWxvYWQ6IG1pbmluZyB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBzZXRIYXNocmF0ZSA9IChoYXNocmF0ZSkgPT4ge1xuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBTRVRfSEFTSF9SQVRFLCBwYXlsb2FkOiBoYXNocmF0ZSB9KTtcbiAgICB9XG59XG4iLCIndXNlIGJhYmVsJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xuXG5jbGFzcyBHYXNJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgZ2FzOiBwcm9wcy5nYXNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgIGNvbnN0IHsgZ2FzIH0gPSBuZXh0UHJvcHM7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBnYXMgfSk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBnYXNMaW1pdCB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgY29uc3QgeyBjb250cmFjdE5hbWUgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImdhcy1lc3RpbWF0ZS1mb3JtXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImlucHV0IHRleHQtc3VidGxlXCI+R2FzIHN1cHBseTwvYnV0dG9uPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgaWQ9e2NvbnRyYWN0TmFtZSArICdfZ2FzJ31cbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dHNcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmdhc31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5wcm9wcy5vbkNoYW5nZX0+XG4gICAgICAgICAgICA8L2lucHV0PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIj5HYXMgTGltaXQgOiB7Z2FzTGltaXR9PC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGNvbnRyYWN0IH0pID0+IHtcblx0Y29uc3QgeyBjb21waWxlZCwgZ2FzTGltaXQgfSA9IGNvbnRyYWN0O1xuXHRyZXR1cm4geyBjb21waWxlZCwgZ2FzTGltaXQgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7fSkoR2FzSW5wdXQpO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgc2V0UGFyYW1zSW5wdXQgfSBmcm9tICcuLi8uLi9hY3Rpb25zJztcblxuY2xhc3MgSW5wdXRzRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVDaGFuZ2UgPSB0aGlzLl9oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgX2hhbmRsZUNoYW5nZShpbnB1dCwgZXZlbnQpIHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBjb250cmFjdE5hbWUsIGFiaSB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgaWQ9e2NvbnRyYWN0TmFtZSArICdfaW5wdXRzJ30+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBhYmkudHlwZSA9PT0gJ2NvbnN0cnVjdG9yJyAmJlxuICAgICAgICAgICAgICAgICAgICBhYmkuaW5wdXRzLm1hcCgoaW5wdXQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0ga2V5PXtpfSBvblN1Ym1pdD17dGhpcy5wcm9wcy5vblN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiaW5wdXQgdGV4dC1zdWJ0bGVcIj57IGlucHV0Lm5hbWUgfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtpfSB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImlucHV0c1wiIHBsYWNlaG9sZGVyPXtpbnB1dC50eXBlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2lucHV0LnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLl9oYW5kbGVDaGFuZ2UoaW5wdXQsIGUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBjb250cmFjdCB9KSA9PiB7XG5cdGNvbnN0IHsgY29tcGlsZWQgfSA9IGNvbnRyYWN0O1xuXHRyZXR1cm4geyBjb21waWxlZCB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHsgc2V0UGFyYW1zSW5wdXQgfSkoSW5wdXRzRm9ybSk7XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBzZXRJbnN0YW5jZSwgc2V0RGVwbG95ZWQsIGFkZE5ld0V2ZW50cyB9IGZyb20gJy4uLy4uL2FjdGlvbnMnO1xuXG5jbGFzcyBDcmVhdGVCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5oZWxwZXJzID0gcHJvcHMuaGVscGVycztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yUGFyYW1zOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb2luYmFzZTogcHJvcHMuY29pbmJhc2UsXG4gICAgICAgICAgICBwYXNzd29yZDogcHJvcHMucGFzc3dvcmQsXG4gICAgICAgICAgICBhdEFkZHJlc3M6IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hhbmRsZUF0QWRkcmVzc0NoYW5nZSA9IHRoaXMuX2hhbmRsZUF0QWRkcmVzc0NoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVTdWJtaXQgPSB0aGlzLl9oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgYXN5bmMgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIGNvbnN0IHsgYWJpIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICB2YXIgaW5wdXRzID0gW107XG4gICAgICAgIGZvciAobGV0IGFiaU9iaiBpbiBhYmkpIHtcbiAgICAgICAgICAgIGlmIChhYmlbYWJpT2JqXS50eXBlID09PSAnY29uc3RydWN0b3InICYmIGFiaVthYmlPYmpdLmlucHV0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRzID0gYWJpW2FiaU9ial0uaW5wdXRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb25zdHJ1Y3RvclBhcmFtczogaW5wdXRzIH0pO1xuICAgIH1cbiAgICBhc3luYyBfaGFuZGxlQXRBZGRyZXNzQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhdEFkZHJlc3M6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAgICB9XG4gICAgYXN5bmMgX2hhbmRsZVN1Ym1pdCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgYWJpLCBieXRlY29kZSwgY29udHJhY3ROYW1lLCBnYXMsIGNvaW5iYXNlLCBwYXNzd29yZCB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgICAgIGNvbnN0IHsgYXRBZGRyZXNzIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICAgICAgY29uc3QgY29udHJhY3RJbnRlcmZhY2UgPSB0aGlzLnByb3BzLmludGVyZmFjZXNbY29udHJhY3ROYW1lXS5pbnRlcmZhY2U7XG4gICAgICAgICAgICBjb25zdCBjb25zdHJ1Y3RvciA9IGNvbnRyYWN0SW50ZXJmYWNlLmZpbmQoaW50ZXJmYWNlSXRlbSA9PiBpbnRlcmZhY2VJdGVtLnR5cGUgPT09ICdjb25zdHJ1Y3RvcicpO1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gW107XG4gICAgICAgICAgICBpZihjb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaW5wdXQgb2YgY29uc3RydWN0b3IuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGlucHV0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRyYWN0ID0gYXdhaXQgdGhpcy5oZWxwZXJzLmNyZWF0ZSh7IGNvaW5iYXNlLCBwYXNzd29yZCwgYXRBZGRyZXNzLCBhYmksIGJ5dGVjb2RlLCBjb250cmFjdE5hbWUsIGdhcyB9KTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0SW5zdGFuY2UoeyBjb250cmFjdE5hbWUsIGluc3RhbmNlOiBPYmplY3QuYXNzaWduKHt9LCBjb250cmFjdCkgfSk7XG5cbiAgICAgICAgICAgIGlmKCFhdEFkZHJlc3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cmFjdEluc3RhbmNlID0gYXdhaXQgdGhpcy5oZWxwZXJzLmRlcGxveShjb250cmFjdCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNldERlcGxveWVkKHsgY29udHJhY3ROYW1lLCBkZXBsb3llZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICBjb250cmFjdEluc3RhbmNlLm9uKCdhZGRyZXNzJywgYWRkcmVzcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0Lm9wdGlvbnMuYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0SW5zdGFuY2UoeyBjb250cmFjdE5hbWUsIGluc3RhbmNlOiBPYmplY3QuYXNzaWduKHt9LCBjb250cmFjdCkgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udHJhY3RJbnN0YW5jZS5vbigndHJhbnNhY3Rpb25IYXNoJywgdHJhbnNhY3Rpb25IYXNoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3QudHJhbnNhY3Rpb25IYXNoID0gdHJhbnNhY3Rpb25IYXNoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNldEluc3RhbmNlKHsgY29udHJhY3ROYW1lLCBpbnN0YW5jZTogT2JqZWN0LmFzc2lnbih7fSwgY29udHJhY3QpIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRyYWN0SW5zdGFuY2Uub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlbHBlcnMuc2hvd1BhbmVsRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRyYWN0SW5zdGFuY2Uub24oJ2luc3RhbmNlJywgaW5zdGFuY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5ldmVudHMuYWxsRXZlbnRzKHsgZnJvbUJsb2NrOiAnbGF0ZXN0JyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdsb2dzJywgKGxvZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGxvZ3MgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGRhdGEgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2VkJywgKGNoYW5nZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGNoYW5nZWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udHJhY3RJbnN0YW5jZS5vbignZXJyb3InLCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVscGVycy5zaG93UGFuZWxFcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRyYWN0Lm9wdGlvbnMuYWRkcmVzcyA9IGF0QWRkcmVzcztcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNldERlcGxveWVkKHsgY29udHJhY3ROYW1lLCBkZXBsb3llZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNldEluc3RhbmNlKHsgY29udHJhY3ROYW1lLCBpbnN0YW5jZTogT2JqZWN0LmFzc2lnbih7fSwgY29udHJhY3QpIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRyYWN0LmV2ZW50cy5hbGxFdmVudHMoeyBmcm9tQmxvY2s6ICdsYXRlc3QnIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignbG9ncycsIChsb2dzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGxvZ3MgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGRhdGEgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlZCcsIChjaGFuZ2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGNoYW5nZWQgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIHRoaXMuaGVscGVycy5zaG93UGFuZWxFcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY29udHJhY3ROYW1lIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuX2hhbmRsZVN1Ym1pdH0gY2xhc3NOYW1lPVwicGFkZGVkXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT1cIkRlcGxveSB0byBibG9ja2NoYWluXCJcbiAgICAgICAgICAgICAgICAgICAgcmVmPXtjb250cmFjdE5hbWV9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBpbmxpbmUtYmxvY2stdGlnaHRcIj5cbiAgICAgICAgICAgICAgICA8L2lucHV0PlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiYXQ6XCIgY2xhc3NOYW1lPVwiaW5wdXRzXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuYXRBZGRyZXNzfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5faGFuZGxlQXRBZGRyZXNzQ2hhbmdlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBjb250cmFjdCwgYWNjb3VudCB9KSA9PiB7XG4gICAgY29uc3QgeyBjb21waWxlZCwgaW50ZXJmYWNlcyB9ID0gY29udHJhY3Q7XG4gICAgY29uc3QgeyBjb2luYmFzZSwgcGFzc3dvcmQgfSA9IGFjY291bnQ7XG4gICAgcmV0dXJuIHsgY29tcGlsZWQsIGludGVyZmFjZXMsIGNvaW5iYXNlLCBwYXNzd29yZCB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHsgc2V0RGVwbG95ZWQsIHNldEluc3RhbmNlLCBhZGROZXdFdmVudHMgfSkoQ3JlYXRlQnV0dG9uKTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IGFkZEludGVyZmFjZSB9IGZyb20gJy4uLy4uL2FjdGlvbnMnO1xuaW1wb3J0IFJlYWN0SnNvbiBmcm9tICdyZWFjdC1qc29uLXZpZXcnO1xuaW1wb3J0IHsgVGFiLCBUYWJzLCBUYWJMaXN0LCBUYWJQYW5lbCB9IGZyb20gJ3JlYWN0LXRhYnMnO1xuaW1wb3J0IEdhc0lucHV0IGZyb20gJy4uL0dhc0lucHV0JztcbmltcG9ydCBJbnB1dHNGb3JtIGZyb20gJy4uL0lucHV0c0Zvcm0nO1xuaW1wb3J0IENyZWF0ZUJ1dHRvbiBmcm9tICcuLi9DcmVhdGVCdXR0b24nO1xuXG5jbGFzcyBDb250cmFjdENvbXBpbGVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBlc3RpbWF0ZWRHYXM6IDkwMDAwMDAsXG4gICAgICAgICAgICBDb250cmFjdEFCSTogcHJvcHMuaW50ZXJmYWNlc1twcm9wcy5jb250cmFjdE5hbWVdLmludGVyZmFjZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9oYW5kbGVHYXNDaGFuZ2UgPSB0aGlzLl9oYW5kbGVHYXNDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlSW5wdXQgPSB0aGlzLl9oYW5kbGVJbnB1dC5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBhc3luYyBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgY29pbmJhc2UsIGJ5dGVjb2RlIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgY29uc3QgZ2FzID0gYXdhaXQgdGhpcy5oZWxwZXJzLmdldEdhc0VzdGltYXRlKGNvaW5iYXNlLCBieXRlY29kZSk7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZXN0aW1hdGVkR2FzOiBnYXMgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgdGhpcy5oZWxwZXJzLnNob3dQYW5lbEVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9oYW5kbGVHYXNDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVzdGltYXRlZEdhczogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuICAgIH1cbiAgICBfaGFuZGxlSW5wdXQoKSB7XG4gICAgICAgIGNvbnN0IHsgY29udHJhY3ROYW1lIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBjb25zdCB7IENvbnRyYWN0QUJJIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICB0aGlzLnByb3BzLmFkZEludGVyZmFjZSh7IGNvbnRyYWN0TmFtZSwgQ29udHJhY3RBQkkgfSk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBjb250cmFjdE5hbWUsIGJ5dGVjb2RlLCBpbmRleCB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgY29uc3QgeyBlc3RpbWF0ZWRHYXMsIENvbnRyYWN0QUJJIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRyYWN0LWNvbnRlbnRcIiBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNvbnRyYWN0LW5hbWUgaW5saW5lLWJsb2NrIGhpZ2hsaWdodC1zdWNjZXNzXCI+eyBjb250cmFjdE5hbWUgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnl0ZS1jb2RlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxwcmUgY2xhc3M9XCJsYXJnZS1jb2RlXCI+eyBKU09OLnN0cmluZ2lmeShieXRlY29kZSkgfTwvcHJlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhYmktZGVmaW5pdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8VGFicz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWJMaXN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJfYnRuc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0blwiPkludGVyZmFjZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG5cIj5JbnRlcmZhY2UgT2JqZWN0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWJMaXN0PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHByZSBjbGFzcz1cImxhcmdlLWNvZGVcIj57IEpTT04uc3RyaW5naWZ5KENvbnRyYWN0QUJJKSB9PC9wcmU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxSZWFjdEpzb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtDb250cmFjdEFCSX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU9XCJjaGFsa1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlEYXRhVHlwZXM9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkPXsyfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZVN0cmluZ3NBZnRlckxlbmd0aD17MzJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25TdHlsZT1cInRyaWFuZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgICAgICAgICAgPC9UYWJzPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQ29udHJhY3RBQkkubWFwKChhYmksIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8SW5wdXRzRm9ybSBrZXk9e2l9IGNvbnRyYWN0TmFtZT17Y29udHJhY3ROYW1lfSBhYmk9e2FiaX0gb25TdWJtaXQ9e3RoaXMuX2hhbmRsZUlucHV0fS8+O1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8R2FzSW5wdXQgY29udHJhY3ROYW1lPXtjb250cmFjdE5hbWV9IGdhcz17ZXN0aW1hdGVkR2FzfSBvbkNoYW5nZT17dGhpcy5faGFuZGxlR2FzQ2hhbmdlfSAvPlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgPENyZWF0ZUJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJhY3ROYW1lPXtjb250cmFjdE5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBieXRlY29kZT17Ynl0ZWNvZGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBhYmk9e0NvbnRyYWN0QUJJfVxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FzPXtlc3RpbWF0ZWRHYXN9XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBhY2NvdW50LCBjb250cmFjdCB9KSA9PiB7XG4gICAgY29uc3QgeyBjb21waWxlZCwgaW50ZXJmYWNlcyB9ID0gY29udHJhY3Q7XG4gICAgY29uc3QgeyBjb2luYmFzZSB9ID0gYWNjb3VudDtcbiAgICByZXR1cm4geyBjb21waWxlZCwgaW50ZXJmYWNlcywgY29pbmJhc2UgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7IGFkZEludGVyZmFjZSB9KShDb250cmFjdENvbXBpbGVkKTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY2xhc3MgRnVuY3Rpb25BQkkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5oZWxwZXJzID0gcHJvcHMuaGVscGVycztcbiAgICAgICAgdGhpcy5faGFuZGxlQ2hhbmdlID0gdGhpcy5faGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZVBheWFibGVWYWx1ZSA9IHRoaXMuX2hhbmRsZVBheWFibGVWYWx1ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVGYWxsYmFjayA9IHRoaXMuX2hhbmRsZUZhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZVN1Ym1pdCA9IHRoaXMuX2hhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBfaGFuZGxlQ2hhbmdlKGlucHV0LCBldmVudCkge1xuICAgICAgICBpbnB1dC52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICB9XG4gICAgX2hhbmRsZVBheWFibGVWYWx1ZShhYmksIGV2ZW50KSB7XG4gICAgICAgIGFiaS5wYXlhYmxlVmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfVxuICAgIGFzeW5jIF9oYW5kbGVGYWxsYmFjayhhYmlJdGVtKSB7XG4gICAgICAgIGNvbnN0IHsgY29udHJhY3ROYW1lLCBjb2luYmFzZSwgcGFzc3dvcmQsIGluc3RhbmNlcyB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgY29uc3QgY29udHJhY3QgPSBpbnN0YW5jZXNbY29udHJhY3ROYW1lXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuaGVscGVycy5jYWxsKHsgY29pbmJhc2UsIHBhc3N3b3JkLCBjb250cmFjdCwgYWJpSXRlbSB9KTtcbiAgICAgICAgICAgIHRoaXMuaGVscGVycy5zaG93T3V0cHV0KHsgYWRkcmVzczogY29udHJhY3Qub3B0aW9ucy5hZGRyZXNzLCBkYXRhOiByZXN1bHQgfSk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICB0aGlzLmhlbHBlcnMuc2hvd1BhbmVsRXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgX2hhbmRsZVN1Ym1pdChtZXRob2RJdGVtKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGNvbnRyYWN0TmFtZSwgY29pbmJhc2UsIHBhc3N3b3JkLCBpbnN0YW5jZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBjb25zdCBjb250cmFjdCA9IGluc3RhbmNlc1tjb250cmFjdE5hbWVdO1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IFtdO1xuICAgICAgICAgICAgZm9yKGxldCBpbnB1dCBvZiBtZXRob2RJdGVtLmlucHV0cykge1xuICAgICAgICAgICAgICAgIGlmKGlucHV0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmhlbHBlcnMuY2FsbCh7IGNvaW5iYXNlLCBwYXNzd29yZCwgY29udHJhY3QsIGFiaUl0ZW06IG1ldGhvZEl0ZW0sIHBhcmFtcyB9KTtcbiAgICAgICAgICAgIHRoaXMuaGVscGVycy5zaG93T3V0cHV0KHsgYWRkcmVzczogY29udHJhY3Qub3B0aW9ucy5hZGRyZXNzLCBkYXRhOiByZXN1bHQgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgdGhpcy5oZWxwZXJzLnNob3dQYW5lbEVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBjb250cmFjdE5hbWUsIGludGVyZmFjZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IENvbnRyYWN0QUJJID0gaW50ZXJmYWNlc1tjb250cmFjdE5hbWVdLmludGVyZmFjZTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJpLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQ29udHJhY3RBQkkubWFwKChhYmksIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFiaS50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmdW5jdGlvbi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGtleT17aX0gb25TdWJtaXQ9eygpID0+IHsgdGhpcy5faGFuZGxlU3VibWl0KGFiaSk7IH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9e2FiaS5uYW1lfSBjbGFzc05hbWU9XCJ0ZXh0LXN1YnRsZSBjYWxsLWJ1dHRvblwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYmkuaW5wdXRzLm1hcCgoaW5wdXQsIGopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FsbC1idXR0b24tdmFsdWVzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e2lucHV0Lm5hbWUgKyAnICcgKyBpbnB1dC50eXBlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17aW5wdXQudmFsdWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHRoaXMuX2hhbmRsZUNoYW5nZShpbnB1dCwgZXZlbnQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2p9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJpLnBheWFibGUgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYWxsLWJ1dHRvbi12YWx1ZXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInBheWFibGUgdmFsdWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gdGhpcy5faGFuZGxlUGF5YWJsZVZhbHVlKGFiaSwgZXZlbnQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFiaS50eXBlID09PSAnZmFsbGJhY2snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmYWxsYmFjay1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGtleT17aX0gb25TdWJtaXQ9eygpID0+IHsgdGhpcy5faGFuZGxlRmFsbGJhY2soYWJpKTsgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIj5mYWxsYmFjazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJpLnBheWFibGUgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYWxsLWJ1dHRvbi12YWx1ZXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInNlbmQgZXRoZXIgdG8gY29udHJhY3RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gdGhpcy5faGFuZGxlUGF5YWJsZVZhbHVlKGFiaSwgZXZlbnQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGNvbnRyYWN0LCBhY2NvdW50IH0pID0+IHtcbiAgICBjb25zdCB7IGNvbXBpbGVkLCBpbnRlcmZhY2VzLCBpbnN0YW5jZXMgfSA9IGNvbnRyYWN0O1xuICAgIGNvbnN0IHsgY29pbmJhc2UsIHBhc3N3b3JkIH0gPSBhY2NvdW50O1xuICAgIHJldHVybiB7IGNvbXBpbGVkLCBpbnRlcmZhY2VzLCBpbnN0YW5jZXMsIGNvaW5iYXNlLCBwYXNzd29yZCB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHt9KShGdW5jdGlvbkFCSSk7XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgUmVhY3RKc29uIGZyb20gJ3JlYWN0LWpzb24tdmlldyc7XG5pbXBvcnQgeyBUYWIsIFRhYnMsIFRhYkxpc3QsIFRhYlBhbmVsIH0gZnJvbSAncmVhY3QtdGFicyc7XG5pbXBvcnQgSW5wdXRzRm9ybSBmcm9tICcuLi9JbnB1dHNGb3JtJztcbmltcG9ydCBGdW5jdGlvbkFCSSBmcm9tICcuLi9GdW5jdGlvbkFCSSc7XG5cbmNsYXNzIENvbnRyYWN0RXhlY3V0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBjb250cmFjdE5hbWUsIGJ5dGVjb2RlLCBpbmRleCwgaW5zdGFuY2VzLCBpbnRlcmZhY2VzIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBjb25zdCBjb250cmFjdCA9IGluc3RhbmNlc1tjb250cmFjdE5hbWVdO1xuICAgICAgICBjb25zdCBDb250cmFjdEFCSSA9IGludGVyZmFjZXNbY29udHJhY3ROYW1lXS5pbnRlcmZhY2U7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udHJhY3QtY29udGVudFwiIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY29udHJhY3QtbmFtZSBpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0LXN1Y2Nlc3NcIj57Y29udHJhY3ROYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnl0ZS1jb2RlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxwcmUgY2xhc3M9XCJsYXJnZS1jb2RlXCI+eyBKU09OLnN0cmluZ2lmeShieXRlY29kZSkgfTwvcHJlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhYmktZGVmaW5pdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8VGFicz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWJMaXN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJfYnRuc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0blwiPkludGVyZmFjZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG5cIj5JbnRlcmZhY2UgT2JqZWN0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWJMaXN0PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHByZSBjbGFzcz1cImxhcmdlLWNvZGVcIj57IEpTT04uc3RyaW5naWZ5KENvbnRyYWN0QUJJKSB9PC9wcmU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxSZWFjdEpzb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtDb250cmFjdEFCSX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU9XCJvY2VhblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlEYXRhVHlwZXM9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkPXsyfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICA8L1RhYnM+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb250cmFjdC50cmFuc2FjdGlvbkhhc2ggJiZcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD17Y29udHJhY3ROYW1lICsgJ190eEhhc2gnfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5saW5lLWJsb2NrIGhpZ2hsaWdodFwiPlRyYW5zYWN0aW9uIGhhc2g6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHByZSBjbGFzcz1cImxhcmdlLWNvZGVcIj57Y29udHJhY3QudHJhbnNhY3Rpb25IYXNofTwvcHJlPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAhY29udHJhY3Qub3B0aW9ucy5hZGRyZXNzICYmXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9e2NvbnRyYWN0TmFtZSArICdfc3RhdCd9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzdGF0LW1pbmluZyBzdGF0LW1pbmluZy1hbGlnblwiPndhaXRpbmcgdG8gYmUgbWluZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImxvYWRpbmcgbG9hZGluZy1zcGlubmVyLXRpbnkgaW5saW5lLWJsb2NrIHN0YXQtbWluaW5nLWFsaWduXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb250cmFjdC5vcHRpb25zLmFkZHJlc3MgJiZcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD17Y29udHJhY3ROYW1lICsgJ19zdGF0J30+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlubGluZS1ibG9jayBoaWdobGlnaHRcIj5NaW5lZCBhdDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cHJlIGNsYXNzPVwibGFyZ2UtY29kZVwiPntjb250cmFjdC5vcHRpb25zLmFkZHJlc3N9PC9wcmU+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENvbnRyYWN0QUJJLm1hcCgoYWJpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPElucHV0c0Zvcm0gY29udHJhY3ROYW1lPXtjb250cmFjdE5hbWV9IGFiaT17YWJpfSAvPjtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPEZ1bmN0aW9uQUJJIGNvbnRyYWN0TmFtZT17Y29udHJhY3ROYW1lfSBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBjb250cmFjdCB9KSA9PiB7XG4gICAgY29uc3QgeyBpbnRlcmZhY2VzLCBpbnN0YW5jZXMgfSA9IGNvbnRyYWN0O1xuICAgIHJldHVybiB7IGludGVyZmFjZXMsIGluc3RhbmNlcyB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHt9KShDb250cmFjdEV4ZWN1dGlvbik7XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNsYXNzIEVycm9yVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgZXJyb3Jtc2cgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZXJyb3ItbGlzdCBibG9ja1wiPlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3Jtc2cubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICBlcnJvcm1zZy5tYXAoKG1zZywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkga2V5PXtpfSBjbGFzc05hbWU9XCJsaXN0LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnLnNldmVyaXR5ID09PSAnd2FybmluZycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1hbGVydCB0ZXh0LXdhcm5pbmdcIj57bXNnLmZvcm1hdHRlZE1lc3NhZ2UgfHwgbXNnLm1lc3NhZ2V9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZy5zZXZlcml0eSA9PT0gJ2Vycm9yJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWJ1ZyB0ZXh0LWVycm9yXCI+e21zZy5mb3JtYXR0ZWRNZXNzYWdlIHx8IG1zZy5tZXNzYWdlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICk7XG4gICAgfVxufVxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHsgZXJyb3JzIH0pID0+IHtcbiAgICBjb25zdCB7IGVycm9ybXNnIH0gPSBlcnJvcnM7XG4gICAgcmV0dXJuIHsgZXJyb3Jtc2cgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7fSkoRXJyb3JWaWV3KTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCwgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBDb2xsYXBzZSB9IGZyb20gJ3JlYWN0LWNvbGxhcHNlJztcbmltcG9ydCBDb250cmFjdENvbXBpbGVkIGZyb20gJy4uL0NvbnRyYWN0Q29tcGlsZWQnO1xuaW1wb3J0IENvbnRyYWN0RXhlY3V0aW9uIGZyb20gJy4uL0NvbnRyYWN0RXhlY3V0aW9uJztcbmltcG9ydCBFcnJvclZpZXcgZnJvbSAnLi4vRXJyb3JWaWV3JztcbmltcG9ydCB7IGFkZEludGVyZmFjZSB9IGZyb20gJy4uLy4uL2FjdGlvbnMnO1xuXG5jbGFzcyBDb2xsYXBzZWRGaWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBpc09wZW5lZDogZmFsc2UsXG4gICAgICAgICAgICB0b2dnbGVCdG5TdHlsZTogJ2J0biBpY29uIGljb24tdW5mb2xkIGlubGluZS1ibG9jay10aWdodCcsXG4gICAgICAgICAgICB0b2dnbGVCdG5UeHQ6ICdFeHBhbmQnXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdG9nZ2xlQ29sbGFwc2UgPSB0aGlzLl90b2dnbGVDb2xsYXBzZS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBfdG9nZ2xlQ29sbGFwc2UoKSB7XG4gICAgICAgIGNvbnN0IHsgaXNPcGVuZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc09wZW5lZDogIWlzT3BlbmVkIH0pO1xuICAgICAgICBpZighaXNPcGVuZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUJ0blN0eWxlOiAnYnRuIGJ0bi1zdWNjZXNzIGljb24gaWNvbi1mb2xkIGlubGluZS1ibG9jay10aWdodCcsXG4gICAgICAgICAgICAgICAgdG9nZ2xlQnRuVHh0OiAnQ29sbGFwc2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUJ0blN0eWxlOiAnYnRuIGljb24gaWNvbi11bmZvbGQgaW5saW5lLWJsb2NrLXRpZ2h0JyxcbiAgICAgICAgICAgICAgICB0b2dnbGVCdG5UeHQ6ICdFeHBhbmQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgaXNPcGVuZWQsIHRvZ2dsZUJ0blN0eWxlLCB0b2dnbGVCdG5UeHQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGNvbnN0IHsgZmlsZU5hbWUsIGNvbXBpbGVkLCBkZXBsb3llZCwgY29tcGlsaW5nLCBpbnRlcmZhY2VzIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJsYWJlbCBmaWxlLWNvbGxhcHNlLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPntmaWxlTmFtZX08L2g0PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPXt0b2dnbGVCdG5TdHlsZX0gb25DbGljaz17dGhpcy5fdG9nZ2xlQ29sbGFwc2V9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3RvZ2dsZUJ0blR4dH1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8Q29sbGFwc2UgaXNPcGVuZWQ9e2lzT3BlbmVkfT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29tcGlsZWQuY29udHJhY3RzW2ZpbGVOYW1lXSkubWFwKChjb250cmFjdE5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnl0ZWNvZGUgPSBjb21waWxlZC5jb250cmFjdHNbZmlsZU5hbWVdW2NvbnRyYWN0TmFtZV0uZXZtLmJ5dGVjb2RlLm9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPXtjb250cmFjdE5hbWV9IGNsYXNzPVwiY29udHJhY3QtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWRlcGxveWVkW2NvbnRyYWN0TmFtZV0gJiYgaW50ZXJmYWNlcyAhPT0gbnVsbCAmJiBpbnRlcmZhY2VzW2NvbnRyYWN0TmFtZV0gJiYgY29tcGlsaW5nID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb250cmFjdENvbXBpbGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0TmFtZT17Y29udHJhY3ROYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieXRlY29kZT17Ynl0ZWNvZGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVscGVycz17dGhpcy5oZWxwZXJzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwbG95ZWRbY29udHJhY3ROYW1lXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb250cmFjdEV4ZWN1dGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cmFjdE5hbWU9e2NvbnRyYWN0TmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZWNvZGU9e2J5dGVjb2RlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlbHBlcnM9e3RoaXMuaGVscGVyc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNsYXNzIENvbnRyYWN0cyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmhlbHBlcnMgPSBwcm9wcy5oZWxwZXJzO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY29tcGlsZWQsIGRlcGxveWVkLCBjb21waWxpbmcsIGludGVyZmFjZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3RoaXMucHJvcHMuc3RvcmV9PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjb21waWxlZC1jb2RlXCIgY2xhc3M9XCJjb21waWxlZC1jb2RlXCI+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhjb21waWxlZC5jb250cmFjdHMpLm1hcCgoZmlsZU5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbGxhcHNlZEZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lPXtmaWxlTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVkPXtjb21waWxlZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcGxveWVkPXtkZXBsb3llZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGluZz17Y29tcGlsaW5nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJmYWNlcz17aW50ZXJmYWNlc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlbHBlcnM9e3RoaXMuaGVscGVyc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAhY29tcGlsZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cInRleHQtd2FybmluZyBuby1oZWFkZXJcIj5ObyBjb21waWxlZCBjb250cmFjdCE8L2gyPlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjb21waWxlZC1lcnJvclwiIGNsYXNzPVwiZXJyb3ItY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8RXJyb3JWaWV3IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9Qcm92aWRlcj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGNvbnRyYWN0IH0pID0+IHtcbiAgICBjb25zdCB7IGNvbXBpbGVkLCBkZXBsb3llZCwgY29tcGlsaW5nLCBpbnRlcmZhY2VzIH0gPSBjb250cmFjdDtcbiAgICByZXR1cm4geyBjb21waWxlZCwgZGVwbG95ZWQsIGNvbXBpbGluZywgaW50ZXJmYWNlcyB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHsgYWRkSW50ZXJmYWNlIH0pKENvbnRyYWN0cyk7XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBDb2xsYXBzZSB9IGZyb20gJ3JlYWN0LWNvbGxhcHNlJztcbmltcG9ydCBSZWFjdEpzb24gZnJvbSAncmVhY3QtanNvbi12aWV3JztcbmltcG9ydCBWaXJ0dWFsTGlzdCBmcm9tICdyZWFjdC10aW55LXZpcnR1YWwtbGlzdCc7XG5cbmNsYXNzIFR4QW5hbHl6ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5oZWxwZXJzID0gcHJvcHMuaGVscGVycztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHR4SGFzaDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHhBbmFseXNpczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdG9nZ2xlQnRuU3R5bGU6ICdidG4gaWNvbiBpY29uLXVuZm9sZCBpbmxpbmUtYmxvY2stdGlnaHQnLFxuICAgICAgICAgICAgaXNPcGVuZWQ6IGZhbHNlLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9oYW5kbGVUeEhhc2hDaGFuZ2UgPSB0aGlzLl9oYW5kbGVUeEhhc2hDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlVHhIYXNoU3VibWl0ID0gdGhpcy5faGFuZGxlVHhIYXNoU3VibWl0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX3RvZ2dsZUNvbGxhcHNlID0gdGhpcy5fdG9nZ2xlQ29sbGFwc2UuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIGNvbnN0IHsgcGVuZGluZ1RyYW5zYWN0aW9ucyB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgaWYocGVuZGluZ1RyYW5zYWN0aW9ucy5sZW5ndGggPCAxMCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaXNPcGVuZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgdG9nZ2xlQnRuU3R5bGU6ICdidG4gYnRuLXN1Y2Nlc3MgaWNvbiBpY29uLWZvbGQgaW5saW5lLWJsb2NrLXRpZ2h0J1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBfdG9nZ2xlQ29sbGFwc2UoKSB7XG4gICAgICAgIGNvbnN0IHsgaXNPcGVuZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc09wZW5lZDogIWlzT3BlbmVkIH0pO1xuICAgICAgICBpZighaXNPcGVuZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUJ0blN0eWxlOiAnYnRuIGJ0bi1zdWNjZXNzIGljb24gaWNvbi1mb2xkIGlubGluZS1ibG9jay10aWdodCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgdG9nZ2xlQnRuU3R5bGU6ICdidG4gaWNvbiBpY29uLXVuZm9sZCBpbmxpbmUtYmxvY2stdGlnaHQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfaGFuZGxlVHhIYXNoQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0eEhhc2g6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAgICB9XG4gICAgYXN5bmMgX2hhbmRsZVR4SGFzaFN1Ym1pdCgpIHtcbiAgICAgICAgY29uc3QgeyB0eEhhc2ggfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGlmKHR4SGFzaCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eEFuYWx5c2lzID0gYXdhaXQgdGhpcy5oZWxwZXJzLmdldFR4QW5hbHlzaXModHhIYXNoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdHhBbmFseXNpcyB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgdG9nZ2xlQnRuU3R5bGUsIGlzT3BlbmVkIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICBjb25zdCB7IHBlbmRpbmdUcmFuc2FjdGlvbnMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IHRyYW5zYWN0aW9ucyA9IHBlbmRpbmdUcmFuc2FjdGlvbnMuc2xpY2UoKTtcbiAgICAgICAgdHJhbnNhY3Rpb25zLnJldmVyc2UoKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHgtYW5hbHl6ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZsZXgtcm93XCIgb25TdWJtaXQ9e3RoaXMuX2hhbmRsZVR4SGFzaFN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubGluZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJ0eGhhc2hcIiB2YWx1ZT17dGhpcy5zdGF0ZS50eEhhc2h9IG9uQ2hhbmdlPXt0aGlzLl9oYW5kbGVUeEhhc2hDaGFuZ2V9IHBsYWNlaG9sZGVyPVwiVHJhbnNhY3Rpb24gaGFzaFwiIGNsYXNzPVwiaW5wdXQtc2VhcmNoXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiQW5hbHl6ZVwiIGNsYXNzTmFtZT1cImJ0blwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17dG9nZ2xlQnRuU3R5bGV9IG9uQ2xpY2s9e3RoaXMuX3RvZ2dsZUNvbGxhcHNlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFRyYW5zYWN0aW9uIExpc3RcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPENvbGxhcHNlIGlzT3BlbmVkPXtpc09wZW5lZH0+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9ucy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICA8VmlydHVhbExpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtQ291bnQ9e3RyYW5zYWN0aW9ucy5sZW5ndGh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVNpemU9ezMwfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwidHgtbGlzdC1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJzY2FuQ291bnQ9ezEwfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckl0ZW09eyh7IGluZGV4IH0pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0eC1saXN0LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGFkZGVkIHRleHQtd2FybmluZ1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0cmFuc2FjdGlvbnNbaW5kZXhdfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPC9Db2xsYXBzZT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnN0YXRlLnR4QW5hbHlzaXMgJiYgdGhpcy5zdGF0ZS50eEFuYWx5c2lzLnRyYW5zYWN0aW9uKSAmJlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJsb2NrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiYmxvY2sgaGlnaGxpZ2h0LWluZm8gdHgtaGVhZGVyXCI+VHJhbnNhY3Rpb248L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFJlYWN0SnNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17dGhpcy5zdGF0ZS50eEFuYWx5c2lzLnRyYW5zYWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lPVwiY2hhbGtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlEYXRhVHlwZXM9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlU3RyaW5nc0FmdGVyTGVuZ3RoPXs2NH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uU3R5bGU9XCJ0cmlhbmdsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5zdGF0ZS50eEFuYWx5c2lzICYmIHRoaXMuc3RhdGUudHhBbmFseXNpcy50cmFuc2FjdGlvblJlY2lwdCkgJiZcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJibG9ja1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImJsb2NrIGhpZ2hsaWdodC1pbmZvIHR4LWhlYWRlclwiPlRyYW5zYWN0aW9uIHJlY2VpcHQ8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFJlYWN0SnNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17dGhpcy5zdGF0ZS50eEFuYWx5c2lzLnRyYW5zYWN0aW9uUmVjaXB0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lPVwiY2hhbGtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlEYXRhVHlwZXM9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlU3RyaW5nc0FmdGVyTGVuZ3RoPXs2NH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uU3R5bGU9XCJ0cmlhbmdsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGV2ZW50UmVkdWNlciB9KSA9PiB7XG4gICAgY29uc3QgeyBwZW5kaW5nVHJhbnNhY3Rpb25zIH0gPSBldmVudFJlZHVjZXI7XG4gICAgcmV0dXJuIHsgcGVuZGluZ1RyYW5zYWN0aW9ucyB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHt9KShUeEFuYWx5emVyKTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0SnNvbiBmcm9tICdyZWFjdC1qc29uLXZpZXcnO1xuaW1wb3J0IHsgQ29sbGFwc2UgfSBmcm9tICdyZWFjdC1jb2xsYXBzZSc7XG5cbmNsYXNzIEV2ZW50SXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgaXNPcGVuZWQ6IGZhbHNlLFxuICAgICAgICAgICAgdG9nZ2xlQnRuU3R5bGU6ICdidG4gaWNvbiBpY29uLXVuZm9sZCBpbmxpbmUtYmxvY2stdGlnaHQnLFxuICAgICAgICAgICAgdG9nZ2xlQnRuVHh0OiAnRXhwYW5kJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl90b2dnbGVDb2xsYXBzZSA9IHRoaXMuX3RvZ2dsZUNvbGxhcHNlLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIF90b2dnbGVDb2xsYXBzZSgpIHtcbiAgICAgICAgY29uc3QgeyBpc09wZW5lZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzT3BlbmVkOiAhaXNPcGVuZWQgfSk7XG4gICAgICAgIGlmKCFpc09wZW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgdG9nZ2xlQnRuU3R5bGU6ICdidG4gYnRuLXN1Y2Nlc3MgaWNvbiBpY29uLWZvbGQgaW5saW5lLWJsb2NrLXRpZ2h0JyxcbiAgICAgICAgICAgICAgICB0b2dnbGVCdG5UeHQ6ICdDb2xsYXBzZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgdG9nZ2xlQnRuU3R5bGU6ICdidG4gaWNvbiBpY29uLXVuZm9sZCBpbmxpbmUtYmxvY2stdGlnaHQnLFxuICAgICAgICAgICAgICAgIHRvZ2dsZUJ0blR4dDogJ0V4cGFuZCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBldmVudCB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgY29uc3QgeyBpc09wZW5lZCwgdG9nZ2xlQnRuU3R5bGUsIHRvZ2dsZUJ0blR4dCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJldmVudC1saXN0LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibGFiZWwgZXZlbnQtY29sbGFwc2UtbGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInBhZGRlZCB0ZXh0LXdhcm5pbmdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtldmVudC5pZH0gOiB7ZXZlbnQuZXZlbnR9XG4gICAgICAgICAgICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXt0b2dnbGVCdG5TdHlsZX0gb25DbGljaz17dGhpcy5fdG9nZ2xlQ29sbGFwc2V9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3RvZ2dsZUJ0blR4dH1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8Q29sbGFwc2UgaXNPcGVuZWQ9e2lzT3BlbmVkfT5cbiAgICAgICAgICAgICAgICAgICAgPFJlYWN0SnNvblxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtldmVudH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lPVwiY2hhbGtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheURhdGFUeXBlcz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlU3RyaW5nc0FmdGVyTGVuZ3RoPXs2NH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGljb25TdHlsZT1cInRyaWFuZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50SXRlbTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCBFdmVudEl0ZW0gZnJvbSAnLi4vRXZlbnRJdGVtJztcblxuY2xhc3MgRXZlbnRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBldmVudHMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IGV2ZW50c18gPSBldmVudHMuc2xpY2UoKTtcbiAgICAgICAgZXZlbnRzXy5yZXZlcnNlKCk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImV2ZW50cy1jb250YWluZXIgc2VsZWN0LWxpc3RcIj5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdC1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHNfLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50c18ubWFwKChldmVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxFdmVudEl0ZW0ga2V5PXtpfSBldmVudD17ZXZlbnR9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgIShldmVudHNfLmxlbmd0aCA+IDApICYmXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC13YXJuaW5nIG5vLWhlYWRlclwiPk5vIGV2ZW50cyBmb3VuZCE8L2gyPlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGV2ZW50UmVkdWNlciB9KSA9PiB7XG4gICAgY29uc3QgeyBldmVudHMgfSA9IGV2ZW50UmVkdWNlcjtcbiAgICByZXR1cm4geyBldmVudHMgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7fSkoRXZlbnRzKTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IHNldEFjY291bnRzLCBzZXRTeW5jU3RhdHVzLCBzZXRNaW5pbmcsIHNldEhhc2hyYXRlIH0gZnJvbSAnLi4vLi4vYWN0aW9ucyc7XG5cbmNsYXNzIE5vZGVDb250cm9sIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgICAgIHRoaXMuX3JlZnJlc2hTeW5jID0gdGhpcy5fcmVmcmVzaFN5bmMuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5nZXROb2RlSW5mbyA9IHRoaXMuZ2V0Tm9kZUluZm8uYmluZCh0aGlzKTtcbiAgICB9XG4gICAgYXN5bmMgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMuZ2V0Tm9kZUluZm8oKTtcbiAgICB9XG4gICAgYXN5bmMgX3JlZnJlc2hTeW5jKCkge1xuICAgICAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IHRoaXMuaGVscGVycy5nZXRBY2NvdW50cygpO1xuICAgICAgICB0aGlzLnByb3BzLnNldEFjY291bnRzKHsgYWNjb3VudHMgfSk7XG4gICAgICAgIHRoaXMuZ2V0Tm9kZUluZm8oKTtcbiAgICB9XG4gICAgYXN5bmMgZ2V0Tm9kZUluZm8oKSB7XG4gICAgICAgIC8vIGdldCBzeW5jIHN0YXR1c1xuICAgICAgICBjb25zdCBzeW5jU3RhdCA9IGF3YWl0IHRoaXMuaGVscGVycy5nZXRTeW5jU3RhdCgpO1xuICAgICAgICB0aGlzLnByb3BzLnNldFN5bmNTdGF0dXMoc3luY1N0YXQpO1xuICAgICAgICAvLyBnZXQgbWluaW5nIHN0YXR1c1xuICAgICAgICBjb25zdCBtaW5pbmcgPSBhd2FpdCB0aGlzLmhlbHBlcnMuZ2V0TWluaW5nKCk7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0TWluaW5nKG1pbmluZyk7XG4gICAgICAgIC8vIGdldCBoYXNocmF0ZVxuICAgICAgICBjb25zdCBoYXNoUmF0ZSA9IGF3YWl0IHRoaXMuaGVscGVycy5nZXRIYXNocmF0ZSgpO1xuICAgICAgICB0aGlzLnByb3BzLnNldEhhc2hyYXRlKGhhc2hSYXRlKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGNvaW5iYXNlLCBzdGF0dXMsIHN5bmNpbmcsIG1pbmluZywgaGFzaFJhdGUgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJOb2RlQ29udHJvbFwiPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9J2xpc3QtZ3JvdXAnPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsaXN0LWl0ZW0nPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0Jz5Db2luYmFzZTo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayc+eyBjb2luYmFzZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAoT2JqZWN0LmtleXMoc3RhdHVzKS5sZW5ndGggPiAwICYmIHN0YXR1cyBpbnN0YW5jZW9mIE9iamVjdCkgJiZcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xpc3QtaXRlbSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0Jz5TeW5jIHByb2dyZXNzOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cHJvZ3Jlc3MgY2xhc3NOYW1lPSdpbmxpbmUtYmxvY2snIG1heD0nMTAwJyB2YWx1ZT17ICgxMDAgKiAoc3RhdHVzLmN1cnJlbnRCbG9jay9zdGF0dXMuaGlnaGVzdEJsb2NrKSkudG9GaXhlZCgyKSB9PjwvcHJvZ3Jlc3M+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpbmxpbmUtYmxvY2snPnsgKDEwMCAqIChzdGF0dXMuY3VycmVudEJsb2NrL3N0YXR1cy5oaWdoZXN0QmxvY2spKS50b0ZpeGVkKDIpIH0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xpc3QtaXRlbSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0Jz5DdXJyZW50IEJsb2NrOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayc+eyBzdGF0dXMuY3VycmVudEJsb2NrIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbGlzdC1pdGVtJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayBoaWdobGlnaHQnPkhpZ2hlc3QgQmxvY2s6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naW5saW5lLWJsb2NrJz57IHN0YXR1cy5oaWdoZXN0QmxvY2sgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsaXN0LWl0ZW0nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naW5saW5lLWJsb2NrIGhpZ2hsaWdodCc+S25vd24gU3RhdGVzOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayc+eyBzdGF0dXMua25vd25TdGF0ZXMgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPSdsaXN0LWl0ZW0nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naW5saW5lLWJsb2NrIGhpZ2hsaWdodCc+UHVsbGVkIFN0YXRlczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayc+eyBzdGF0dXMucHVsbGVkU3RhdGVzIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbGlzdC1pdGVtJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayBoaWdobGlnaHQnPlN0YXJ0aW5nIEJsb2NrOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayc+eyBzdGF0dXMuc3RhcnRpbmdCbG9jayB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAhc3luY2luZyAmJlxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibGlzdC1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbGlzdC1pdGVtJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayBoaWdobGlnaHQnPlN5bmNpbmc6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naW5saW5lLWJsb2NrJz57IGAke3N5bmNpbmd9YCB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT0nbGlzdC1pdGVtJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naW5saW5lLWJsb2NrIGhpZ2hsaWdodCc+TWluaW5nOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naW5saW5lLWJsb2NrJz57IGAke21pbmluZ31gIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9J2xpc3QtaXRlbSc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZS1ibG9jayBoaWdobGlnaHQnPkhhc2hyYXRlOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0naW5saW5lLWJsb2NrJz57IGhhc2hSYXRlIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9e3RoaXMuX3JlZnJlc2hTeW5jfT5SZWZyZXNoPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGFjY291bnQsIG5vZGUgfSkgPT4ge1xuICAgIGNvbnN0IHsgY29pbmJhc2UgfSA9IGFjY291bnQ7XG4gICAgY29uc3QgeyBzdGF0dXMsIHN5bmNpbmcsIG1pbmluZywgaGFzaFJhdGUgfSA9IG5vZGU7XG4gICAgcmV0dXJuIHsgY29pbmJhc2UsIHN0YXR1cywgc3luY2luZywgbWluaW5nLCBoYXNoUmF0ZSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHsgc2V0QWNjb3VudHMsIHNldFN5bmNTdGF0dXMsIHNldE1pbmluZywgc2V0SGFzaHJhdGUgfSkoTm9kZUNvbnRyb2wpO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgQ29kZUFuYWx5c2lzIH0gZnJvbSAncmVtaXgtc29saWRpdHknO1xuaW1wb3J0IENoZWNrYm94VHJlZSBmcm9tICdyZWFjdC1jaGVja2JveC10cmVlJztcblxuY2xhc3MgU3RhdGljQW5hbHlzaXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5oZWxwZXJzID0gcHJvcHMuaGVscGVycztcbiAgICAgICAgdGhpcy5hbmxzUnVubmVyID0gbmV3IENvZGVBbmFseXNpcygpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgYW5sc01vZHVsZXM6IHRoaXMuYW5sc1J1bm5lci5tb2R1bGVzKCksXG4gICAgICAgICAgICBub2RlczogdGhpcy5fZ2V0Tm9kZXModGhpcy5hbmxzUnVubmVyLm1vZHVsZXMoKSksXG4gICAgICAgICAgICBjaGVja2VkOiBbXSxcbiAgICAgICAgICAgIGFuYWx5c2lzOiBbXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9ydW5BbmFseXNpcyA9IHRoaXMuX3J1bkFuYWx5c2lzLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAvLyBNYXJrIGFsbCBtb2R1bGVzIGNoZWNrZWQgaW4gdGhlIGJlZ2luaW5nXG4gICAgICAgIGNvbnN0IHsgbm9kZXMgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGNvbnN0IGNoZWNrZWQgPSBbXTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjaGVja2VkLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNoZWNrZWQgfSk7XG4gICAgfVxuICAgIF9nZXROb2Rlcyhtb2R1bGVzKSB7XG4gICAgICAgIHJldHVybiBtb2R1bGVzLm1hcCgobW9kdWxlLCBpKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge30sIHsgdmFsdWU6IGksIGxhYmVsOiBtb2R1bGUuZGVzY3JpcHRpb24sIGluZGV4OiBpIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgX3J1bkFuYWx5c2lzKCkge1xuICAgICAgICBjb25zdCB7IGNoZWNrZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGNvbnN0IHsgY29tcGlsZWQgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGlmKGNvbXBpbGVkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYW5hbHlzaXMgPSBhd2FpdCB0aGlzLmdldEFuYWx5c2lzKGNvbXBpbGVkLCBjaGVja2VkKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhbmFseXNpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFuYWx5c2lzIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZ2V0QW5hbHlzaXMoY29tcGlsZWQsIGNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYW5sc1J1bm5lci5ydW4oY29tcGlsZWQsIGNoZWNrZWQsIChhbmFseXNpcywgZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUoYW5hbHlzaXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgbm9kZXMsIGFuYWx5c2lzIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGF0aWMtYW5hbHl6ZXJcIj5cbiAgICAgICAgICAgICAgICA8Q2hlY2tib3hUcmVlXG4gICAgICAgICAgICAgICAgICAgIG5vZGVzPXtub2Rlc31cbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5zdGF0ZS5jaGVja2VkfVxuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZD17dGhpcy5zdGF0ZS5leHBhbmRlZH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGVjaz17Y2hlY2tlZCA9PiB0aGlzLnNldFN0YXRlKHsgY2hlY2tlZCB9KX1cbiAgICAgICAgICAgICAgICAgICAgc2hvd05vZGVJY29uPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5IGlubGluZS1ibG9jay10aWdodFwiIG9uQ2xpY2s9e3RoaXMuX3J1bkFuYWx5c2lzfT5cbiAgICAgICAgICAgICAgICAgICAgUnVuIGFuYWx5c2lzXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBhbmFseXNpcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgIGFuYWx5c2lzLm1hcChhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGEucmVwb3J0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZGRlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEucmVwb3J0Lm1hcCgocmVwb3J0LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBvcnQubG9jYXRpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pbmZvXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmVwb3J0LmxvY2F0aW9ufXsnICd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBvcnQud2FybmluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdhcm5pbmdcIiBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHJlcG9ydC53YXJuaW5nIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0Lm1vcmUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ0ZXh0LWluZm9cIiBocmVmPXtyZXBvcnQubW9yZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlcG9ydC5tb3JlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBjb250cmFjdCB9KSA9PiB7XG4gICAgY29uc3QgeyBjb21waWxlZCB9ID0gY29udHJhY3Q7XG4gICAgcmV0dXJuIHsgY29tcGlsZWQgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7fSkoU3RhdGljQW5hbHlzaXMpO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBUYWIsIFRhYnMsIFRhYkxpc3QsIFRhYlBhbmVsIH0gZnJvbSAncmVhY3QtdGFicyc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IENvbnRyYWN0cyBmcm9tICcuLi9Db250cmFjdHMnO1xuaW1wb3J0IFR4QW5hbHl6ZXIgZnJvbSAnLi4vVHhBbmFseXplcic7XG5pbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cyc7XG5pbXBvcnQgTm9kZUNvbnRyb2wgZnJvbSAnLi4vTm9kZUNvbnRyb2wnO1xuaW1wb3J0IFN0YXRpY0FuYWx5c2lzIGZyb20gJy4uL1N0YXRpY0FuYWx5c2lzJztcblxuY2xhc3MgVGFiVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmhlbHBlcnMgPSBwcm9wcy5oZWxwZXJzO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgdHhCdG5TdHlsZTogJ2J0bicsXG4gICAgICAgICAgICBldmVudEJ0blN0eWxlOiAnYnRuJyxcbiAgICAgICAgICAgIG5ld1R4Q291bnRlcjogMCxcbiAgICAgICAgICAgIG5ld0V2ZW50Q291bnRlcjogMFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hhbmRsZVRhYlNlbGVjdCA9IHRoaXMuX2hhbmRsZVRhYlNlbGVjdC5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBfaGFuZGxlVGFiU2VsZWN0KGluZGV4KSB7XG4gICAgICAgIGlmKGluZGV4ID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmV3VHhDb3VudGVyOiAwLCB0eEJ0blN0eWxlOiAnYnRuJyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZihpbmRleCA9PT0gMykge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5ld0V2ZW50Q291bnRlcjogMCwgZXZlbnRCdG5TdHlsZTogJ2J0bicgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgIGNvbnN0IHsgbmV3VHhDb3VudGVyLCBuZXdFdmVudENvdW50ZXIgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGlmKHRoaXMucHJvcHMucGVuZGluZ1RyYW5zYWN0aW9ucyAhPT0gbmV4dFByb3BzLnBlbmRpbmdUcmFuc2FjdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBuZXdUeENvdW50ZXI6IG5ld1R4Q291bnRlcisxLCB0eEJ0blN0eWxlOiAnYnRuIGJ0bi1lcnJvcicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5wcm9wcy5ldmVudHMgIT09IG5leHRQcm9wcy5ldmVudHMgJiYgbmV4dFByb3BzLmV2ZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmV3RXZlbnRDb3VudGVyOiBuZXdFdmVudENvdW50ZXIrMSwgZXZlbnRCdG5TdHlsZTogJ2J0biBidG4tZXJyb3InIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBldmVudEJ0blN0eWxlLCB0eEJ0blN0eWxlLCBuZXdUeENvdW50ZXIsIG5ld0V2ZW50Q291bnRlciB9ID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFRhYnMgb25TZWxlY3Q9e2luZGV4ID0+IHRoaXMuX2hhbmRsZVRhYlNlbGVjdChpbmRleCl9IGNsYXNzTmFtZT1cInJlYWN0LXRhYnMgdmVydGljYWwtdGFic1wiPlxuICAgICAgICAgICAgICAgIDxUYWJMaXN0IGNsYXNzTmFtZT1cInJlYWN0LXRhYnNfX3RhYi1saXN0IHZlcnRpY2FsIHRhYmxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0YWJfYnRuc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0blwiPkNvbnRyYWN0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG5cIj5BbmFseXNpczwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0eEJ0blN0eWxlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJhbnNhY3Rpb24gYW5hbHl6ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VHhDb3VudGVyID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdiYWRnZSBiYWRnZS1zbWFsbCBiYWRnZS1lcnJvciBub3RpZnktYmFkZ2UnPntuZXdUeENvdW50ZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2V2ZW50QnRuU3R5bGV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFdmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnRDb3VudGVyID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdiYWRnZSBiYWRnZS1zbWFsbCBiYWRnZS1lcnJvciBub3RpZnktYmFkZ2UnPntuZXdFdmVudENvdW50ZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG5cIj5Ob2RlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4gYnRuLXdhcm5pbmdcIj5IZWxwPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9UYWJMaXN0PlxuXG4gICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICA8Q29udHJhY3RzIHN0b3JlPXt0aGlzLnByb3BzLnN0b3JlfSBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9IC8+XG4gICAgICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgICAgIDxTdGF0aWNBbmFseXNpcyBzdG9yZT17dGhpcy5wcm9wcy5zdG9yZX0gaGVscGVycz17dGhpcy5oZWxwZXJzfSAvPlxuICAgICAgICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICA8VHhBbmFseXplciBzdG9yZT17dGhpcy5wcm9wcy5zdG9yZX0gaGVscGVycz17dGhpcy5oZWxwZXJzfSAvPlxuICAgICAgICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICA8RXZlbnRzIHN0b3JlPXt0aGlzLnByb3BzLnN0b3JlfSBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9IC8+XG4gICAgICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgICAgIDxOb2RlQ29udHJvbCBzdG9yZT17dGhpcy5wcm9wcy5zdG9yZX0gaGVscGVycz17dGhpcy5oZWxwZXJzfSAvPlxuICAgICAgICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC13YXJuaW5nXCI+SGVscCBFdGhlcmF0b20gdG8ga2VlcCBzb2xpZGl0eSBkZXZlbG9wbWVudCBpbnRlcmFjdGl2ZS48L2gyPlxuICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC1zdWNjZXNzXCI+RG9uYXRlIEV0aGVyZXVtOiAweGQyMmZFNGFFRmVkMEE5ODRCMTE2NWRjMjQwOTU3MjhFRTcwMDVhMzY8L2g0PlxuICAgICAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkV0aGVyYXRvbSBuZXdzIDwvc3Bhbj48YSBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9oYXNodGFnL0V0aGVyYXRvbVwiPiNFdGhlcmF0b208L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgICAgICBDb250YWN0OiA8YSBocmVmPVwibWFpbHRvOjBta2FyQHByb3Rvbm1haWwuY29tXCIgdGFyZ2V0PVwiX3RvcFwiPjBta2FyQHByb3Rvbm1haWwuY29tPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgIDwvVGFicz5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGNvbnRyYWN0LCBldmVudFJlZHVjZXIgfSkgPT4ge1xuICAgIGNvbnN0IHsgY29tcGlsZWQgfSA9IGNvbnRyYWN0O1xuICAgIGNvbnN0IHsgcGVuZGluZ1RyYW5zYWN0aW9ucywgZXZlbnRzIH0gPSBldmVudFJlZHVjZXI7XG4gICAgcmV0dXJuIHsgY29tcGlsZWQsIHBlbmRpbmdUcmFuc2FjdGlvbnMsIGV2ZW50cyB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHt9KShUYWJWaWV3KTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7IHNldENvaW5iYXNlLCBzZXRQYXNzd29yZCB9IGZyb20gJy4uLy4uL2FjdGlvbnMnO1xuXG5jbGFzcyBDb2luYmFzZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5oZWxwZXJzID0gcHJvcHMuaGVscGVycztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvaW5iYXNlOiBwcm9wcy5hY2NvdW50c1swXSxcbiAgICAgICAgICAgIGJhbGFuY2U6IDAuMDAsXG4gICAgICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgICAgICB1bmxvY2tfc3R5bGU6ICd1bmxvY2stZGVmYXVsdCdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5faGFuZGxlQWNjQ2hhbmdlID0gdGhpcy5faGFuZGxlQWNjQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZVBhc3N3b3JkQ2hhbmdlID0gdGhpcy5faGFuZGxlUGFzc3dvcmRDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlVW5sb2NrID0gdGhpcy5faGFuZGxlVW5sb2NrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2xpbmtDbGljayA9IHRoaXMuX2xpbmtDbGljay5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBhc3luYyBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgY29uc3QgeyBjb2luYmFzZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgY29uc3QgYmFsYW5jZSA9IGF3YWl0IHRoaXMuaGVscGVycy5nZXRCYWxhbmNlKGNvaW5iYXNlKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJhbGFuY2UgfSk7XG4gICAgfVxuICAgIF9saW5rQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgY29uc3QgeyBjb2luYmFzZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoY29pbmJhc2UpO1xuICAgIH1cbiAgICBhc3luYyBfaGFuZGxlQWNjQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvaW5iYXNlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICBjb25zdCBiYWxhbmNlID0gYXdhaXQgdGhpcy5oZWxwZXJzLmdldEJhbGFuY2UoY29pbmJhc2UpO1xuICAgICAgICB0aGlzLnByb3BzLnNldENvaW5iYXNlKGNvaW5iYXNlKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvaW5iYXNlLCBiYWxhbmNlIH0pO1xuICAgIH1cbiAgICBfaGFuZGxlUGFzc3dvcmRDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgcGFzc3dvcmQgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwYXNzd29yZCB9KTtcbiAgICAgICAgLy8gVE9ETzogdW5sZXNzIHdlIHNob3cgc29tZSBpbmRpY2F0b3Igb24gYFVubG9ja2AgbGV0IHBhc3N3b3JkIHNldCBvbiBjaGFuZ2VcbiAgICAgICAgaWYgKCEoKHBhc3N3b3JkLmxlbmd0aCAtIDEpID4gMCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB1bmxvY2tfc3R5bGU6ICd1bmxvY2stZGVmYXVsdCcgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2hhbmRsZVVubG9jayhldmVudCkge1xuICAgICAgICAvLyBUT0RPOiBoZXJlIHRyeSB0byB1bmxvY2sgZ2V0aCBiYWNrZW5kIG5vZGUgdXNpbmcgY29pbmJhc2UgYW5kIHBhc3N3b3JkIGFuZCBzaG93IHJlc3VsdFxuICAgICAgICBjb25zdCB7IHBhc3N3b3JkIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICBpZiAocGFzc3dvcmQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRQYXNzd29yZCh7IHBhc3N3b3JkIH0pO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHVubG9ja19zdHlsZTogJ3VubG9jay1hY3RpdmUnIH0pO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBiYWxhbmNlLCBwYXNzd29yZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgY29uc3QgeyBhY2NvdW50cyB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvbiBpY29uLWxpbmsgYnRuIGNvcHktYnRuIGJ0bi1zdWNjZXNzXCIgb25DbGljaz17dGhpcy5fbGlua0NsaWNrfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBvbkNoYW5nZT17dGhpcy5faGFuZGxlQWNjQ2hhbmdlfSB2YWx1ZT17dGhpcy5zdGF0ZS5jb2luYmFzZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3VudHMubWFwKChhY2NvdW50LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXthY2NvdW50fT57YWNjb3VudH08L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPntiYWxhbmNlfSBFVEg8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzcz1cInJvd1wiIG9uU3VibWl0PXt0aGlzLl9oYW5kbGVVbmxvY2t9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvbiBpY29uLWxvY2tcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIlBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9oYW5kbGVQYXNzd29yZENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPXt0aGlzLnN0YXRlLnVubG9ja19zdHlsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPVwiVW5sb2NrXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBhY2NvdW50IH0pID0+IHtcbiAgICBjb25zdCB7IGNvaW5iYXNlLCBwYXNzd29yZCwgYWNjb3VudHMgfSA9IGFjY291bnQ7XG4gICAgcmV0dXJuIHsgY29pbmJhc2UsIHBhc3N3b3JkLCBhY2NvdW50cyB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHsgc2V0Q29pbmJhc2UsIHNldFBhc3N3b3JkIH0pKENvaW5iYXNlVmlldyk7XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNsYXNzIENvbXBpbGVCdG4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlU3VibWl0ID0gdGhpcy5faGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gICAgfVxuICAgIGFzeW5jIF9oYW5kbGVTdWJtaXQoKSB7XG4gICAgICAgIGNvbnN0IHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgICAgICBhd2FpdCBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdldGgtaW50ZXJmYWNlOmNvbXBpbGUnKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGNvbXBpbGluZyB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxmb3JtIGNsYXNzPVwicm93XCIgb25TdWJtaXQ9e3RoaXMuX2hhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb21waWxpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIkNvbXBpbGluZy4uLlwiIGNsYXNzPVwiYnRuIGNvcHktYnRuIGJ0bi1zdWNjZXNzXCIgZGlzYWJsZWQgLz5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAhY29tcGlsaW5nICYmXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJDb21waWxlXCIgY2xhc3M9XCJidG4gY29weS1idG4gYnRuLXN1Y2Nlc3NcIiAvPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGNvbnRyYWN0IH0pID0+IHtcbiAgICBjb25zdCB7IGNvbXBpbGluZyB9ID0gY29udHJhY3Q7XG4gICAgcmV0dXJuIHsgY29tcGlsaW5nIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywge30pKENvbXBpbGVCdG4pO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgY3JlYXRlUmVhY3RDbGFzcyBmcm9tICdjcmVhdGUtcmVhY3QtY2xhc3MnXG5pbXBvcnQgUmVhY3RVcGRhdGUgZnJvbSAncmVhY3QtYWRkb25zLXVwZGF0ZSdcbmltcG9ydCBSZWFjdEpzb24gZnJvbSAncmVhY3QtanNvbi12aWV3J1xuaW1wb3J0IFdlYjNIZWxwZXJzIGZyb20gJy4vbWV0aG9kcydcbmltcG9ydCBDbGllbnRTZWxlY3RvciBmcm9tICcuLi9jb21wb25lbnRzL0NsaWVudFNlbGVjdG9yJ1xuaW1wb3J0IFRhYlZpZXcgZnJvbSAnLi4vY29tcG9uZW50cy9UYWJWaWV3J1xuaW1wb3J0IENvaW5iYXNlVmlldyBmcm9tICcuLi9jb21wb25lbnRzL0NvaW5iYXNlVmlldydcbmltcG9ydCBDb21waWxlQnRuIGZyb20gJy4uL2NvbXBvbmVudHMvQ29tcGlsZUJ0bidcbmltcG9ydCB7IFNFVF9BQ0NPVU5UUywgU0VUX0NPSU5CQVNFIH0gZnJvbSAnLi4vYWN0aW9ucy90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XG5cdGNvbnN0cnVjdG9yKHN0b3JlLCB3ZWIzKSB7XG5cdFx0dGhpcy5BY2NvdW50cyA9IFtdO1xuXHRcdHRoaXMuY29pbmJhc2UgPSBudWxsO1xuXHRcdHRoaXMud2ViMyA9IHdlYjM7XG5cdFx0dGhpcy5zdG9yZSA9IHN0b3JlO1xuXHRcdHRoaXMuaGVscGVycyA9IG5ldyBXZWIzSGVscGVycyh0aGlzLndlYjMpO1xuXHR9XG5cdGNyZWF0ZUNvbXBpbGVyT3B0aW9uc1ZpZXcoKSB7XG5cdFx0UmVhY3RET00ucmVuZGVyKDxDbGllbnRTZWxlY3RvciBzdG9yZT17dGhpcy5zdG9yZX0gLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGllbnQtb3B0aW9ucycpKTtcblx0fVxuXHRhc3luYyBjcmVhdGVDb2luYmFzZVZpZXcoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGFjY291bnRzID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRBY2NvdW50cygpO1xuXHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9BQ0NPVU5UUywgcGF5bG9hZDogYWNjb3VudHMgfSk7XG5cdFx0XHR0aGlzLnN0b3JlLmRpc3BhdGNoKHsgdHlwZTogU0VUX0NPSU5CQVNFLCBwYXlsb2FkOiBhY2NvdW50c1swXSB9KTtcblx0XHRcdFJlYWN0RE9NLnJlbmRlcig8Q29pbmJhc2VWaWV3IHN0b3JlPXt0aGlzLnN0b3JlfSBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9IC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWNjb3VudHMtbGlzdCcpKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdHRoaXMuaGVscGVycy5zaG93UGFuZWxFcnJvcihcIk5vIGFjY291bnQgZXhpc3RzISBQbGVhc2UgY3JlYXRlIG9uZS5cIik7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRjcmVhdGVCdXR0b25zVmlldygpIHtcblx0XHRSZWFjdERPTS5yZW5kZXIoPENvbXBpbGVCdG4gc3RvcmU9e3RoaXMuc3RvcmV9IC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29tcGlsZV9idG4nKSk7XG5cdH1cblx0Y3JlYXRlVGFiVmlldygpIHtcblx0XHRSZWFjdERPTS5yZW5kZXIoPFRhYlZpZXcgc3RvcmU9e3RoaXMuc3RvcmV9IGhlbHBlcnM9e3RoaXMuaGVscGVyc30vPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYl92aWV3JykpO1xuXHR9XG5cdGNyZWF0ZVRleHRhcmVhUih0ZXh0KSB7XG5cdFx0dmFyIHRleHROb2RlO1xuXHRcdHRoaXMudGV4dCA9IHRleHQ7XG5cdFx0dGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKTtcblx0XHR0ZXh0Tm9kZS50ZXh0Q29udGVudCA9IHRoaXMudGV4dDtcblx0XHR0ZXh0Tm9kZS5jbGFzc0xpc3QuYWRkKCdsYXJnZS1jb2RlJyk7XG5cdFx0cmV0dXJuIHRleHROb2RlO1xuXHR9XG5cdGFzeW5jIGdldEFkZHJlc3NlcyhjYWxsYmFjaykge1xuXHRcdHJldHVybiB0aGlzLndlYjMuZXRoLmdldEFjY291bnRzKGZ1bmN0aW9uKGVyciwgYWNjb3VudHMpIHtcblx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKCdFcnJvciBubyBiYXNlIGFjY291bnQhJywgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgYWNjb3VudHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vLyB3ZWIzLmpzIHNob3VsZCBiZSB1c2UgdG8gaGFuZGxlIGFsbCB3ZWIzIGNvbXBpbGF0aW9uIGV2ZW50c1xuLy8gRXZlcnkgc29saWRpdHkgZmlsZSBjYW4gYmUgY29tcGlsZWQgaW4gdHdvIHdheXMganN2bSBhbmQgZXRoZXJldW0gZW5kcG9pbnRcbi8vIEFmdGVyIGV2ZXJ5IGNvbW1hbmQgaXMgaW52b2tlZCBjb21waWxhdGlvbiBlbmRwb2ludCBzaG91bGQgYmUgY2hvc2VuXG4vLyBJZiBKc1ZNIGlzIGNvbXBpbGF0aW9uIGVuZHBvaW50IFZNIHdpbGwgYmUgdXNlZCB0byBjb21waWxlIGFuZCBleGVjdXRlIHNvbGlkaXR5IHByb2dyYW1cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBXZWIzIGZyb20gJ3dlYjMnXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgV2ViM0hlbHBlcnMgZnJvbSAnLi9tZXRob2RzJ1xuaW1wb3J0IHsgY29tYmluZVNvdXJjZSB9IGZyb20gJy4uL2hlbHBlcnMvY29tcGlsZXItaW1wb3J0cydcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldydcbmltcG9ydCB7XG5cdFNFVF9DT01QSUxFRCxcblx0QUREX0lOVEVSRkFDRSxcblx0U0VUX0NPTVBJTElORyxcblx0U0VUX0VSUk9SUyxcblx0QUREX1BFTkRJTkdfVFJBTlNBQ1RJT04sXG5cdFNFVF9FVkVOVFMsXG5cdFNFVF9HQVNfTElNSVQsXG5cdFNFVF9TWU5DX1NUQVRVUyxcblx0U0VUX1NZTkNJTkdcbn0gZnJvbSAnLi4vYWN0aW9ucy90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViM0VudiB7XG5cdGNvbnN0cnVjdG9yKHN0b3JlKSB7XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHR0aGlzLndlYjNTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHR0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHR0aGlzLmNvbXBpbGVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHR0aGlzLnN0b3JlID0gc3RvcmU7XG5cdFx0dGhpcy5vYnNlcnZlQ29uZmlnKCk7XG5cdH1cblx0ZGlzcG9zZSgpIHtcblx0XHRpZih0aGlzLnN1YnNjcmlwdGlvbnMpIHtcblx0XHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblx0XHR9XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuXG5cdFx0aWYodGhpcy5zYXZlU3Vic2NyaXB0aW9ucykge1xuXHRcdFx0dGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblx0XHR9XG5cdFx0dGhpcy5zYXZlU3Vic2NyaXB0aW9ucyA9IG51bGxcblxuXHRcdGlmKHRoaXMud2ViM1N1YnNjcmlwdGlvbnMpIHtcblx0XHRcdHRoaXMud2ViM1N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cdFx0fVxuXHRcdHRoaXMud2ViM1N1YnNjcmlwdGlvbnMgPSBudWxsXG5cdH1cblx0ZGVzdHJveSgpIHtcblx0XHRpZih0aGlzLnNhdmVTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHR0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXHRcdH1cblx0XHR0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbnVsbFxuXG5cdFx0aWYodGhpcy5jb21waWxlU3Vic2NyaXB0aW9ucykge1xuXHRcdFx0dGhpcy5jb21waWxlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblx0XHR9XG5cdFx0dGhpcy5jb21waWxlU3Vic2NyaXB0aW9ucyA9IG51bGxcblxuXHRcdGlmKHRoaXMud2ViM1N1YnNjcmlwdGlvbnMpIHtcblx0XHRcdHRoaXMud2ViM1N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cdFx0fVxuXHRcdHRoaXMud2ViM1N1YnNjcmlwdGlvbnMgPSBudWxsXG5cdH1cblx0b2JzZXJ2ZUNvbmZpZygpIHtcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2V0aGVyYXRvbS5leGVjdXRpb25FbnYnLCAoZXhlY3V0aW9uRW52KSA9PiB7XG5cdFx0XHRpZih0aGlzLndlYjNTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHRcdHRoaXMuZGVzdHJveSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdFx0XHRpZihleGVjdXRpb25FbnYgPT0gJ3dlYjMnKSB7XG5cdFx0XHRcdHRoaXMuc3Vic2NyaWJlVG9XZWIzQ29tbWFuZHMoKTtcblx0XHRcdFx0dGhpcy5zdWJzY3JpYmVUb1dlYjNFdmVudHMoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9KSk7XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnZXRoZXJhdG9tLmV4ZWN1dGlvbkVudicsIChlbnZDaGFuZ2UpID0+IHtcblx0XHRcdGlmKGVudkNoYW5nZS5uZXdWYWx1ZSAhPT0gJ3dlYjMnKSB7XG5cdFx0XHRcdHRoaXMuZGVzdHJveSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZW52Q2hhbmdlLm5ld1ZhbHVlID09ICd3ZWIzJykge1xuXHRcdFx0XHRpZih0aGlzLndlYjNTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHRcdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdFx0XHRcdHRoaXMuc3Vic2NyaWJlVG9XZWIzQ29tbWFuZHMoKTtcblx0XHRcdFx0dGhpcy5zdWJzY3JpYmVUb1dlYjNFdmVudHMoKTtcblx0XHRcdH1cblx0XHR9KSk7XG5cdH1cblxuXHQvLyBTdWJzY3JpcHRpb25zXG5cdHN1YnNjcmliZVRvV2ViM0NvbW1hbmRzKCkge1xuXHRcdGlmKCF0aGlzLndlYjNTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2V0aC1pbnRlcmZhY2U6Y29tcGlsZScsICgpID0+IHtcblx0XHRcdGlmKHRoaXMuY29tcGlsZVN1YnNjcmlwdGlvbnMpIHtcblx0XHRcdFx0dGhpcy5jb21waWxlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNvbXBpbGVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHRcdHRoaXMuc3Vic2NyaWJlVG9Db21waWxlRXZlbnRzKCk7XG5cdFx0fSkpO1xuXHR9XG5cdHN1YnNjcmliZVRvV2ViM0V2ZW50cygpIHtcblx0XHRpZighdGhpcy53ZWIzU3Vic2NyaXB0aW9ucykge1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdGNvbnN0IHJwY0FkZHJlc3MgPSBhdG9tLmNvbmZpZy5nZXQoJ2V0aGVyYXRvbS5ycGNBZGRyZXNzJyk7XG5cdFx0Y29uc3Qgd2Vic29ja2V0QWRkcmVzcyA9IGF0b20uY29uZmlnLmdldCgnZXRoZXJhdG9tLndlYnNvY2tldEFkZHJlc3MnKVxuXHRcdGlmKHR5cGVvZiB0aGlzLndlYjMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR0aGlzLndlYjMgPSBuZXcgV2ViMyh0aGlzLndlYjMuY3VycmVudFByb3ZpZGVyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy53ZWIzID0gbmV3IFdlYjMoV2ViMy5naXZlblByb3ZpZGVyIHx8IG5ldyBXZWIzLnByb3ZpZGVycy5IdHRwUHJvdmlkZXIocnBjQWRkcmVzcykpO1xuXHRcdFx0aWYod2Vic29ja2V0QWRkcmVzcykge1xuXHRcdFx0XHR0aGlzLndlYjMuc2V0UHJvdmlkZXIobmV3IFdlYjMucHJvdmlkZXJzLldlYnNvY2tldFByb3ZpZGVyKHdlYnNvY2tldEFkZHJlc3MpKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaGVscGVycyA9IG5ldyBXZWIzSGVscGVycyh0aGlzLndlYjMpO1xuXHRcdH1cblx0XHR0aGlzLnZpZXcgPSBuZXcgVmlldyh0aGlzLnN0b3JlLCB0aGlzLndlYjMpO1xuXHRcdGlmKE9iamVjdC5pcyh0aGlzLndlYjMuY3VycmVudFByb3ZpZGVyLmNvbnN0cnVjdG9yLCBXZWIzLnByb3ZpZGVycy5XZWJzb2NrZXRQcm92aWRlcikpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiJWMgUHJvdmlkZXIgaXMgd2Vic29ja2V0LiBDcmVhdGluZyBzdWJzY3JpcHRpb25zLi4uIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0XHQvLyBuZXdCbG9ja0hlYWRlcnMgc3Vic2NyaWJlclxuXHRcdFx0dGhpcy53ZWIzLmV0aC5zdWJzY3JpYmUoJ25ld0Jsb2NrSGVhZGVycycpXG5cdFx0XHRcdC5vbihcImRhdGFcIiwgKGJsb2NrcykgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiJWMgbmV3QmxvY2tIZWFkZXJzOmRhdGEgXCIsICdiYWNrZ3JvdW5kOiByZ2JhKDM2LCAxOTQsIDIwMywgMC4zKTsgY29sb3I6ICNFRjUyNUInKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhibG9ja3MpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ2Vycm9yJywgKGUpID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIiVjIG5ld0Jsb2NrSGVhZGVyczplcnJvciBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0Ly8gcGVuZGluZ1RyYW5zYWN0aW9ucyBzdWJzY3JpYmVyXG5cdFx0XHR0aGlzLndlYjMuZXRoLnN1YnNjcmliZSgncGVuZGluZ1RyYW5zYWN0aW9ucycpXG5cdFx0XHRcdC5vbihcImRhdGFcIiwgKHRyYW5zYWN0aW9uKSA9PiB7XG5cdFx0XHRcdFx0Lypjb25zb2xlLmxvZyhcIiVjIHBlbmRpbmdUcmFuc2FjdGlvbnM6ZGF0YSBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHRyYW5zYWN0aW9uKTsqL1xuXHRcdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBBRERfUEVORElOR19UUkFOU0FDVElPTiwgcGF5bG9hZDogdHJhbnNhY3Rpb24gfSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbignZXJyb3InLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiJWMgcGVuZGluZ1RyYW5zYWN0aW9uczplcnJvciBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0Ly8gc3luY2luZyBzdWJzY3JpcHRpb25cblx0XHRcdHRoaXMud2ViMy5ldGguc3Vic2NyaWJlKCdzeW5jaW5nJylcblx0XHRcdFx0Lm9uKFwiZGF0YVwiLCAoc3luYykgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiJWMgc3luY2luZzpkYXRhIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc3luYyk7XG5cdFx0XHRcdFx0aWYodHlwZW9mKHN5bmMpID09PSAnYm9vbGVhbicpIHtcblx0XHRcdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBTRVRfU1lOQ0lORywgcGF5bG9hZDogc3luYyB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodHlwZW9mKHN5bmMpID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9TWU5DSU5HLCBwYXlsb2FkOiBzeW5jLnN5bmNpbmcgfSk7XG5cdFx0XHRcdFx0XHRjb25zdCBzdGF0dXMgPSB7XG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRCbG9jazogc3luYy5zdGF0dXMuQ3VycmVudEJsb2NrLFxuXHRcdFx0XHRcdFx0XHRoaWdoZXN0QmxvY2s6IHN5bmMuc3RhdHVzLkhpZ2hlc3RCbG9jayxcblx0XHRcdFx0XHRcdFx0a25vd25TdGF0ZXM6IHN5bmMuc3RhdHVzLktub3duU3RhdGVzLFxuXHRcdFx0XHRcdFx0XHRwdWxsZWRTdGF0ZXM6IHN5bmMuc3RhdHVzLlB1bGxlZFN0YXRlcyxcblx0XHRcdFx0XHRcdFx0c3RhcnRpbmdCbG9jazogc3luYy5zdGF0dXMuU3RhcnRpbmdCbG9ja1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9TWU5DX1NUQVRVUywgcGF5bG9hZDogc3RhdHVzIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdjaGFuZ2VkJywgKGlzU3luY2luZykgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiJWMgc3luY2luZzpjaGFuZ2VkIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coaXNTeW5jaW5nKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdlcnJvcicsIChlKSA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCIlYyBzeW5jaW5nOmVycm9yIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0XHRcdH0pXG5cdFx0fVxuXHRcdHRoaXMuY2hlY2tDb25uZWN0aW9uKChlcnJvciwgY29ubmVjdGlvbikgPT4ge1xuXHRcdFx0aWYoZXJyb3IpIHtcblx0XHRcdFx0dGhpcy5oZWxwZXJzLnNob3dQYW5lbEVycm9yKGVycm9yKTtcblx0XHRcdH0gZWxzZSBpZihjb25uZWN0aW9uKSB7XG5cdFx0XHRcdHRoaXMudmlldy5jcmVhdGVDb21waWxlck9wdGlvbnNWaWV3KCk7XG5cdFx0XHRcdHRoaXMudmlldy5jcmVhdGVDb2luYmFzZVZpZXcoKTtcblx0XHRcdFx0dGhpcy52aWV3LmNyZWF0ZUJ1dHRvbnNWaWV3KCk7XG5cdFx0XHRcdHRoaXMudmlldy5jcmVhdGVUYWJWaWV3KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcblx0XHRcdGlmKCFlZGl0b3IgfHwgIWVkaXRvci5nZXRCdWZmZXIoKSkge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblxuXHRcdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnZXRoZXJhdG9tLmNvbXBpbGVPblNhdmUnLCAoY29tcGlsZU9uU2F2ZSkgPT4ge1xuXHRcdFx0XHRpZih0aGlzLnNhdmVTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHRcdFx0dGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5zYXZlU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdFx0XHRcdGlmKGNvbXBpbGVPblNhdmUpIHtcblx0XHRcdFx0XHR0aGlzLnN1YnNjcmliZVRvU2F2ZUV2ZW50cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KSk7XG5cdFx0fSkpO1xuXHR9XG5cblx0Ly8gRXZlbnQgc3Vic2NyaXB0aW9uc1xuXHRzdWJzY3JpYmVUb1NhdmVFdmVudHMoKSB7XG5cdFx0aWYoIXRoaXMud2ViM1N1YnNjcmlwdGlvbnMpIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHR0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuXHRcdFx0aWYoIWVkaXRvciB8fCAhZWRpdG9yLmdldEJ1ZmZlcigpKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBidWZmZXJTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXHRcdFx0YnVmZmVyU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoZmlsZVBhdGgpID0+IHtcblx0XHRcdFx0dGhpcy5jb21waWxlKGVkaXRvcilcblx0XHRcdH0pKVxuXHRcdFx0YnVmZmVyU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkRGVzdHJveSgoKSA9PiB7XG5cdFx0XHRcdGJ1ZmZlclN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cdFx0XHR9KSlcblx0XHRcdHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMuYWRkKGJ1ZmZlclN1YnNjcmlwdGlvbnMpXG5cdFx0fSkpO1xuXHR9XG5cdHN1YnNjcmliZVRvQ29tcGlsZUV2ZW50cygpIHtcblx0XHRpZighdGhpcy53ZWIzU3Vic2NyaXB0aW9ucykge1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdHRoaXMuY29tcGlsZVN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG5cdFx0XHRpZighZWRpdG9yIHx8ICFlZGl0b3IuZ2V0QnVmZmVyKCkpIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNvbXBpbGUoZWRpdG9yKTtcblx0XHR9KSk7XG5cdH1cblxuXHQvLyBjb21tb24gZnVuY3Rpb25zXG5cdGNoZWNrQ29ubmVjdGlvbihjYWxsYmFjaykge1xuXHRcdGxldCBoYXZlQ29ubjtcblx0XHRoYXZlQ29ubiA9IHRoaXMud2ViMy5jdXJyZW50UHJvdmlkZXI7XG5cdFx0aWYoIWhhdmVDb25uKSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soJ0Vycm9yIGNvdWxkIG5vdCBjb25uZWN0IHRvIGxvY2FsIGdldGggaW5zdGFuY2UhJywgbnVsbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCB0cnVlKTtcblx0XHR9XG5cdH1cblx0YXN5bmMgY29tcGlsZShlZGl0b3IpIHtcblx0XHRjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG5cdFx0Y29uc3QgZmlsZW5hbWUgPSBmaWxlUGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG5cblx0XHRpZihmaWxlUGF0aC5zcGxpdCgnLicpLnBvcCgpID09ICdzb2wnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiVjIENvbXBpbGluZyBjb250cmFjdC4uLiBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9DT01QSUxJTkcsIHBheWxvYWQ6IHRydWUgfSk7XG5cdFx0XHRjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuXHRcdFx0dmFyIHNvdXJjZXMgPSB7fTtcblx0XHRcdHNvdXJjZXNbZmlsZW5hbWVdID0geyBjb250ZW50OiBlZGl0b3IuZ2V0VGV4dCgpIH1cblx0XHRcdHNvdXJjZXMgPSBhd2FpdCBjb21iaW5lU291cmNlKGRpciwgc291cmNlcyk7XG5cdFx0XHRjb25zb2xlLmxvZyhzb3VyY2VzKTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdC8vIFJlc2V0IHJlZHV4IHN0b3JlXG5cdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBTRVRfQ09NUElMRUQsIHBheWxvYWQ6IG51bGwgfSk7XG5cdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBTRVRfRVJST1JTLCBwYXlsb2FkOiBbXSB9KTtcblx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9FVkVOVFMsIHBheWxvYWQ6IFtdIH0pO1xuXHRcdFx0XHRjb25zdCBjb21waWxlZCA9IGF3YWl0IHRoaXMuaGVscGVycy5jb21waWxlV2ViMyhzb3VyY2VzKTtcblx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9DT01QSUxFRCwgcGF5bG9hZDogY29tcGlsZWQgfSk7XG5cdFx0XHRcdGlmKGNvbXBpbGVkLmNvbnRyYWN0cykge1xuXHRcdFx0XHRcdGZvcihjb25zdCBbZmlsZU5hbWUsIGNvbnRyYWN0c10gb2YgT2JqZWN0LmVudHJpZXMoY29tcGlsZWQuY29udHJhY3RzKSkge1xuXHRcdFx0XHRcdFx0Zm9yKGNvbnN0IFtjb250cmFjdE5hbWUsIGNvbnRyYWN0XSBvZiBPYmplY3QuZW50cmllcyhjb250cmFjdHMpKSB7XG5cdFx0XHRcdFx0XHRcdC8vIEFkZCBpbnRlcmZhY2UgdG8gcmVkdXhcblx0XHRcdFx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IEFERF9JTlRFUkZBQ0UsIHBheWxvYWQ6IHsgY29udHJhY3ROYW1lLCBpbnRlcmZhY2U6IGNvbnRyYWN0LmFiaSB9IH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZihjb21waWxlZC5lcnJvcnMpIHtcblx0XHRcdFx0XHR0aGlzLnN0b3JlLmRpc3BhdGNoKHsgdHlwZTogU0VUX0VSUk9SUywgcGF5bG9hZDogY29tcGlsZWQuZXJyb3JzIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGdhc0xpbWl0ID0gYXdhaXQgdGhpcy5oZWxwZXJzLmdldEdhc0xpbWl0KCk7XG5cdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBTRVRfR0FTX0xJTUlULCBwYXlsb2FkOiBnYXNMaW1pdCB9KTtcblx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9DT01QSUxJTkcsIHBheWxvYWQ6IGZhbHNlIH0pO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdFx0dGhpcy5oZWxwZXJzLnNob3dQYW5lbEVycm9yKGUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG59XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IHtcbiAgICBTRVRfQ09NUElMSU5HLFxuICAgIFNFVF9ERVBMT1lFRCxcbiAgICBTRVRfQ09NUElMRUQsXG4gICAgU0VUX0lOU1RBTkNFLFxuICAgIFNFVF9QQVJBTVMsXG4gICAgQUREX0lOVEVSRkFDRSxcbiAgICBTRVRfR0FTX0xJTUlUXG59IGZyb20gJy4uL2FjdGlvbnMvdHlwZXMnO1xuY29uc3QgSU5JVElBTF9TVEFURSA9IHtcbiAgY29tcGlsZWQ6IG51bGwsXG4gIGNvbXBpbGluZzogZmFsc2UsXG4gIGRlcGxveWVkOiBmYWxzZSxcbiAgaW50ZXJmYWNlczogbnVsbCxcbiAgaW5zdGFuY2VzOiBudWxsLFxuICBnYXNMaW1pdDogMFxufTtcbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSA9IElOSVRJQUxfU1RBVEUsIGFjdGlvbikgPT4ge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBTRVRfQ09NUElMSU5HOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGNvbXBpbGluZzogYWN0aW9uLnBheWxvYWQgfTtcbiAgICAgICAgY2FzZSBTRVRfREVQTE9ZRUQ6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZGVwbG95ZWQ6IHsgLi4uc3RhdGUuZGVwbG95ZWQsIFthY3Rpb24ucGF5bG9hZC5jb250cmFjdE5hbWVdOiBhY3Rpb24ucGF5bG9hZC5kZXBsb3llZCB9IH07XG4gICAgICAgIGNhc2UgU0VUX0NPTVBJTEVEOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uSU5JVElBTF9TVEFURSwgY29tcGlsZWQ6IGFjdGlvbi5wYXlsb2FkIH07XG4gICAgICAgIGNhc2UgU0VUX0lOU1RBTkNFOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGluc3RhbmNlczogeyAuLi5zdGF0ZS5pbnN0YW5jZXMsIFthY3Rpb24ucGF5bG9hZC5jb250cmFjdE5hbWVdOiBhY3Rpb24ucGF5bG9hZC5pbnN0YW5jZSB9IH07XG4gICAgICAgIGNhc2UgU0VUX1BBUkFNUzpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBpbnRlcmZhY2VzOiB7IC4uLnN0YXRlLmludGVyZmFjZXMsIFthY3Rpb24ucGF5bG9hZC5jb250cmFjdE5hbWVdOiB7IGludGVyZmFjZTogYWN0aW9uLnBheWxvYWQuaW50ZXJmYWNlIH0gfSB9O1xuICAgICAgICBjYXNlIEFERF9JTlRFUkZBQ0U6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaW50ZXJmYWNlczogeyAuLi5zdGF0ZS5pbnRlcmZhY2VzLCBbYWN0aW9uLnBheWxvYWQuY29udHJhY3ROYW1lXTogeyBpbnRlcmZhY2U6IGFjdGlvbi5wYXlsb2FkLmludGVyZmFjZSB9IH0gfTtcbiAgICAgICAgY2FzZSBTRVRfR0FTX0xJTUlUOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGdhc0xpbWl0OiBhY3Rpb24ucGF5bG9hZCB9O1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgeyBTRVRfQ09JTkJBU0UsIFNFVF9QQVNTV09SRCwgU0VUX0FDQ09VTlRTIH0gZnJvbSAnLi4vYWN0aW9ucy90eXBlcyc7XG5jb25zdCBJTklUSUFMX1NUQVRFID0ge1xuICBjb2luYmFzZTogbnVsbCxcbiAgcGFzc3dvcmQ6IGZhbHNlLFxuICBhY2NvdW50czogW11cbn07XG5leHBvcnQgZGVmYXVsdCAoc3RhdGUgPSBJTklUSUFMX1NUQVRFLCBhY3Rpb24pID0+IHtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgU0VUX0NPSU5CQVNFOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGNvaW5iYXNlOiBhY3Rpb24ucGF5bG9hZCB9O1xuICAgICAgICBjYXNlIFNFVF9QQVNTV09SRDpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBwYXNzd29yZDogYWN0aW9uLnBheWxvYWQucGFzc3dvcmQgfTtcbiAgICAgICAgY2FzZSBTRVRfQUNDT1VOVFM6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgYWNjb3VudHM6IGFjdGlvbi5wYXlsb2FkIH07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCB7IFNFVF9FUlJPUlMgfSBmcm9tICcuLi9hY3Rpb25zL3R5cGVzJztcbmNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gIGVycm9ybXNnOiBbXSxcbn07XG5leHBvcnQgZGVmYXVsdCAoc3RhdGUgPSBJTklUSUFMX1NUQVRFLCBhY3Rpb24pID0+IHtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgU0VUX0VSUk9SUzpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBlcnJvcm1zZzogYWN0aW9uLnBheWxvYWQgfTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IHsgQUREX1BFTkRJTkdfVFJBTlNBQ1RJT04sIEFERF9FVkVOVFMsIFNFVF9FVkVOVFMgfSBmcm9tICcuLi9hY3Rpb25zL3R5cGVzJztcbmNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gIHBlbmRpbmdUcmFuc2FjdGlvbnM6IFtdLFxuICBldmVudHM6IFtdXG59O1xuZXhwb3J0IGRlZmF1bHQgKHN0YXRlID0gSU5JVElBTF9TVEFURSwgYWN0aW9uKSA9PiB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEFERF9QRU5ESU5HX1RSQU5TQUNUSU9OOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHBlbmRpbmdUcmFuc2FjdGlvbnM6IFsuLi5zdGF0ZS5wZW5kaW5nVHJhbnNhY3Rpb25zLCBhY3Rpb24ucGF5bG9hZF0gfTtcbiAgICAgICAgY2FzZSBBRERfRVZFTlRTOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGV2ZW50czogWy4uLnN0YXRlLmV2ZW50cywgYWN0aW9uLnBheWxvYWRdIH07XG4gICAgICAgIGNhc2UgU0VUX0VWRU5UUzpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBldmVudHM6IFtdIH07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gICAgY2xpZW50czogW1xuICAgICAgICAvKntcbiAgICAgICAgICAgIHByb3ZpZGVyOiAnc29sY2pzJyxcbiAgICAgICAgICAgIGRlc2M6ICdKYXZhc2NyaXB0IFZNJ1xuICAgICAgICB9LCovXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGVyOiAnd2ViMycsXG4gICAgICAgICAgICBkZXNjOiAnQmFja2VuZCBldGhlcmV1bSBub2RlJ1xuICAgICAgICB9XG4gICAgXVxufTtcbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSA9IElOSVRJQUxfU1RBVEUsIGFjdGlvbikgPT4ge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IHsgU0VUX1NZTkNfU1RBVFVTLCBTRVRfU1lOQ0lORywgU0VUX01JTklORywgU0VUX0hBU0hfUkFURSB9IGZyb20gJy4uL2FjdGlvbnMvdHlwZXMnO1xuY29uc3QgSU5JVElBTF9TVEFURSA9IHtcbiAgc3luY2luZzogZmFsc2UsXG4gIHN0YXR1czoge30sXG4gIG1pbmluZzogZmFsc2UsXG4gIGhhc2hSYXRlOiAwXG59O1xuZXhwb3J0IGRlZmF1bHQgKHN0YXRlID0gSU5JVElBTF9TVEFURSwgYWN0aW9uKSA9PiB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIFNFVF9TWU5DSU5HOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHN5bmNpbmc6IGFjdGlvbi5wYXlsb2FkIH07XG4gICAgICAgIGNhc2UgU0VUX1NZTkNfU1RBVFVTOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHN0YXR1czogYWN0aW9uLnBheWxvYWQgfTtcbiAgICAgICAgY2FzZSBTRVRfTUlOSU5HOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1pbmluZzogYWN0aW9uLnBheWxvYWQgfTtcbiAgICAgICAgY2FzZSBTRVRfSEFTSF9SQVRFOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhc2hSYXRlOiBhY3Rpb24ucGF5bG9hZCB9O1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cbiIsIid1c2UgYmFiZWwnXG5pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcbmltcG9ydCBDb250cmFjdFJlZHVjZXIgZnJvbSAnLi9Db250cmFjdFJlZHVjZXInXG5pbXBvcnQgQWNjb3VudFJlZHVjZXIgZnJvbSAnLi9BY2NvdW50UmVkdWNlcidcbmltcG9ydCBFcnJvclJlZHVjZXIgZnJvbSAnLi9FcnJvclJlZHVjZXInXG5pbXBvcnQgRXZlbnRSZWR1Y2VyIGZyb20gJy4vRXZlbnRSZWR1Y2VyJ1xuaW1wb3J0IENsaWVudFJlZHVjZXIgZnJvbSAnLi9DbGllbnRSZWR1Y2VyJ1xuaW1wb3J0IE5vZGVSZWR1Y2VyIGZyb20gJy4vTm9kZVJlZHVjZXInXG7igIpcbmV4cG9ydCBkZWZhdWx0IGNvbWJpbmVSZWR1Y2Vycyh7XG4gICAgY29udHJhY3Q6IENvbnRyYWN0UmVkdWNlcixcbiAgICBhY2NvdW50OiBBY2NvdW50UmVkdWNlcixcbiAgICBlcnJvcnM6IEVycm9yUmVkdWNlcixcbiAgICBldmVudFJlZHVjZXI6IEV2ZW50UmVkdWNlcixcbiAgICBjbGllbnRSZWR1Y2VyOiBDbGllbnRSZWR1Y2VyLFxuICAgIG5vZGU6IE5vZGVSZWR1Y2VyXG59KTtcbiIsIid1c2UgYmFiZWwnXG5pbXBvcnQgZXRoZXJhdG9tUmVkdWNlcnMgZnJvbSAnLi4vcmVkdWNlcnMnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcbmltcG9ydCBSZWR1eFRodW5rIGZyb20gJ3JlZHV4LXRodW5rJ1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25maWd1cmVTdG9yZShpbml0aWFsU3RhdGUpIHtcbiAgICBjb25zdCBtaWRkbGVXYXJlcyA9IFtSZWR1eFRodW5rXTtcbiAgICBpZihhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgICAgIG1pZGRsZVdhcmVzLnB1c2gobG9nZ2VyKTtcbiAgICB9XG4gICAgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcbiAgICAgICAgZXRoZXJhdG9tUmVkdWNlcnMsXG4gICAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgICAgYXBwbHlNaWRkbGV3YXJlKC4uLm1pZGRsZVdhcmVzKVxuICAgICk7XG4gICAgcmV0dXJuIHN0b3JlO1xufVxuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuaW1wb3J0IHsgQXRvbVNvbGlkaXR5VmlldyB9IGZyb20gJy4vZXRoZXJldW0taW50ZXJmYWNlLXZpZXcnO1xuaW1wb3J0IFdlYjNFbnYgZnJvbSAnLi93ZWIzL3dlYjMnO1xuaW1wb3J0IGNvbmZpZ3VyZVN0b3JlIGZyb20gJy4vaGVscGVycy9jb25maWd1cmVTdG9yZSc7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmV4cG9ydCBjbGFzcyBFdGhlcmF0b20ge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdFx0dGhpcy5hdG9tU29saWRpdHlWaWV3ID0gbmV3IEF0b21Tb2xpZGl0eVZpZXcoKTtcblx0XHR0aGlzLm1vZGFsUGFuZWwgPSBudWxsO1xuXHRcdHRoaXMubG9hZGVkID0gZmFsc2U7XG5cdFx0dGhpcy5zdG9yZSA9IGNvbmZpZ3VyZVN0b3JlKCk7XG59XG5cdGFjdGl2YXRlKCkge1xuXHRcdHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnZXRoZXJhdG9tJywgdHJ1ZSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnQWxsIGRlcGVuZGVuY2llcyBpbnN0YWxsZWQsIGdvb2QgdG8gZ28nKVxuXHRcdFx0fSlcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcblx0XHRcdCdldGgtaW50ZXJmYWNlOnRvZ2dsZSc6ICgoX3RoaXMpID0+IHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdF90aGlzLnRvZ2dsZVZpZXcoKTtcblx0XHRcdFx0fTtcblx0XHRcdH0pKHRoaXMpLFxuXHRcdFx0J2V0aC1pbnRlcmZhY2U6YWN0aXZhdGUnOiAoKF90aGlzKSA9PiB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRfdGhpcy50b2dnbGVWaWV3KCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9KSh0aGlzKVxuXHRcdH0pKTtcblx0XHR0aGlzLm1vZGFsUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRSaWdodFBhbmVsKHtcblx0XHRcdGl0ZW06IHRoaXMuYXRvbVNvbGlkaXR5Vmlldy5nZXRFbGVtZW50KCksXG5cdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdH0pO1xuXHRcdC8vIEluaXRpYXRlIGVudlxuXHRcdHRoaXMubG9hZCgpO1xuXHR9XG5cdGRlYWN0aXZhdGUoKSB7XG5cdFx0dGhpcy5tb2RhbFBhbmVsLmRlc3Ryb3koKTtcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuXHRcdHRoaXMuYXRvbVNvbGlkaXR5Vmlldy5kZXN0cm95KCk7XG5cdH1cblx0bG9hZCgpIHtcblx0XHR0aGlzLmxvYWRXZWIzKCk7XG5cdFx0dGhpcy5sb2FkZWQgPSB0cnVlO1xuXHR9XG5cdGxvYWRXZWIzKCkge1xuXHRcdGlmKHRoaXMuV2ViM0ludGVyZmFjZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuV2ViM0ludGVyZmFjZTtcblx0XHR9XG5cdFx0dGhpcy5XZWIzSW50ZXJmYWNlID0gbmV3IFdlYjNFbnYodGhpcy5zdG9yZSk7XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLldlYjNJbnRlcmZhY2UpO1xuXHRcdHJldHVybiB0aGlzLldlYjNJbnRlcmZhY2U7XG5cdH1cblx0dG9nZ2xlVmlldygpIHtcblx0XHRpZih0aGlzLm1vZGFsUGFuZWwuaXNWaXNpYmxlKCkpIHtcblx0XHRcdHJldHVybiB0aGlzLm1vZGFsUGFuZWwuaGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RhbFBhbmVsLnNob3coKTtcblx0XHR9XG5cdH1cbn1cbiIsIid1c2UgYmFiZWwnXG5pbXBvcnQgeyBFdGhlcmF0b20gfSBmcm9tICcuL2xpYi9ldGhlcmV1bS1pbnRlcmZhY2UnXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBFdGhlcmF0b20oe1xuICAgIGNvbmZpZzogYXRvbS5jb25maWcsXG4gICAgd29ya3NwYWNlOiBhdG9tLndvcmtzcGFjZVxufSlcbiJdLCJuYW1lcyI6WyJBdG9tU29saWRpdHlWaWV3IiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImF0dCIsInJlc2l6ZU5vZGUiLCJvbm1vdXNlZG93biIsImhhbmRsZU1vdXNlRG93biIsImJpbmQiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsIm1haW5Ob2RlIiwibWVzc2FnZSIsInRleHRDb250ZW50IiwiY29tcGlsZXJOb2RlIiwiY3JlYXRlQXR0cmlidXRlIiwidmFsdWUiLCJzZXRBdHRyaWJ1dGVOb2RlIiwiYWNjb3VudHNOb2RlIiwiYnV0dG9uTm9kZSIsImNvbXBpbGVCdXR0b24iLCJ0YWJOb2RlIiwiZXJyb3JOb2RlIiwiaGFuZGxlTW91c2VNb3ZlIiwiaGFuZGxlTW91c2VVcCIsImRpc3Bvc2UiLCJnZXRFbGVtZW50IiwiZGVzdHJveSIsImUiLCJzdWJzY3JpcHRpb25zIiwibW91c2VVcEhhbmRsZXIiLCJtb3VzZU1vdmVIYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwid2lkdGgiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJyaWdodCIsInBhZ2VYIiwidndpZHRoIiwid2luZG93IiwiaW5uZXJXaWR0aCIsInZ3Iiwic3R5bGUiLCJyZW1vdmUiLCJXZWIzSGVscGVycyIsIndlYjMiLCJzb3VyY2VzIiwiZW5hYmxlZCIsInJ1bnMiLCJsYW5ndWFnZSIsInNldHRpbmdzIiwiU29sYyIsImNvbXBpbGVTdGFuZGFyZFdyYXBwZXIiLCJKU09OIiwic3RyaW5naWZ5IiwiaW5wdXQiLCJwYXJzZSIsIm91dHB1dCIsImNvaW5iYXNlIiwiYnl0ZWNvZGUiLCJFcnJvciIsImVycm9yIiwiZXRoIiwiZGVmYXVsdEFjY291bnQiLCJlc3RpbWF0ZUdhcyIsImdhc0VzdGltYXRlIiwiZ2V0QmFsYW5jZSIsInV0aWxzIiwiZnJvbVdlaSIsIndlaUJhbGFuY2UiLCJldGhCYWxhbmNlIiwiaXNTeW5jaW5nIiwiYXJncyIsImxvZyIsInBhc3N3b3JkIiwiYWJpIiwiY29udHJhY3ROYW1lIiwiZ2FzU3VwcGx5IiwiZ2FzIiwicGVyc29uYWwiLCJ1bmxvY2tBY2NvdW50IiwiZ2V0R2FzUHJpY2UiLCJDb250cmFjdCIsImNvZGUiLCJ0b0hleCIsImdhc1ByaWNlIiwiY29udHJhY3QiLCJwYXJhbXMiLCJFdmVudEVtaXR0ZXIiLCJjb250cmFjdEluc3RhbmNlIiwiQ29udHJhY3RJbnN0YW5jZSIsIm1hcCIsInBhcmFtIiwidHlwZSIsImVuZHNXaXRoIiwic2VhcmNoIiwic3BsaXQiLCJkZXBsb3kiLCJzZW5kIiwib24iLCJlbWl0IiwidHJhbnNhY3Rpb25IYXNoIiwidHhSZWNlaXB0IiwiY29uZmlybWF0aW9uTnVtYmVyIiwidGhlbiIsImluc3RhbmNlIiwib3B0aW9ucyIsImFkZHJlc3MiLCJhYmlJdGVtIiwiaW5kZXhPZiIsIkJOIiwic2VuZFRyYW5zYWN0aW9uIiwicGF5YWJsZVZhbHVlIiwicmVzdWx0IiwiY29uc3RhbnQiLCJwYXlhYmxlIiwibGVuZ3RoIiwibWV0aG9kcyIsIm5hbWUiLCJmcm9tIiwiY2FsbCIsImNvbnRyYWN0RnVuY3Rpb24iLCJpbnB1dHMiLCJQcm9taXNlIiwiYWxsIiwiaW5wdXRFbGVtZW50cyIsInBhcmFtT2JqZWN0IiwidmFsIiwidHJpbSIsImVycl9tZXNzYWdlIiwibWVzc2FnZXMiLCJNZXNzYWdlUGFuZWxWaWV3IiwidGl0bGUiLCJhdHRhY2giLCJQbGFpbk1lc3NhZ2VWaWV3IiwiY2xhc3NOYW1lIiwiZGF0YSIsIk9iamVjdCIsInJhd01lc3NhZ2UiLCJ0eEhhc2giLCJnZXRUcmFuc2FjdGlvbiIsImdldFRyYW5zYWN0aW9uUmVjZWlwdCIsInRyYW5zYWN0aW9uIiwidHJhbnNhY3Rpb25SZWNpcHQiLCJnZXRCbG9jayIsImJsb2NrIiwiZ2FzTGltaXQiLCJnZXRBY2NvdW50cyIsImlzTWluaW5nIiwiZ2V0SGFzaHJhdGUiLCJmdWxscGF0aCIsInJlcG9QYXRoIiwicGF0aCIsImZpbGVuYW1lIiwiZmlsZVJvb3QiLCJheGlvcyIsInJlc3BvbnNlIiwiYnVmIiwiQnVmZmVyIiwiY29udGVudCIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwicmVzcCIsInRvU3RyaW5nIiwiaGFuZGxlR2l0aHViQ2FsbCIsInBhdGhTdHJpbmciLCJlbmNvZGluZyIsImZzIiwicmVhZEZpbGVTeW5jIiwicmVzb2x2ZSIsIm8iLCJoYW5kbGVMb2NhbEltcG9ydCIsIm1hdGNoIiwiZ2V0SGFuZGxlcnMiLCJzb3VyY2VQYXRoIiwiaGFuZGxlcnMiLCJoYW5kbGVyIiwiZXhlYyIsImhhbmRsZSIsInJlc29sdmVJbXBvcnRzIiwiaWxpbmUiLCJpciIsImtleXMiLCJmaWxlTmFtZSIsInNvdXJjZSIsInB1c2giLCJtYXRjaGVzIiwidmFsaWRVcmwiLCJpc1VyaSIsInVybCIsImZuIiwicmVwbGFjZSIsImNvbWJpbmVTb3VyY2UiLCJzdWJTb3JjZSIsImFzc2lnbiIsIkNsaWVudFNlbGVjdG9yIiwicHJvcHMiLCJzdGF0ZSIsImF0b20iLCJjb25maWciLCJnZXQiLCJfaGFuZGxlQ2hhbmdlIiwiZXZlbnQiLCJzZXQiLCJ0YXJnZXQiLCJzZXRTdGF0ZSIsInNlbGVjdGVkRW52IiwiY2xpZW50cyIsImNsaWVudCIsInByb3ZpZGVyIiwiZGVzYyIsIlJlYWN0IiwiQ29tcG9uZW50IiwibWFwU3RhdGVUb1Byb3BzIiwiY2xpZW50UmVkdWNlciIsImNvbm5lY3QiLCJTRVRfQ09NUElMSU5HIiwiU0VUX0NPTVBJTEVEIiwiU0VUX1BBUkFNUyIsIkFERF9JTlRFUkZBQ0UiLCJTRVRfSU5TVEFOQ0UiLCJTRVRfREVQTE9ZRUQiLCJTRVRfR0FTX0xJTUlUIiwiU0VUX0NPSU5CQVNFIiwiU0VUX1BBU1NXT1JEIiwiU0VUX0FDQ09VTlRTIiwiU0VUX0VSUk9SUyIsIkFERF9QRU5ESU5HX1RSQU5TQUNUSU9OIiwiQUREX0VWRU5UUyIsIlNFVF9FVkVOVFMiLCJTRVRfU1lOQ19TVEFUVVMiLCJTRVRfU1lOQ0lORyIsIlNFVF9NSU5JTkciLCJTRVRfSEFTSF9SQVRFIiwic2V0UGFyYW1zSW5wdXQiLCJkaXNwYXRjaCIsInBheWxvYWQiLCJhZGRJbnRlcmZhY2UiLCJDb250cmFjdEFCSSIsImludGVyZmFjZSIsInNldEluc3RhbmNlIiwic2V0RGVwbG95ZWQiLCJkZXBsb3llZCIsInNldENvaW5iYXNlIiwic2V0UGFzc3dvcmQiLCJzZXRBY2NvdW50cyIsImFjY291bnRzIiwiYWRkTmV3RXZlbnRzIiwic2V0U3luY1N0YXR1cyIsInN0YXR1cyIsInNldE1pbmluZyIsIm1pbmluZyIsInNldEhhc2hyYXRlIiwiaGFzaHJhdGUiLCJHYXNJbnB1dCIsIm5leHRQcm9wcyIsIm9uQ2hhbmdlIiwiY29tcGlsZWQiLCJJbnB1dHNGb3JtIiwiaSIsIm9uU3VibWl0IiwiQ3JlYXRlQnV0dG9uIiwiaGVscGVycyIsInVuZGVmaW5lZCIsIl9oYW5kbGVBdEFkZHJlc3NDaGFuZ2UiLCJfaGFuZGxlU3VibWl0IiwiYWJpT2JqIiwiY29uc3RydWN0b3JQYXJhbXMiLCJhdEFkZHJlc3MiLCJpbnRlcmZhY2VzIiwiY29udHJhY3RJbnRlcmZhY2UiLCJmaW5kIiwiaW50ZXJmYWNlSXRlbSIsImNvbnN0cnVjdG9yIiwiY3JlYXRlIiwic2hvd1BhbmVsRXJyb3IiLCJldmVudHMiLCJhbGxFdmVudHMiLCJmcm9tQmxvY2siLCJsb2dzIiwiY2hhbmdlZCIsImFjY291bnQiLCJDb250cmFjdENvbXBpbGVkIiwiX2hhbmRsZUdhc0NoYW5nZSIsIl9oYW5kbGVJbnB1dCIsImdldEdhc0VzdGltYXRlIiwiZXN0aW1hdGVkR2FzIiwiaW5kZXgiLCJGdW5jdGlvbkFCSSIsIl9oYW5kbGVQYXlhYmxlVmFsdWUiLCJfaGFuZGxlRmFsbGJhY2siLCJpbnN0YW5jZXMiLCJzaG93T3V0cHV0IiwibWV0aG9kSXRlbSIsImoiLCJDb250cmFjdEV4ZWN1dGlvbiIsIkVycm9yVmlldyIsImVycm9ybXNnIiwibXNnIiwic2V2ZXJpdHkiLCJmb3JtYXR0ZWRNZXNzYWdlIiwiZXJyb3JzIiwiQ29sbGFwc2VkRmlsZSIsIl90b2dnbGVDb2xsYXBzZSIsImlzT3BlbmVkIiwidG9nZ2xlQnRuU3R5bGUiLCJ0b2dnbGVCdG5UeHQiLCJjb21waWxpbmciLCJjb250cmFjdHMiLCJldm0iLCJvYmplY3QiLCJDb250cmFjdHMiLCJzdG9yZSIsIlR4QW5hbHl6ZXIiLCJfaGFuZGxlVHhIYXNoQ2hhbmdlIiwiX2hhbmRsZVR4SGFzaFN1Ym1pdCIsInBlbmRpbmdUcmFuc2FjdGlvbnMiLCJnZXRUeEFuYWx5c2lzIiwidHhBbmFseXNpcyIsInRyYW5zYWN0aW9ucyIsInNsaWNlIiwicmV2ZXJzZSIsImV2ZW50UmVkdWNlciIsIkV2ZW50SXRlbSIsImlkIiwiRXZlbnRzIiwiZXZlbnRzXyIsIk5vZGVDb250cm9sIiwiX3JlZnJlc2hTeW5jIiwiZ2V0Tm9kZUluZm8iLCJnZXRTeW5jU3RhdCIsInN5bmNTdGF0IiwiZ2V0TWluaW5nIiwiaGFzaFJhdGUiLCJzeW5jaW5nIiwiY3VycmVudEJsb2NrIiwiaGlnaGVzdEJsb2NrIiwidG9GaXhlZCIsImtub3duU3RhdGVzIiwicHVsbGVkU3RhdGVzIiwic3RhcnRpbmdCbG9jayIsIm5vZGUiLCJTdGF0aWNBbmFseXNpcyIsImFubHNSdW5uZXIiLCJDb2RlQW5hbHlzaXMiLCJtb2R1bGVzIiwiX2dldE5vZGVzIiwiX3J1bkFuYWx5c2lzIiwibm9kZXMiLCJjaGVja2VkIiwibW9kdWxlIiwibGFiZWwiLCJkZXNjcmlwdGlvbiIsImdldEFuYWx5c2lzIiwiYW5hbHlzaXMiLCJyZWplY3QiLCJydW4iLCJleHBhbmRlZCIsImEiLCJyZXBvcnQiLCJsb2NhdGlvbiIsIndhcm5pbmciLCJfX2h0bWwiLCJtb3JlIiwiVGFiVmlldyIsIl9oYW5kbGVUYWJTZWxlY3QiLCJuZXdUeENvdW50ZXIiLCJ0eEJ0blN0eWxlIiwibmV3RXZlbnRDb3VudGVyIiwiZXZlbnRCdG5TdHlsZSIsIkNvaW5iYXNlVmlldyIsIl9oYW5kbGVBY2NDaGFuZ2UiLCJfaGFuZGxlUGFzc3dvcmRDaGFuZ2UiLCJfaGFuZGxlVW5sb2NrIiwiX2xpbmtDbGljayIsImJhbGFuY2UiLCJjbGlwYm9hcmQiLCJ3cml0ZSIsInVubG9ja19zdHlsZSIsInByZXZlbnREZWZhdWx0IiwiQ29tcGlsZUJ0biIsInZpZXdzIiwiZ2V0VmlldyIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwid29ya3NwYWNlRWxlbWVudCIsIlZpZXciLCJBY2NvdW50cyIsInJlbmRlciIsImdldEVsZW1lbnRCeUlkIiwidGV4dCIsInRleHROb2RlIiwiY2FsbGJhY2siLCJlcnIiLCJXZWIzRW52Iiwid2ViM1N1YnNjcmlwdGlvbnMiLCJzYXZlU3Vic2NyaXB0aW9ucyIsImNvbXBpbGVTdWJzY3JpcHRpb25zIiwib2JzZXJ2ZUNvbmZpZyIsIm9ic2VydmUiLCJleGVjdXRpb25FbnYiLCJzdWJzY3JpYmVUb1dlYjNDb21tYW5kcyIsInN1YnNjcmliZVRvV2ViM0V2ZW50cyIsIm9uRGlkQ2hhbmdlIiwiZW52Q2hhbmdlIiwibmV3VmFsdWUiLCJzdWJzY3JpYmVUb0NvbXBpbGVFdmVudHMiLCJycGNBZGRyZXNzIiwid2Vic29ja2V0QWRkcmVzcyIsIldlYjMiLCJjdXJyZW50UHJvdmlkZXIiLCJnaXZlblByb3ZpZGVyIiwicHJvdmlkZXJzIiwiSHR0cFByb3ZpZGVyIiwic2V0UHJvdmlkZXIiLCJXZWJzb2NrZXRQcm92aWRlciIsInZpZXciLCJpcyIsInN1YnNjcmliZSIsImJsb2NrcyIsInN5bmMiLCJDdXJyZW50QmxvY2siLCJIaWdoZXN0QmxvY2siLCJLbm93blN0YXRlcyIsIlB1bGxlZFN0YXRlcyIsIlN0YXJ0aW5nQmxvY2siLCJjaGVja0Nvbm5lY3Rpb24iLCJjb25uZWN0aW9uIiwiY3JlYXRlQ29tcGlsZXJPcHRpb25zVmlldyIsImNyZWF0ZUNvaW5iYXNlVmlldyIsImNyZWF0ZUJ1dHRvbnNWaWV3IiwiY3JlYXRlVGFiVmlldyIsIm9ic2VydmVUZXh0RWRpdG9ycyIsImVkaXRvciIsImdldEJ1ZmZlciIsImNvbXBpbGVPblNhdmUiLCJzdWJzY3JpYmVUb1NhdmVFdmVudHMiLCJidWZmZXJTdWJzY3JpcHRpb25zIiwib25EaWRTYXZlIiwiZmlsZVBhdGgiLCJjb21waWxlIiwib25EaWREZXN0cm95IiwiaGF2ZUNvbm4iLCJnZXRQYXRoIiwicG9wIiwiZGlybmFtZSIsImdldFRleHQiLCJkaXIiLCJjb21waWxlV2ViMyIsImVudHJpZXMiLCJnZXRHYXNMaW1pdCIsIklOSVRJQUxfU1RBVEUiLCJhY3Rpb24iLCJjb21iaW5lUmVkdWNlcnMiLCJDb250cmFjdFJlZHVjZXIiLCJBY2NvdW50UmVkdWNlciIsIkVycm9yUmVkdWNlciIsIkV2ZW50UmVkdWNlciIsIkNsaWVudFJlZHVjZXIiLCJOb2RlUmVkdWNlciIsImNvbmZpZ3VyZVN0b3JlIiwiaW5pdGlhbFN0YXRlIiwibWlkZGxlV2FyZXMiLCJSZWR1eFRodW5rIiwiaW5EZXZNb2RlIiwibG9nZ2VyIiwiY3JlYXRlU3RvcmUiLCJldGhlcmF0b21SZWR1Y2VycyIsImFwcGx5TWlkZGxld2FyZSIsIkV0aGVyYXRvbSIsImF0b21Tb2xpZGl0eVZpZXciLCJtb2RhbFBhbmVsIiwibG9hZGVkIiwiaW5zdGFsbCIsIl90aGlzIiwidG9nZ2xlVmlldyIsImFkZFJpZ2h0UGFuZWwiLCJsb2FkIiwibG9hZFdlYjMiLCJXZWIzSW50ZXJmYWNlIiwiaXNWaXNpYmxlIiwiaGlkZSIsInNob3ciLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV4QixPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFdkMsT0FBTyxDQUFDLDBCQUEw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
