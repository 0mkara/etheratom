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
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
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
                { 'class': 'gas-estimate-form' },
                React.createElement(
                    'button',
                    { 'class': 'input text-subtle' },
                    'Gas supply'
                ),
                React.createElement('input', {
                    id: contractName + '_gas',
                    type: 'number',
                    'class': 'inputs',
                    value: this.state.gas,
                    onChange: this.props.onChange }),
                React.createElement(
                    'button',
                    { 'class': 'btn btn-primary' },
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
                abi.type === "constructor" && abi.inputs.map(function (input, i) {
                    return React.createElement(
                        'form',
                        { key: i, onSubmit: _this2.props.onSubmit },
                        React.createElement(
                            'button',
                            { 'class': 'input text-subtle' },
                            input.name
                        ),
                        React.createElement('input', {
                            id: i, type: 'text', 'class': 'inputs', placeholder: input.type,
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
                var abi;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                abi = this.props.abi;

                                inputs = [];
                                for (abiObj in abi) {
                                    if (abi[abiObj].type === "constructor" && abi[abiObj].inputs.length > 0) {
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

                var _props, abi, bytecode, contractName, gas, coinbase, password, _state, constructorParams, atAddress, contractInterface, _constructor, params, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, contract, contractInstance;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                _props = this.props, abi = _props.abi, bytecode = _props.bytecode, contractName = _props.contractName, gas = _props.gas, coinbase = _props.coinbase, password = _props.password;
                                _state = this.state, constructorParams = _state.constructorParams, atAddress = _state.atAddress;
                                contractInterface = this.props.interfaces[contractName].interface;
                                _constructor = contractInterface.find(function (interfaceItem) {
                                    return interfaceItem.type === "constructor";
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
                { onSubmit: this._handleSubmit, 'class': 'padded' },
                React.createElement('input', {
                    type: 'submit',
                    value: 'Deploy to blockchain',
                    ref: contractName,
                    'class': 'btn btn-primary inline-block-tight' }),
                React.createElement('input', {
                    type: 'text', placeholder: 'at:', 'class': 'inputs',
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
                ContractABI.map(function (abi) {
                    return React.createElement(InputsForm$1, { contractName: contractName, abi: abi, onSubmit: _this2._handleInput });
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
                var _props2, contractName, coinbase, password, instances, contract, params, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, result;

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
                { 'class': 'abi-container' },
                ContractABI.map(function (abi, i) {
                    if (abi.type === 'function') {
                        return React.createElement(
                            'div',
                            { 'class': 'function-container' },
                            React.createElement(
                                'form',
                                { onSubmit: function onSubmit() {
                                        _this2._handleSubmit(abi);
                                    }, key: i },
                                React.createElement('input', { type: 'submit', value: abi.name, 'class': 'text-subtle call-button' }),
                                abi.inputs.map(function (input, j) {
                                    return React.createElement('input', {
                                        type: 'text',
                                        'class': 'call-button-values',
                                        placeholder: input.name + ' ' + input.type,
                                        value: input.value,
                                        onChange: function onChange(event) {
                                            return _this2._handleChange(input, event);
                                        },
                                        key: j
                                    });
                                }),
                                abi.payable === true && React.createElement('input', {
                                    'class': 'call-button-values',
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
                            { 'class': 'fallback-container' },
                            React.createElement(
                                'form',
                                { onSubmit: function onSubmit() {
                                        _this2._handleFallback(abi);
                                    }, key: i },
                                React.createElement(
                                    'button',
                                    { 'class': 'btn' },
                                    'fallback'
                                ),
                                abi.payable === true && React.createElement('input', {
                                    'class': 'call-button-values',
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
                { 'class': 'error-list block' },
                errormsg.length > 0 && errormsg.map(function (msg) {
                    return React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        msg.severity === 'warning' && React.createElement(
                            'span',
                            { 'class': 'icon icon-alert text-warning' },
                            msg.formattedMessage || msg.message
                        ),
                        msg.severity === 'error' && React.createElement(
                            'span',
                            { 'class': 'icon icon-bug text-error' },
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
                        var ContractABI = compiled.contracts[fileName][contractName].abi;
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
                { 'class': 'tx-analyzer' },
                React.createElement(
                    'div',
                    { 'class': 'flex-row' },
                    React.createElement(
                        'form',
                        { 'class': 'flex-row', onSubmit: this._handleTxHashSubmit },
                        React.createElement(
                            'div',
                            { 'class': 'inline-block' },
                            React.createElement('input', { type: 'text', name: 'txhash', value: this.state.txHash, onChange: this._handleTxHashChange, placeholder: 'Transaction hash', 'class': 'input-search' })
                        ),
                        React.createElement(
                            'div',
                            { 'class': 'inline-block' },
                            React.createElement('input', { type: 'submit', value: 'Analyze', 'class': 'btn' })
                        )
                    ),
                    React.createElement(
                        'button',
                        { 'class': toggleBtnStyle, onClick: this._toggleCollapse },
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
                    { 'class': 'block' },
                    React.createElement(
                        'h2',
                        { 'class': 'block highlight-info tx-header' },
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
                    { 'class': 'block' },
                    React.createElement(
                        'h2',
                        { 'class': 'block highlight-info tx-header' },
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
                { 'class': 'event-list-item' },
                React.createElement(
                    'label',
                    { 'class': 'label event-collapse-label' },
                    React.createElement(
                        'h4',
                        { 'class': 'padded text-warning' },
                        event.id,
                        ' : ',
                        event.event
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
                { 'class': 'events-container select-list' },
                React.createElement(
                    'ul',
                    { 'class': 'list-group' },
                    events_.length > 0 && events_.map(function (event) {
                        return React.createElement(EventItem, { event: event });
                    }),
                    !(events_.length > 0) && React.createElement(
                        'h2',
                        { 'class': 'text-warning no-header' },
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
                    { 'class': 'list-group' },
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Coinbase:'
                        ),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            coinbase
                        )
                    )
                ),
                Object.keys(status).length > 0 && status instanceof Object && React.createElement(
                    'ul',
                    { 'class': 'list-group' },
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Sync progress:'
                        ),
                        React.createElement('progress', { 'class': 'inline-block', max: '100', value: (100 * (status.currentBlock / status.highestBlock)).toFixed(2) }),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            (100 * (status.currentBlock / status.highestBlock)).toFixed(2),
                            '%'
                        )
                    ),
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Current Block:'
                        ),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            status.currentBlock
                        )
                    ),
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Highest Block:'
                        ),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            status.highestBlock
                        )
                    ),
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Known States:'
                        ),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            status.knownStates
                        )
                    ),
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Pulled States'
                        ),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            status.pulledStates
                        )
                    ),
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Starting Block:'
                        ),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            status.startingBlock
                        )
                    )
                ),
                !syncing && React.createElement(
                    'ul',
                    { 'class': 'list-group' },
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Syncing:'
                        ),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            '' + syncing
                        )
                    )
                ),
                React.createElement(
                    'ul',
                    { 'class': 'list-group' },
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Mining:'
                        ),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            '' + mining
                        )
                    ),
                    React.createElement(
                        'li',
                        { 'class': 'list-item' },
                        React.createElement(
                            'span',
                            { 'class': 'inline-block highlight' },
                            'Hashrate:'
                        ),
                        React.createElement(
                            'span',
                            { 'class': 'inline-block' },
                            hashRate
                        )
                    )
                ),
                React.createElement(
                    'button',
                    { 'class': 'btn', onClick: this._refreshSync },
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
                checked = _state.checked,
                analysis = _state.analysis;

            return React.createElement(
                'div',
                { 'class': 'static-analyzer' },
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
                    { 'class': 'btn btn-primary inline-block-tight', onClick: this._runAnalysis },
                    'Run analysis'
                ),
                analysis.length > 0 && analysis.map(function (a) {
                    if (a.report.length > 0) {
                        return React.createElement(
                            'div',
                            { 'class': 'padded' },
                            a.report.map(function (report, i) {
                                return React.createElement(
                                    'div',
                                    { key: i },
                                    report.location && React.createElement(
                                        'span',
                                        { 'class': 'text-info' },
                                        report.location,
                                        ' '
                                    ),
                                    report.warning && React.createElement('span', { 'class': 'text-warning', dangerouslySetInnerHTML: { __html: report.warning } }),
                                    report.more && React.createElement(
                                        'p',
                                        null,
                                        React.createElement(
                                            'a',
                                            { 'class': 'text-info', href: report.more },
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
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
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
                        { 'class': 'tab_btns' },
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { 'class': 'btn' },
                                'Contract'
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { 'class': 'btn' },
                                'Analysis'
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { 'class': txBtnStyle },
                                'Transaction analyzer',
                                newTxCounter > 0 && React.createElement(
                                    'span',
                                    { 'class': 'badge badge-small badge-error notify-badge' },
                                    newTxCounter
                                )
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { 'class': eventBtnStyle },
                                'Events',
                                newEventCounter > 0 && React.createElement(
                                    'span',
                                    { 'class': 'badge badge-small badge-error notify-badge' },
                                    newEventCounter
                                )
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { 'class': 'btn' },
                                'Node'
                            )
                        ),
                        React.createElement(
                            reactTabs.Tab,
                            null,
                            React.createElement(
                                'div',
                                { 'class': 'btn btn-warning' },
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
                        { 'class': 'text-warning' },
                        'Help Etheratom to keep solidity development interactive.'
                    ),
                    React.createElement(
                        'h4',
                        { 'class': 'text-success' },
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
                coinbase = _state.coinbase,
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
                                return _context.abrupt('return', _context.sent);

                            case 4:
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
		key: 'serialize',
		value: function serialize() {
			return {
				atomSolidityViewState: this.atomSolidityView.serialize()
			};
		}
	}, {
		key: 'load',
		value: function load() {
			//this.loadVM();
			this.loadWeb3();
			this.loaded = true;
		}
		/*loadVM() {
  	if(this.testVM) {
  		return this.testVM;
  	}
  	const { VMEnv } = require('./vm/vm');
  	this.testVM = new VMEnv();
  	this.subscriptions.add(this.testVM);
  	return this.testVM;
  }*/

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL2xpYi9pbmRleC5qcyIsIi4uL2xpYi9ldGhlcmV1bS1pbnRlcmZhY2Utdmlldy5qcyIsIi4uL2xpYi93ZWIzL21ldGhvZHMuanMiLCIuLi9saWIvaGVscGVycy9jb21waWxlci1pbXBvcnRzLmpzIiwiLi4vbGliL2NvbXBvbmVudHMvQ2xpZW50U2VsZWN0b3IvaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9HYXNJbnB1dC9pbmRleC5qcyIsIi4uL2xpYi9hY3Rpb25zL3R5cGVzLmpzIiwiLi4vbGliL2FjdGlvbnMvQ29udHJhY3RBY3Rpb25zLmpzIiwiLi4vbGliL2FjdGlvbnMvQWNjb3VudEFjdGlvbnMuanMiLCIuLi9saWIvYWN0aW9ucy9FdmVudEFjdGlvbnMuanMiLCIuLi9saWIvYWN0aW9ucy9Ob2RlQWN0aW9ucy5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0lucHV0c0Zvcm0vaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9DcmVhdGVCdXR0b24vaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9Db250cmFjdENvbXBpbGVkL2luZGV4LmpzIiwiLi4vbGliL2NvbXBvbmVudHMvRnVuY3Rpb25BQkkvaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9Db250cmFjdEV4ZWN1dGlvbi9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0Vycm9yVmlldy9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0NvbnRyYWN0cy9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL1R4QW5hbHl6ZXIvaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9FdmVudEl0ZW0vaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9FdmVudHMvaW5kZXguanMiLCIuLi9saWIvY29tcG9uZW50cy9Ob2RlQ29udHJvbC9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL1N0YXRpY0FuYWx5c2lzL2luZGV4LmpzIiwiLi4vbGliL2NvbXBvbmVudHMvVGFiVmlldy9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0NvaW5iYXNlVmlldy9pbmRleC5qcyIsIi4uL2xpYi9jb21wb25lbnRzL0NvbXBpbGVCdG4vaW5kZXguanMiLCIuLi9saWIvd2ViMy92aWV3LmpzIiwiLi4vbGliL3dlYjMvd2ViMy5qcyIsIi4uL2xpYi9yZWR1Y2Vycy9Db250cmFjdFJlZHVjZXIuanMiLCIuLi9saWIvcmVkdWNlcnMvQWNjb3VudFJlZHVjZXIuanMiLCIuLi9saWIvcmVkdWNlcnMvRXJyb3JSZWR1Y2VyLmpzIiwiLi4vbGliL3JlZHVjZXJzL0V2ZW50UmVkdWNlci5qcyIsIi4uL2xpYi9yZWR1Y2Vycy9DbGllbnRSZWR1Y2VyLmpzIiwiLi4vbGliL3JlZHVjZXJzL05vZGVSZWR1Y2VyLmpzIiwiLi4vbGliL3JlZHVjZXJzL2luZGV4LmpzIiwiLi4vbGliL2hlbHBlcnMvY29uZmlndXJlU3RvcmUuanMiLCIuLi9saWIvZXRoZXJldW0taW50ZXJmYWNlLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJjb3JlLWpzL3NoaW1cIik7XG5cbnJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWVcIik7XG5cbnJlcXVpcmUoXCJjb3JlLWpzL2ZuL3JlZ2V4cC9lc2NhcGVcIik7XG5cbmlmIChnbG9iYWwuX2JhYmVsUG9seWZpbGwpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwib25seSBvbmUgaW5zdGFuY2Ugb2YgYmFiZWwtcG9seWZpbGwgaXMgYWxsb3dlZFwiKTtcbn1cbmdsb2JhbC5fYmFiZWxQb2x5ZmlsbCA9IHRydWU7XG5cbnZhciBERUZJTkVfUFJPUEVSVFkgPSBcImRlZmluZVByb3BlcnR5XCI7XG5mdW5jdGlvbiBkZWZpbmUoTywga2V5LCB2YWx1ZSkge1xuICBPW2tleV0gfHwgT2JqZWN0W0RFRklORV9QUk9QRVJUWV0oTywga2V5LCB7XG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9KTtcbn1cblxuZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIFwicGFkTGVmdFwiLCBcIlwiLnBhZFN0YXJ0KTtcbmRlZmluZShTdHJpbmcucHJvdG90eXBlLCBcInBhZFJpZ2h0XCIsIFwiXCIucGFkRW5kKTtcblxuXCJwb3AscmV2ZXJzZSxzaGlmdCxrZXlzLHZhbHVlcyxlbnRyaWVzLGluZGV4T2YsZXZlcnksc29tZSxmb3JFYWNoLG1hcCxmaWx0ZXIsZmluZCxmaW5kSW5kZXgsaW5jbHVkZXMsam9pbixzbGljZSxjb25jYXQscHVzaCxzcGxpY2UsdW5zaGlmdCxzb3J0LGxhc3RJbmRleE9mLHJlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGxcIi5zcGxpdChcIixcIikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIFtdW2tleV0gJiYgZGVmaW5lKEFycmF5LCBrZXksIEZ1bmN0aW9uLmNhbGwuYmluZChbXVtrZXldKSk7XG59KTsiLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuZXhwb3J0IGNsYXNzIEF0b21Tb2xpZGl0eVZpZXcge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50O1xuXHRcdHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F0b20tcGFuZWwnKTtcblx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXRoZXJhdG9tLXBhbmVsJyk7XG5cdFx0bGV0IGF0dCA9IG51bGw7XG5cblx0XHQvLyBlbXB0eSBkaXYgdG8gaGFuZGxlIHJlc2l6ZVxuXHRcdGxldCByZXNpemVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0cmVzaXplTm9kZS5vbm1vdXNlZG93biA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcyk7XG5cdFx0cmVzaXplTm9kZS5jbGFzc0xpc3QuYWRkKCdldGhlcmF0b20tcGFuZWwtcmVzaXplLWhhbmRsZScpO1xuXHRcdHJlc2l6ZU5vZGUuc2V0QXR0cmlidXRlKCdyZWYnLCAncmVzaXplaGFuZGxlJyk7XG5cdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJlc2l6ZU5vZGUpO1xuXG5cdFx0bGV0IG1haW5Ob2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0bWFpbk5vZGUuY2xhc3NMaXN0LmFkZCgnZXRoZXJhdG9tJyk7XG5cdFx0bWFpbk5vZGUuY2xhc3NMaXN0LmFkZCgnbmF0aXZlLWtleS1iaW5kaW5ncycpO1xuXHRcdG1haW5Ob2RlLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcblxuXHRcdGxldCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0bWVzc2FnZS50ZXh0Q29udGVudCA9IFwiRXRoZXJhdG9tIElERVwiO1xuXHRcdG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnY29tcGlsZXItaW5mbycpO1xuXHRcdG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnYmxvY2snKTtcblx0XHRtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodC1pbmZvJyk7XG5cdFx0bWFpbk5vZGUuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG5cblx0XHRsZXQgY29tcGlsZXJOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0YXR0ID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKCdpZCcpO1xuXHRcdGF0dC52YWx1ZSA9ICdjbGllbnQtb3B0aW9ucyc7XG5cdFx0Y29tcGlsZXJOb2RlLnNldEF0dHJpYnV0ZU5vZGUoYXR0KTtcblx0XHRtYWluTm9kZS5hcHBlbmRDaGlsZChjb21waWxlck5vZGUpO1xuXG5cdFx0bGV0IGFjY291bnRzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGF0dCA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZSgnaWQnKTtcblx0XHRhdHQudmFsdWUgPSAnYWNjb3VudHMtbGlzdCc7XG5cdFx0YWNjb3VudHNOb2RlLnNldEF0dHJpYnV0ZU5vZGUoYXR0KTtcblx0XHRtYWluTm9kZS5hcHBlbmRDaGlsZChhY2NvdW50c05vZGUpO1xuXG5cdFx0bGV0IGJ1dHRvbk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRhdHQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0YXR0LnZhbHVlID0gJ2NvbW1vbi1idXR0b25zJztcblx0XHRidXR0b25Ob2RlLnNldEF0dHJpYnV0ZU5vZGUoYXR0KTtcblx0XHRidXR0b25Ob2RlLmNsYXNzTGlzdC5hZGQoJ2Jsb2NrJyk7XG5cblx0XHRsZXQgY29tcGlsZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGF0dCA9IGRvY3VtZW50LmNyZWF0ZUF0dHJpYnV0ZSgnaWQnKTtcblx0XHRhdHQudmFsdWUgPSAnY29tcGlsZV9idG4nO1xuXHRcdGNvbXBpbGVCdXR0b24uc2V0QXR0cmlidXRlTm9kZShhdHQpO1xuXHRcdGNvbXBpbGVCdXR0b24uY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJyk7XG5cblx0XHRidXR0b25Ob2RlLmFwcGVuZENoaWxkKGNvbXBpbGVCdXR0b24pO1xuXHRcdG1haW5Ob2RlLmFwcGVuZENoaWxkKGJ1dHRvbk5vZGUpO1xuXG5cdFx0bGV0IHRhYk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRhdHQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0YXR0LnZhbHVlID0gJ3RhYl92aWV3Jztcblx0XHR0YWJOb2RlLnNldEF0dHJpYnV0ZU5vZGUoYXR0KTtcblx0XHRtYWluTm9kZS5hcHBlbmRDaGlsZCh0YWJOb2RlKTtcblxuXHRcdGxldCBlcnJvck5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRhdHQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoJ2lkJyk7XG5cdFx0YXR0LnZhbHVlID0gJ2NvbXBpbGVkLWVycm9yJztcblx0XHRlcnJvck5vZGUuc2V0QXR0cmlidXRlTm9kZShhdHQpO1xuXHRcdGVycm9yTm9kZS5jbGFzc0xpc3QuYWRkKCdjb21waWxlZC1lcnJvcicpO1xuXHRcdG1haW5Ob2RlLmFwcGVuZENoaWxkKGVycm9yTm9kZSk7XG5cblx0XHQvLyBGaW5hbGx5IGFwcGVuZCBtYWluTm9kZSB0byBlbGVtZW50XG5cdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1haW5Ob2RlKTtcblxuXHRcdHRoaXMuaGFuZGxlTW91c2VEb3duID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZU1vdXNlTW92ZSA9IHRoaXMuaGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVNb3VzZVVwID0gdGhpcy5oYW5kbGVNb3VzZVVwLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5kaXNwb3NlID0gdGhpcy5kaXNwb3NlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5nZXRFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5kZXN0cm95ID0gdGhpcy5kZXN0cm95LmJpbmQodGhpcyk7XG5cdH1cblx0aGFuZGxlTW91c2VEb3duKGUpIHtcblx0XHRpZih0aGlzLnN1YnNjcmlwdGlvbnMgIT0gbnVsbCkge1xuXHRcdFx0dGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXHRcdH1cblxuXHRcdGNvbnN0IG1vdXNlVXBIYW5kbGVyID0gKGUpID0+IHRoaXMuaGFuZGxlTW91c2VVcChlKVxuXHRcdGNvbnN0IG1vdXNlTW92ZUhhbmRsZXIgPSAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZU1vdmUoZSlcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlcilcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyKVxuXG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoe1xuXHRcdFx0ZGlzcG9zZTogKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlcilcblx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRkaXNwb3NlOiAoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXHRoYW5kbGVNb3VzZU1vdmUoZSkge1xuXHRcdC8vIEN1cnJlbnRseSBvbmx5IHZlcnRpY2FsIHBhbmVsIGlzIHdvcmtpbmcsIG1heSBiZSBsYXRlciBJIHNob3VsZCBhZGQgaG9yaXpvbnRhbCBwYW5lbFxuXHRcdGNvbnN0IHdpZHRoID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnJpZ2h0IC0gZS5wYWdlWDtcblx0XHRjb25zdCB2d2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHRjb25zdCB2dyA9ICh3aWR0aCAvIHZ3aWR0aCkgKiAxMDAgKyAndncnO1xuXHRcdHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHZ3O1xuXHR9XG5cdGhhbmRsZU1vdXNlVXAoZSkge1xuXHRcdGlmKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuXHRcdFx0dGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXHRcdH1cblx0fVxuXHRnZXRFbGVtZW50KCkge1xuXHRcdHJldHVybiB0aGlzLmVsZW1lbnQ7XG5cdH1cblx0ZGlzcG9zZSgpIHtcblx0XHR0aGlzLmRlc3Ryb3koKVxuXHR9XG5cdGRlc3Ryb3koKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcblx0fVxufVxuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuLy8gbWV0aG9kcy5qcyBhcmUgY29sbGVjdGlvbiBvZiB2YXJpb3VzIGZ1bmN0aW9ucyB1c2VkIHRvIGV4ZWN1dGUgY2FsbHMgb24gd2ViM1xuaW1wb3J0IFNvbGMgZnJvbSAnc29sYydcbmltcG9ydCBXZWIzIGZyb20gJ3dlYjMnXG5pbXBvcnQgZXRoSlNBQkkgZnJvbSAnZXRoZXJldW1qcy1hYmknXG5pbXBvcnQgRXRoSlNUWCBmcm9tICdldGhlcmV1bWpzLXR4J1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5pbXBvcnQgeyBNZXNzYWdlUGFuZWxWaWV3LCBQbGFpbk1lc3NhZ2VWaWV3LCBMaW5lTWVzc2FnZVZpZXcgfSBmcm9tICdhdG9tLW1lc3NhZ2UtcGFuZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYjNIZWxwZXJzIHtcblx0Y29uc3RydWN0b3Iod2ViMykge1xuXHRcdHRoaXMud2ViMyA9IHdlYjM7XG5cdH1cblx0YXN5bmMgY29tcGlsZVdlYjMoc291cmNlcykge1xuXHRcdC8vIGNvbXBpbGUgc29saWRpdHkgdXNpbmcgc29sY2pzXG5cdFx0Ly8gc291cmNlcyBoYXZlIENvbXBpbGVyIElucHV0IEpTT04gc291cmNlcyBmb3JtYXRcblx0XHQvLyBodHRwczovL3NvbGlkaXR5LnJlYWR0aGVkb2NzLmlvL2VuL2RldmVsb3AvdXNpbmctdGhlLWNvbXBpbGVyLmh0bWwjY29tcGlsZXItaW5wdXQtYW5kLW91dHB1dC1qc29uLWRlc2NyaXB0aW9uXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IG91dHB1dFNlbGVjdGlvbiA9IHtcblx0XHRcdFx0Ly8gRW5hYmxlIHRoZSBtZXRhZGF0YSBhbmQgYnl0ZWNvZGUgb3V0cHV0cyBvZiBldmVyeSBzaW5nbGUgY29udHJhY3QuXG5cdFx0XHRcdFwiKlwiOiB7XG5cdFx0XHRcdFx0XCJcIjogW1wibGVnYWN5QVNUXCJdLFxuXHRcdFx0XHRcdFwiKlwiOiBbXCJhYmlcIiwgXCJldm0uYnl0ZWNvZGUub2JqZWN0XCIsIFwiZGV2ZG9jXCIsIFwidXNlcmRvY1wiLCBcImV2bS5nYXNFc3RpbWF0ZXNcIl1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IHNldHRpbmdzID0ge1xuXHRcdFx0XHRvcHRpbWl6ZXI6IHsgZW5hYmxlZDogdHJ1ZSwgcnVuczogNTAwIH0sXG5cdFx0XHRcdGV2bVZlcnNpb246IFwiYnl6YW50aXVtXCIsXG5cdFx0XHRcdG91dHB1dFNlbGVjdGlvblxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IGlucHV0ID0geyBsYW5ndWFnZTogXCJTb2xpZGl0eVwiLCBzb3VyY2VzLCBzZXR0aW5ncyB9O1xuXHRcdFx0Y29uc3Qgb3V0cHV0ID0gYXdhaXQgU29sYy5jb21waWxlU3RhbmRhcmRXcmFwcGVyKEpTT04uc3RyaW5naWZ5KGlucHV0KSk7XG5cdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShvdXRwdXQpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHR9XG5cdGFzeW5jIGdldEdhc0VzdGltYXRlKGNvaW5iYXNlLCBieXRlY29kZSkge1xuXHRcdGlmKCFjb2luYmFzZSkge1xuXHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ05vIGNvaW5iYXNlIHNlbGVjdGVkIScpO1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLndlYjMuZXRoLmRlZmF1bHRBY2NvdW50ID0gY29pbmJhc2U7XG5cdFx0XHRjb25zdCBnYXNFc3RpbWF0ZSA9IGF3YWl0IHRoaXMud2ViMy5ldGguZXN0aW1hdGVHYXMoe1xuXHRcdFx0XHRmcm9tOiB0aGlzLndlYjMuZXRoLmRlZmF1bHRBY2NvdW50LFxuXHRcdFx0XHRkYXRhOiAnMHgnICsgYnl0ZWNvZGUsXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBnYXNFc3RpbWF0ZTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBnZXRCYWxhbmNlKGNvaW5iYXNlKSB7XG5cdFx0aWYoIWNvaW5iYXNlKSB7XG5cdFx0XHRjb25zdCBlcnJvciA9IG5ldyBFcnJvcignTm8gY29pbmJhc2Ugc2VsZWN0ZWQhJyk7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHdlaUJhbGFuY2UgPSBhd2FpdCB0aGlzLndlYjMuZXRoLmdldEJhbGFuY2UoY29pbmJhc2UpO1xuXHRcdFx0Y29uc3QgZXRoQmFsYW5jZSA9IGF3YWl0IHRoaXMud2ViMy51dGlscy5mcm9tV2VpKHdlaUJhbGFuY2UsIFwiZXRoZXJcIik7XG5cdFx0XHRyZXR1cm4gZXRoQmFsYW5jZTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHR9XG5cdGFzeW5jIGdldFN5bmNTdGF0KCkge1xuXHRcdHRyeSB7XG5cdFx0XHRyZXR1cm4gdGhpcy53ZWIzLmV0aC5pc1N5bmNpbmcoKTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHR9XG5cdGFzeW5jIGNyZWF0ZSh7Li4uYXJnc30pIHtcblx0XHRjb25zb2xlLmxvZyhcIiVjIENyZWF0aW5nIGNvbnRyYWN0Li4uIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0Y29uc3QgY29pbmJhc2UgPSBhcmdzLmNvaW5iYXNlO1xuXHRcdGNvbnN0IHBhc3N3b3JkID0gYXJncy5wYXNzd29yZDtcblx0XHRjb25zdCBhYmkgPSBhcmdzLmFiaTtcblx0XHRjb25zdCBjb2RlID0gYXJncy5ieXRlY29kZTtcblx0XHRjb25zdCBjb250cmFjdE5hbWUgPSBhcmdzLmNvbnRyYWN0TmFtZTtcblx0XHRjb25zdCBnYXNTdXBwbHkgPSBhcmdzLmdhcztcblxuXHRcdGlmKCFjb2luYmFzZSkge1xuXHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ05vIGNvaW5iYXNlIHNlbGVjdGVkIScpO1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHRcdHRoaXMud2ViMy5ldGguZGVmYXVsdEFjY291bnQgPSBjb2luYmFzZTtcblx0XHR0cnkge1xuXHRcdFx0aWYocGFzc3dvcmQpIHtcblx0XHRcdFx0Y29uc3QgdW5sb2NrZWQgPSBhd2FpdCB0aGlzLndlYjMuZXRoLnBlcnNvbmFsLnVubG9ja0FjY291bnQoY29pbmJhc2UsIHBhc3N3b3JkKTtcblx0XHRcdH1cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGdhc1ByaWNlID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRHYXNQcmljZSgpO1xuXHRcdFx0XHRjb25zdCBjb250cmFjdCA9IGF3YWl0IG5ldyB0aGlzLndlYjMuZXRoLkNvbnRyYWN0KGFiaSwge1xuXHRcdFx0XHRcdGZyb206IHRoaXMud2ViMy5ldGguZGVmYXVsdEFjY291bnQsXG5cdFx0XHRcdFx0ZGF0YTogJzB4JyArIGNvZGUsXG5cdFx0XHRcdFx0Z2FzOiB0aGlzLndlYjMudXRpbHMudG9IZXgoZ2FzU3VwcGx5KSxcblx0XHRcdFx0XHRnYXNQcmljZTogdGhpcy53ZWIzLnV0aWxzLnRvSGV4KGdhc1ByaWNlKVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGNvbnRyYWN0O1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdFx0dGhyb3cgZTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHR9XG5cdGFzeW5jIGRlcGxveShjb250cmFjdCwgcGFyYW1zKSB7XG5cdFx0Y29uc29sZS5sb2coXCIlYyBEZXBsb3lpbmcgY29udHJhY3QuLi4gXCIsICdiYWNrZ3JvdW5kOiByZ2JhKDM2LCAxOTQsIDIwMywgMC4zKTsgY29sb3I6ICNFRjUyNUInKTtcblx0XHRjbGFzcyBDb250cmFjdEluc3RhbmNlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHt9O1xuXHRcdGNvbnN0IGNvbnRyYWN0SW5zdGFuY2UgPSBuZXcgQ29udHJhY3RJbnN0YW5jZSgpO1xuXHRcdHRyeSB7XG5cdFx0XHRwYXJhbXMgPSBwYXJhbXMubWFwKHBhcmFtID0+IHtcblx0XHRcdFx0cmV0dXJuIHBhcmFtLnR5cGUuZW5kc1dpdGgoJ1tdJykgPyBwYXJhbS52YWx1ZS5zZWFyY2goJywgJykgPiAwID8gcGFyYW0udmFsdWUuc3BsaXQoJywgJykgOiBwYXJhbS52YWx1ZS5zcGxpdCgnLCcpIDogcGFyYW0udmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGdhc1ByaWNlID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRHYXNQcmljZSgpO1xuXHRcdFx0Y29udHJhY3QuZGVwbG95KHtcblx0XHRcdFx0YXJndW1lbnRzOiBwYXJhbXNcblx0XHRcdH0pXG5cdFx0XHQuc2VuZCh7XG5cdFx0XHRcdGZyb206IHRoaXMud2ViMy5ldGguZGVmYXVsdEFjY291bnRcblx0XHRcdH0pXG5cdFx0XHQub24oJ3RyYW5zYWN0aW9uSGFzaCcsIHRyYW5zYWN0aW9uSGFzaCA9PiB7XG5cdFx0XHRcdGNvbnRyYWN0SW5zdGFuY2UuZW1pdCgndHJhbnNhY3Rpb25IYXNoJywgdHJhbnNhY3Rpb25IYXNoKTtcblx0XHRcdH0pXG5cdFx0XHQub24oJ3JlY2VpcHQnLCB0eFJlY2VpcHQgPT4ge1xuXHRcdFx0XHRjb250cmFjdEluc3RhbmNlLmVtaXQoJ3JlY2VpcHQnLCB0eFJlY2VpcHQpO1xuXG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdjb25maXJtYXRpb24nLCBjb25maXJtYXRpb25OdW1iZXIgPT4ge1xuXHRcdFx0XHRjb250cmFjdEluc3RhbmNlLmVtaXQoJ2NvbmZpcm1hdGlvbicsIGNvbmZpcm1hdGlvbk51bWJlcik7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCdlcnJvcicsIGVycm9yID0+IHtcblx0XHRcdFx0Y29udHJhY3RJbnN0YW5jZS5lbWl0KCdlcnJvcicsIGVycm9yKTtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihpbnN0YW5jZSA9PiB7XG5cdFx0XHRcdGNvbnRyYWN0SW5zdGFuY2UuZW1pdCgnYWRkcmVzcycsIGluc3RhbmNlLm9wdGlvbnMuYWRkcmVzcyk7XG5cdFx0XHRcdGNvbnRyYWN0SW5zdGFuY2UuZW1pdCgnaW5zdGFuY2UnLCBpbnN0YW5jZSk7XG5cdFx0XHR9KVxuXHRcdFx0cmV0dXJuIGNvbnRyYWN0SW5zdGFuY2U7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBjYWxsKHsuLi5hcmdzfSkge1xuXHRcdGNvbnNvbGUubG9nKFwiJWMgV2ViMyBjYWxsaW5nIGZ1bmN0aW9ucy4uLiBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdGNvbnN0IGNvaW5iYXNlID0gYXJncy5jb2luYmFzZTtcblx0XHRjb25zdCBwYXNzd29yZCA9IGFyZ3MucGFzc3dvcmQ7XG5cdFx0Y29uc3QgY29udHJhY3QgPSBhcmdzLmNvbnRyYWN0O1xuXHRcdGNvbnN0IGFiaUl0ZW0gPSBhcmdzLmFiaUl0ZW07XG5cdFx0dmFyIHBhcmFtcyA9IGFyZ3MucGFyYW1zIHx8IFtdO1xuXG5cdFx0dGhpcy53ZWIzLmV0aC5kZWZhdWx0QWNjb3VudCA9IGNvaW5iYXNlO1xuXHRcdHRyeSB7XG5cdFx0XHQvLyBQcmVwYXJlIHBhcmFtcyBmb3IgY2FsbFxuXHRcdFx0cGFyYW1zID0gcGFyYW1zLm1hcChwYXJhbSA9PiB7XG5cdFx0XHRcdGlmKHBhcmFtLnR5cGUuZW5kc1dpdGgoJ1tdJykpIHtcblx0XHRcdFx0XHRyZXR1cm4gcGFyYW0udmFsdWUuc2VhcmNoKCcsICcpID4gMCA/IHBhcmFtLnZhbHVlLnNwbGl0KCcsICcpIDogcGFyYW0udmFsdWUuc3BsaXQoJywnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihwYXJhbS50eXBlLmluZGV4T2YoJ2ludCcpID4gLTEpIHtcblx0XHRcdFx0XHRyZXR1cm4gbmV3IHRoaXMud2ViMy51dGlscy5CTihwYXJhbS52YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHBhcmFtLnZhbHVlO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEhhbmRsZSBmYWxsYmFja1xuXHRcdFx0aWYoYWJpSXRlbS50eXBlID09PSAnZmFsbGJhY2snKSB7XG5cdFx0XHRcdGlmKHBhc3N3b3JkKSB7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy53ZWIzLmV0aC5wZXJzb25hbC51bmxvY2tBY2NvdW50KGNvaW5iYXNlLCBwYXNzd29yZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5zZW5kVHJhbnNhY3Rpb24oe1xuXHRcdFx0XHRcdGZyb206IGNvaW5iYXNlLFxuXHRcdFx0XHRcdHRvOiBjb250cmFjdC5vcHRpb25zLmFkZHJlc3MsXG5cdFx0XHRcdFx0dmFsdWU6IGFiaUl0ZW0ucGF5YWJsZVZhbHVlIHx8IDBcblx0XHRcdFx0fSlcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblxuXHRcdFx0aWYoYWJpSXRlbS5jb25zdGFudCA9PT0gZmFsc2UgfHwgYWJpSXRlbS5wYXlhYmxlID09PSB0cnVlKSB7XG5cdFx0XHRcdGlmKHBhc3N3b3JkKSB7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy53ZWIzLmV0aC5wZXJzb25hbC51bmxvY2tBY2NvdW50KGNvaW5iYXNlLCBwYXNzd29yZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYocGFyYW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBjb250cmFjdC5tZXRob2RzW2FiaUl0ZW0ubmFtZV0oLi4ucGFyYW1zKS5zZW5kKHsgZnJvbTogY29pbmJhc2UsIHZhbHVlOiBhYmlJdGVtLnBheWFibGVWYWx1ZSB9KTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbnRyYWN0Lm1ldGhvZHNbYWJpSXRlbS5uYW1lXSgpLnNlbmQoeyBmcm9tOiBjb2luYmFzZSwgdmFsdWU6IGFiaUl0ZW0ucGF5YWJsZVZhbHVlIH0pO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdFx0aWYocGFyYW1zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgY29udHJhY3QubWV0aG9kc1thYmlJdGVtLm5hbWVdKC4uLnBhcmFtcykuY2FsbCh7IGZyb206IGNvaW5iYXNlIH0pO1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgY29udHJhY3QubWV0aG9kc1thYmlJdGVtLm5hbWVdKCkuY2FsbCh7IGZyb206IGNvaW5iYXNlIH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0Y2F0Y2goZSkge1xuXHRcdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBmdW5jUGFyYW1zVG9BcnJheShjb250cmFjdEZ1bmN0aW9uKSB7XG5cdFx0aWYoY29udHJhY3RGdW5jdGlvbiAmJiBjb250cmFjdEZ1bmN0aW9uLmlucHV0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRjb25zdCBpbnB1dEVsZW1lbnRzID0gYXdhaXQgUHJvbWlzZS5hbGwoY29udHJhY3RGdW5jdGlvbi5pbnB1dHMubWFwKGFzeW5jIChpbnB1dCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW2lucHV0LnR5cGUsIGlucHV0Lm5hbWVdO1xuXHRcdFx0fSkpO1xuXHRcdFx0cmV0dXJuIGlucHV0RWxlbWVudHM7XG5cdFx0fVxuXHRcdHJldHVybiBbXTtcblx0fVxuXHRhc3luYyBpbnB1dHNUb0FycmF5KHBhcmFtT2JqZWN0KSB7XG5cdFx0aWYocGFyYW1PYmplY3QudHlwZS5lbmRzV2l0aCgnW10nKSkge1xuXHRcdFx0cmV0dXJuIHBhcmFtT2JqZWN0LnZhbHVlLnNwbGl0KCcsJykubWFwKHZhbCA9PiB0aGlzLndlYjMudXRpbHMudG9IZXgodmFsLnRyaW0oKSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy53ZWIzLnV0aWxzLnRvSGV4KHBhcmFtT2JqZWN0LnZhbHVlKTtcblx0fVxuXHRzaG93UGFuZWxFcnJvcihlcnJfbWVzc2FnZSkge1xuXHRcdGxldCBtZXNzYWdlcztcblx0XHRtZXNzYWdlcyA9IG5ldyBNZXNzYWdlUGFuZWxWaWV3KHsgdGl0bGU6ICdFdGhlcmF0b20gcmVwb3J0JyB9KTtcblx0XHRtZXNzYWdlcy5hdHRhY2goKTtcblx0XHRtZXNzYWdlcy5hZGQobmV3IFBsYWluTWVzc2FnZVZpZXcoeyBtZXNzYWdlOiBlcnJfbWVzc2FnZSwgY2xhc3NOYW1lOiAncmVkLW1lc3NhZ2UnIH0pKTtcblx0fVxuXHRzaG93T3V0cHV0KHsuLi5hcmdzfSkge1xuXHRcdGNvbnN0IGFkZHJlc3MgPSBhcmdzLmFkZHJlc3M7XG5cdFx0Y29uc3QgZGF0YSA9IGFyZ3MuZGF0YTtcblx0XHRjb25zdCBtZXNzYWdlcyA9IG5ldyBNZXNzYWdlUGFuZWxWaWV3KHsgdGl0bGU6ICdFdGhlcmF0b20gb3V0cHV0JyB9KTtcblx0XHRtZXNzYWdlcy5hdHRhY2goKTtcblx0XHRtZXNzYWdlcy5hZGQobmV3IFBsYWluTWVzc2FnZVZpZXcoe1xuXHRcdFx0bWVzc2FnZTogJ0NvbnRyYWN0IGFkZHJlc3M6ICcgKyBhZGRyZXNzLFxuXHRcdFx0Y2xhc3NOYW1lOiAnZ3JlZW4tbWVzc2FnZSdcblx0XHR9KSk7XG5cdFx0aWYoZGF0YSBpbnN0YW5jZW9mIE9iamVjdCkge1xuXHRcdFx0Y29uc3QgcmF3TWVzc2FnZSA9IGA8aDY+Q29udHJhY3Qgb3V0cHV0OjwvaDY+PHByZT4ke0pTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDQpfTwvcHJlPmBcblx0XHRcdG1lc3NhZ2VzLmFkZChuZXcgUGxhaW5NZXNzYWdlVmlldyh7XG5cdFx0XHRcdG1lc3NhZ2U6IHJhd01lc3NhZ2UsXG5cdFx0XHRcdHJhdzogdHJ1ZSxcblx0XHRcdFx0Y2xhc3NOYW1lOiAnZ3JlZW4tbWVzc2FnZSdcblx0XHRcdH0pKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0bWVzc2FnZXMuYWRkKG5ldyBQbGFpbk1lc3NhZ2VWaWV3KHtcblx0XHRcdG1lc3NhZ2U6ICdDb250cmFjdCBvdXRwdXQ6ICcgKyBkYXRhLFxuXHRcdFx0Y2xhc3NOYW1lOiAnZ3JlZW4tbWVzc2FnZSdcblx0XHR9KSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdC8vIFRyYW5zYWN0aW9uIGFuYWx5c2lzXG5cdGFzeW5jIGdldFR4QW5hbHlzaXModHhIYXNoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHRyYW5zYWN0aW9uID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRUcmFuc2FjdGlvbih0eEhhc2gpO1xuXHRcdFx0Y29uc3QgdHJhbnNhY3Rpb25SZWNpcHQgPSBhd2FpdCB0aGlzLndlYjMuZXRoLmdldFRyYW5zYWN0aW9uUmVjZWlwdCh0eEhhc2gpO1xuXHRcdFx0cmV0dXJuIHsgdHJhbnNhY3Rpb24sIHRyYW5zYWN0aW9uUmVjaXB0IH07XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHQvLyBHYXMgTGltaXRcblx0YXN5bmMgZ2V0R2FzTGltaXQoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGJsb2NrID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRCbG9jaygnbGF0ZXN0Jyk7XG5cdFx0XHRyZXR1cm4gYmxvY2suZ2FzTGltaXQ7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBnZXRBY2NvdW50cygpIHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIGF3YWl0IHRoaXMud2ViMy5ldGguZ2V0QWNjb3VudHMoKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRhc3luYyBnZXRNaW5pbmcoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBhd2FpdCB0aGlzLndlYjMuZXRoLmlzTWluaW5nKCk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cblx0YXN5bmMgZ2V0SGFzaHJhdGUoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBhd2FpdCB0aGlzLndlYjMuZXRoLmdldEhhc2hyYXRlKCk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdH1cbn1cbiIsIid1c2UgYmFiZWwnXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHVybCBmcm9tICd1cmwnXG5pbXBvcnQgdmFsaWRVcmwgZnJvbSAndmFsaWQtdXJsJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVHaXRodWJDYWxsKGZ1bGxwYXRoLCByZXBvUGF0aCwgcGF0aCwgZmlsZW5hbWUsIGZpbGVSb290KSB7XG4gICAgcmV0dXJuIGF3YWl0IGF4aW9zKHtcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy8nICsgcmVwb1BhdGggKyAnL2NvbnRlbnRzLycgKyBwYXRoLFxuICAgICAgICByZXNwb25zZVR5cGU6ICdqc29uJ1xuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYoJ2NvbnRlbnQnIGluIHJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1ZiA9IEJ1ZmZlci5mcm9tKHJlc3BvbnNlLmRhdGEuY29udGVudCwgJ2Jhc2U2NCcpO1xuICAgICAgICAgICAgZmlsZVJvb3QgPSBmdWxscGF0aC5zdWJzdHJpbmcoMCwgZnVsbHBhdGgubGFzdEluZGV4T2YoXCIvXCIpKTtcbiAgICAgICAgICAgIGZpbGVSb290ID0gZmlsZVJvb3QgKyAnLyc7XG4gICAgICAgICAgICBjb25zdCByZXNwID0geyBmaWxlbmFtZSwgY29udGVudDogYnVmLnRvU3RyaW5nKCdVVEYtOCcpLCBmaWxlUm9vdCB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyAnQ29udGVudCBub3QgcmVjZWl2ZWQhJztcbiAgICAgICAgfVxuICAgIH0pXG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVMb2NhbEltcG9ydChwYXRoU3RyaW5nLCBmaWxlbmFtZSwgZmlsZVJvb3QpIHtcbiAgICBjb25zdCBvID0geyBlbmNvZGluZzogJ1VURi04JyB9O1xuICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKGZpbGVSb290LCBwYXRoU3RyaW5nLCBmaWxlbmFtZSksIG8pO1xuICAgIGZpbGVSb290ID0gcGF0aC5yZXNvbHZlKGZpbGVSb290LCBwYXRoU3RyaW5nKTtcbiAgICBjb25zdCByZXNwb25zZSA9IHsgZmlsZW5hbWUsIGNvbnRlbnQsIGZpbGVSb290IH07XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0SGFuZGxlcnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ2xvY2FsJyxcbiAgICAgICAgICAgIG1hdGNoOiAvKF4oPyEoPzpodHRwOlxcL1xcLyl8KD86aHR0cHM6XFwvXFwvKT8oPzp3d3cuKT8oPzpnaXRodWIuY29tKSkpKF5cXC8qW1xcdystXy9dKlxcLykqPyhcXHcrLnNvbCkvZyxcbiAgICAgICAgICAgIGhhbmRsZTogYXN5bmMgKG1hdGNoLCBmaWxlUm9vdCkgPT4geyByZXR1cm4gYXdhaXQgaGFuZGxlTG9jYWxJbXBvcnQobWF0Y2hbMl0sIG1hdGNoWzNdLCBmaWxlUm9vdCkgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnZ2l0aHViJyxcbiAgICAgICAgICAgIG1hdGNoOiAvXihodHRwcz86XFwvXFwvKT8od3d3Lik/Z2l0aHViLmNvbVxcLyhbXlxcL10qXFwvW15cXC9dKikoLipcXC8oXFx3Ky5zb2wpKS9nLFxuICAgICAgICAgICAgaGFuZGxlOiBhc3luYyAobWF0Y2gsIGZpbGVSb290KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGhhbmRsZUdpdGh1YkNhbGwobWF0Y2hbMF0sIG1hdGNoWzNdLCBtYXRjaFs0XSwgbWF0Y2hbNV0sIGZpbGVSb290KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJlc29sdmVJbXBvcnRzKGZpbGVSb290LCBzb3VyY2VQYXRoKSB7XG4gICAgY29uc3QgaGFuZGxlcnMgPSBhd2FpdCBnZXRIYW5kbGVycygpO1xuICAgIGxldCByZXNwb25zZSA9IHt9O1xuICAgIGZvcihjb25zdCBoYW5kbGVyIG9mIGhhbmRsZXJzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBoZXJlIHdlIGFyZSB0cnlpbmcgdG8gZmluZCB0eXBlIG9mIGltcG9ydCBwYXRoIGdpdGh1Yi9zd2FybS9pcGZzL2xvY2FsXG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IGhhbmRsZXIubWF0Y2guZXhlYyhzb3VyY2VQYXRoKTtcbiAgICAgICAgICAgIGlmKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBoYW5kbGVyLmhhbmRsZShtYXRjaCwgZmlsZVJvb3QpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbWJpbmVTb3VyY2UoZmlsZVJvb3QsIHNvdXJjZXMpIHtcbiAgICBsZXQgZm4sIGlsaW5lLCBpcjtcbiAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgIGlyID0gL15pbXBvcnQqXFwgW1xcJ1xcXCJdKC4rKVtcXCdcXFwiXVxcOy9nbTtcbiAgICBsZXQgbWF0Y2ggPSBudWxsO1xuICAgIGZvciAoY29uc3QgZmlsZU5hbWUgb2YgT2JqZWN0LmtleXMoc291cmNlcykpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gc291cmNlc1tmaWxlTmFtZV0uY29udGVudDtcbiAgICAgICAgd2hpbGUobWF0Y2ggPSBpci5leGVjKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIG1hdGNoZXMucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKGxldCBtYXRjaCBvZiBtYXRjaGVzKSB7XG4gICAgICAgICAgICBpbGluZSA9IG1hdGNoWzBdO1xuICAgICAgICAgICAgaWYodmFsaWRVcmwuaXNVcmkoZmlsZVJvb3QpKSB7XG4gICAgICAgICAgICAgICAgZm4gPSB1cmwucmVzb2x2ZShmaWxlUm9vdCwgbWF0Y2hbMV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbiA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgc3ViU29yY2UgPSB7fTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlc29sdmVJbXBvcnRzKGZpbGVSb290LCBmbik7XG4gICAgICAgICAgICAgICAgc291cmNlc1tmaWxlTmFtZV0uY29udGVudCA9IHNvdXJjZXNbZmlsZU5hbWVdLmNvbnRlbnQucmVwbGFjZShpbGluZSwgJ2ltcG9ydCBcXCcnICsgcmVzcG9uc2UuZmlsZW5hbWUgKyAnXFwnOycpO1xuICAgICAgICAgICAgICAgIHN1YlNvcmNlW3Jlc3BvbnNlLmZpbGVuYW1lXSA9IHsgY29udGVudDogcmVzcG9uc2UuY29udGVudCB9O1xuICAgICAgICAgICAgICAgIHNvdXJjZXMgPSBPYmplY3QuYXNzaWduKGF3YWl0IGNvbWJpbmVTb3VyY2UocmVzcG9uc2UuZmlsZVJvb3QsIHN1YlNvcmNlKSwgc291cmNlcyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc291cmNlcztcbn1cbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5jbGFzcyBDbGllbnRTZWxlY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgc2VsZWN0ZWRFbnY6IGF0b20uY29uZmlnLmdldCgnZXRoZXJhdG9tLmV4ZWN1dGlvbkVudicpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faGFuZGxlQ2hhbmdlID0gdGhpcy5faGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIGFzeW5jIF9oYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdldGhlcmF0b20uZXhlY3V0aW9uRW52JywgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkRW52OiBldmVudC50YXJnZXQudmFsdWUgfSk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBjbGllbnRzIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsaWVudC1zZWxlY3RcIj5cbiAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24gaWNvbi1wbHVnXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xpZW50c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudHMubWFwKChjbGllbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbGllbnQtaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInJhZGlvXCIgY2xhc3M9XCJpbnB1dC1yYWRpb1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjbGllbnQucHJvdmlkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9oYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e3RoaXMuc3RhdGUuc2VsZWN0ZWRFbnYgPT09IGNsaWVudC5wcm92aWRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImlucHV0LWxhYmVsIGlubGluZS1ibG9jayBoaWdobGlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2NsaWVudC5kZXNjfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBjbGllbnRSZWR1Y2VyIH0pID0+IHtcbiAgICBjb25zdCB7IGNsaWVudHMgfSA9IGNsaWVudFJlZHVjZXI7XG5cdHJldHVybiB7IGNsaWVudHMgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHt9KShDbGllbnRTZWxlY3Rvcik7XG4iLCIndXNlIGJhYmVsJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xuXG5jbGFzcyBHYXNJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgZ2FzOiBwcm9wcy5nYXNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgY29uc3QgeyBnYXMgfSA9IG5leHRQcm9wcztcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGdhcyB9KTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGdhc0xpbWl0IH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBjb25zdCB7IGNvbnRyYWN0TmFtZSB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxmb3JtIGNsYXNzPVwiZ2FzLWVzdGltYXRlLWZvcm1cIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiaW5wdXQgdGV4dC1zdWJ0bGVcIj5HYXMgc3VwcGx5PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIGlkPXtjb250cmFjdE5hbWUgKyAnX2dhcyd9XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImlucHV0c1wiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmdhc31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMub25DaGFuZ2V9PlxuICAgICAgICAgICAgICAgIDwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPkdhcyBMaW1pdCA6IHtnYXNMaW1pdH08L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBjb250cmFjdCB9KSA9PiB7XG5cdGNvbnN0IHsgY29tcGlsZWQsIGdhc0xpbWl0IH0gPSBjb250cmFjdDtcblx0cmV0dXJuIHsgY29tcGlsZWQsIGdhc0xpbWl0IH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7fSkoR2FzSW5wdXQpO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmV4cG9ydCBjb25zdCBTRVRfQ09NUElMSU5HID0gJ3NldF9jb21waWxpbmcnO1xuZXhwb3J0IGNvbnN0IFNFVF9DT01QSUxFRCA9ICdzZXRfY29tcGlsZWQnO1xuZXhwb3J0IGNvbnN0IFNFVF9QQVJBTVMgPSAnc2V0X3BhcmFtcyc7XG5leHBvcnQgY29uc3QgQUREX0lOVEVSRkFDRSA9ICdhZGRfaW50ZXJmYWNlJztcbmV4cG9ydCBjb25zdCBTRVRfSU5TVEFOQ0UgPSAnc2V0X2luc3RhbmNlJztcbmV4cG9ydCBjb25zdCBTRVRfREVQTE9ZRUQgPSAnc2V0X2RlcGxveWVkJztcbmV4cG9ydCBjb25zdCBTRVRfR0FTX0xJTUlUID0gJ3NldF9nYXNfbGltaXQnO1xuXG5leHBvcnQgY29uc3QgU0VUX0NPSU5CQVNFID0gJ3NldF9jb2luYmFzZSc7XG5leHBvcnQgY29uc3QgU0VUX1BBU1NXT1JEID0gJ3NldF9wYXNzd29yZCc7XG5leHBvcnQgY29uc3QgU0VUX0FDQ09VTlRTID0gJ3NldF9hY2NvdW50cyc7XG5cbmV4cG9ydCBjb25zdCBTRVRfRVJST1JTID0gJ3NldF9lcnJvcnMnO1xuXG4vLyBFdGhlcmV1bSBjbGllbnQgZXZlbnRzXG5leHBvcnQgY29uc3QgQUREX1BFTkRJTkdfVFJBTlNBQ1RJT04gPSAnYWRkX3BlbmRpbmdfdHJhbnNhY3Rpb24nO1xuZXhwb3J0IGNvbnN0IEFERF9FVkVOVFMgPSAnYWRkX2xvZ3MnO1xuZXhwb3J0IGNvbnN0IFNFVF9FVkVOVFMgPSAnc2V0X2V2ZW50cyc7XG5cbi8vIE5vZGUgdmFyaWFibGVzXG5leHBvcnQgY29uc3QgU0VUX1NZTkNfU1RBVFVTID0gJ3NldF9zeW5jX3N0YXR1cyc7XG5leHBvcnQgY29uc3QgU0VUX1NZTkNJTkcgPSAnc2V0X3N5bmNpbmcnO1xuZXhwb3J0IGNvbnN0IFNFVF9NSU5JTkcgPSAnc2V0X21pbmluZyc7XG5leHBvcnQgY29uc3QgU0VUX0hBU0hfUkFURSA9ICdzZXRfaGFzaF9yYXRlJztcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgeyBTRVRfQ09NUElMRUQsIFNFVF9QQVJBTVMsIEFERF9JTlRFUkZBQ0UsIFNFVF9ERVBMT1lFRCwgU0VUX0lOU1RBTkNFIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBjb250cmFjdENvbXBpbGVkID0gKGRpc3BhdGNoLCBjb21waWxlZCkgPT4ge1xuICAgIGRpc3BhdGNoKHsgdHlwZTogU0VUX0NPTVBJTEVELCBwYXlsb2FkOiBjb21waWxlZCB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRQYXJhbXNJbnB1dCA9ICh7IGNvbnRyYWN0TmFtZSwgYWJpIH0pID0+IHtcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogU0VUX1BBUkFNUywgcGF5bG9hZDogeyBjb250cmFjdE5hbWUsIGFiaSB9IH0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBhZGRJbnRlcmZhY2UgPSAoeyBjb250cmFjdE5hbWUsIENvbnRyYWN0QUJJIH0pID0+IHtcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogQUREX0lOVEVSRkFDRSwgcGF5bG9hZDogeyBjb250cmFjdE5hbWUsIGludGVyZmFjZTogQ29udHJhY3RBQkkgfSB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0SW5zdGFuY2UgPSAoeyBjb250cmFjdE5hbWUsIGluc3RhbmNlIH0pID0+IHtcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogU0VUX0lOU1RBTkNFLCBwYXlsb2FkOiB7IGNvbnRyYWN0TmFtZSwgaW5zdGFuY2UgfSB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0RGVwbG95ZWQgPSAoeyBjb250cmFjdE5hbWUsIGRlcGxveWVkIH0pID0+IHtcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogU0VUX0RFUExPWUVELCBwYXlsb2FkOiB7IGNvbnRyYWN0TmFtZSwgZGVwbG95ZWQgfSB9KTtcbiAgICB9XG59O1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCB7IFNFVF9BQ0NPVU5UUywgU0VUX0NPSU5CQVNFLCBTRVRfUEFTU1dPUkQgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IHNldENvaW5iYXNlID0gKGNvaW5iYXNlKSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFNFVF9DT0lOQkFTRSwgcGF5bG9hZDogY29pbmJhc2UgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNldFBhc3N3b3JkID0gKHsgcGFzc3dvcmQgfSkgPT4ge1xuICAgIHJldHVybiAoZGlzcGF0Y2gpID0+IHtcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBTRVRfUEFTU1dPUkQsIHBheWxvYWQ6IHsgcGFzc3dvcmQgfSB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0QWNjb3VudHMgPSAoeyBhY2NvdW50cyB9KSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFNFVF9BQ0NPVU5UUywgcGF5bG9hZDogYWNjb3VudHMgfSk7XG4gICAgfVxufTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgeyBBRERfRVZFTlRTIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBhZGROZXdFdmVudHMgPSAoeyBwYXlsb2FkIH0pID0+IHtcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogQUREX0VWRU5UUywgcGF5bG9hZCB9KTtcbiAgICB9XG59O1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCB7IFNFVF9TWU5DX1NUQVRVUywgU0VUX01JTklORywgU0VUX0hBU0hfUkFURSB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgY29uc3Qgc2V0U3luY1N0YXR1cyA9IChzdGF0dXMpID0+IHtcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogU0VUX1NZTkNfU1RBVFVTLCBwYXlsb2FkOiBzdGF0dXMgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNldE1pbmluZyA9IChtaW5pbmcpID0+IHtcbiAgICByZXR1cm4gKGRpc3BhdGNoKSA9PiB7XG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogU0VUX01JTklORywgcGF5bG9hZDogbWluaW5nIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IHNldEhhc2hyYXRlID0gKGhhc2hyYXRlKSA9PiB7XG4gICAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFNFVF9IQVNIX1JBVEUsIHBheWxvYWQ6IGhhc2hyYXRlIH0pO1xuICAgIH1cbn1cbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgeyBzZXRQYXJhbXNJbnB1dCB9IGZyb20gJy4uLy4uL2FjdGlvbnMnXG5cbmNsYXNzIElucHV0c0Zvcm0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlQ2hhbmdlID0gdGhpcy5faGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIF9oYW5kbGVDaGFuZ2UoaW5wdXQsIGV2ZW50KSB7XG4gICAgICAgIGlucHV0LnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY29udHJhY3ROYW1lLCBhYmkgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGlkPXtjb250cmFjdE5hbWUgKyAnX2lucHV0cyd9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYWJpLnR5cGUgPT09IFwiY29uc3RydWN0b3JcIiAmJlxuICAgICAgICAgICAgICAgICAgICBhYmkuaW5wdXRzLm1hcCgoaW5wdXQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0ga2V5PXtpfSBvblN1Ym1pdD17dGhpcy5wcm9wcy5vblN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJpbnB1dCB0ZXh0LXN1YnRsZVwiPnsgaW5wdXQubmFtZSB9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2l9IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJpbnB1dHNcIiBwbGFjZWhvbGRlcj17aW5wdXQudHlwZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtpbnB1dC52YWx1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5faGFuZGxlQ2hhbmdlKGlucHV0LCBlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn07XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGNvbnRyYWN0IH0pID0+IHtcblx0Y29uc3QgeyBjb21waWxlZCB9ID0gY29udHJhY3Q7XG5cdHJldHVybiB7IGNvbXBpbGVkIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7IHNldFBhcmFtc0lucHV0IH0pKElucHV0c0Zvcm0pO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcbmltcG9ydCB7IHNldEluc3RhbmNlLCBzZXREZXBsb3llZCwgYWRkTmV3RXZlbnRzIH0gZnJvbSAnLi4vLi4vYWN0aW9ucydcblxuY2xhc3MgQ3JlYXRlQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvclBhcmFtczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY29pbmJhc2U6IHByb3BzLmNvaW5iYXNlLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHByb3BzLnBhc3N3b3JkLFxuICAgICAgICAgICAgYXRBZGRyZXNzOiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9oYW5kbGVBdEFkZHJlc3NDaGFuZ2UgPSB0aGlzLl9oYW5kbGVBdEFkZHJlc3NDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlU3VibWl0ID0gdGhpcy5faGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gICAgfVxuICAgIGFzeW5jIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBjb25zdCB7IGFiaSB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgaW5wdXRzID0gW107XG4gICAgICAgIGZvciAoYWJpT2JqIGluIGFiaSkge1xuICAgICAgICAgICAgaWYgKGFiaVthYmlPYmpdLnR5cGUgPT09IFwiY29uc3RydWN0b3JcIiAmJiBhYmlbYWJpT2JqXS5pbnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlucHV0cyA9IGFiaVthYmlPYmpdLmlucHV0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgY29uc3RydWN0b3JQYXJhbXM6IGlucHV0cyB9KTtcbiAgICB9XG4gICAgYXN5bmMgX2hhbmRsZUF0QWRkcmVzc0NoYW5nZShldmVudCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYXRBZGRyZXNzOiBldmVudC50YXJnZXQudmFsdWUgfSk7XG4gICAgfVxuICAgIGFzeW5jIF9oYW5kbGVTdWJtaXQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGFiaSwgYnl0ZWNvZGUsIGNvbnRyYWN0TmFtZSwgZ2FzLCBjb2luYmFzZSwgcGFzc3dvcmQgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBjb25zdCB7IGNvbnN0cnVjdG9yUGFyYW1zLCBhdEFkZHJlc3MgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICBjb25zdCBjb250cmFjdEludGVyZmFjZSA9IHRoaXMucHJvcHMuaW50ZXJmYWNlc1tjb250cmFjdE5hbWVdLmludGVyZmFjZTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yID0gY29udHJhY3RJbnRlcmZhY2UuZmluZChpbnRlcmZhY2VJdGVtID0+IGludGVyZmFjZUl0ZW0udHlwZSA9PT0gXCJjb25zdHJ1Y3RvclwiKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IFtdO1xuICAgICAgICAgICAgaWYoY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICBmb3IoaW5wdXQgb2YgY29uc3RydWN0b3IuaW5wdXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGlucHV0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRyYWN0ID0gYXdhaXQgdGhpcy5oZWxwZXJzLmNyZWF0ZSh7IGNvaW5iYXNlLCBwYXNzd29yZCwgYXRBZGRyZXNzLCBhYmksIGJ5dGVjb2RlLCBjb250cmFjdE5hbWUsIGdhcyB9KTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0SW5zdGFuY2UoeyBjb250cmFjdE5hbWUsIGluc3RhbmNlOiBPYmplY3QuYXNzaWduKHt9LCBjb250cmFjdCkgfSk7XG5cbiAgICAgICAgICAgIGlmKCFhdEFkZHJlc3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250cmFjdEluc3RhbmNlID0gYXdhaXQgdGhpcy5oZWxwZXJzLmRlcGxveShjb250cmFjdCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNldERlcGxveWVkKHsgY29udHJhY3ROYW1lLCBkZXBsb3llZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICBjb250cmFjdEluc3RhbmNlLm9uKCdhZGRyZXNzJywgYWRkcmVzcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0Lm9wdGlvbnMuYWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0SW5zdGFuY2UoeyBjb250cmFjdE5hbWUsIGluc3RhbmNlOiBPYmplY3QuYXNzaWduKHt9LCBjb250cmFjdCkgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udHJhY3RJbnN0YW5jZS5vbigndHJhbnNhY3Rpb25IYXNoJywgdHJhbnNhY3Rpb25IYXNoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3QudHJhbnNhY3Rpb25IYXNoID0gdHJhbnNhY3Rpb25IYXNoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNldEluc3RhbmNlKHsgY29udHJhY3ROYW1lLCBpbnN0YW5jZTogT2JqZWN0LmFzc2lnbih7fSwgY29udHJhY3QpIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRyYWN0SW5zdGFuY2Uub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlbHBlcnMuc2hvd1BhbmVsRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRyYWN0SW5zdGFuY2Uub24oJ2luc3RhbmNlJywgaW5zdGFuY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5ldmVudHMuYWxsRXZlbnRzKHsgZnJvbUJsb2NrOiAnbGF0ZXN0JyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdsb2dzJywgKGxvZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGxvZ3MgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGRhdGEgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2VkJywgKGNoYW5nZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGNoYW5nZWQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udHJhY3RJbnN0YW5jZS5vbignZXJyb3InLCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVscGVycy5zaG93UGFuZWxFcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRyYWN0Lm9wdGlvbnMuYWRkcmVzcyA9IGF0QWRkcmVzcztcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNldERlcGxveWVkKHsgY29udHJhY3ROYW1lLCBkZXBsb3llZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnNldEluc3RhbmNlKHsgY29udHJhY3ROYW1lLCBpbnN0YW5jZTogT2JqZWN0LmFzc2lnbih7fSwgY29udHJhY3QpIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRyYWN0LmV2ZW50cy5hbGxFdmVudHMoeyBmcm9tQmxvY2s6ICdsYXRlc3QnIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignbG9ncycsIChsb2dzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGxvZ3MgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGRhdGEgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlZCcsIChjaGFuZ2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5ld0V2ZW50cyh7IHBheWxvYWQ6IGNoYW5nZWQgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIHRoaXMuaGVscGVycy5zaG93UGFuZWxFcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY29udHJhY3ROYW1lIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuX2hhbmRsZVN1Ym1pdH0gY2xhc3M9XCJwYWRkZWRcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPVwiRGVwbG95IHRvIGJsb2NrY2hhaW5cIlxuICAgICAgICAgICAgICAgICAgICByZWY9e2NvbnRyYWN0TmFtZX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgaW5saW5lLWJsb2NrLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImF0OlwiIGNsYXNzPVwiaW5wdXRzXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuYXRBZGRyZXNzfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5faGFuZGxlQXRBZGRyZXNzQ2hhbmdlfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICk7XG4gICAgfVxufTtcblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHsgY29udHJhY3QsIGFjY291bnQgfSkgPT4ge1xuXHRjb25zdCB7IGNvbXBpbGVkLCBpbnRlcmZhY2VzIH0gPSBjb250cmFjdDtcbiAgICBjb25zdCB7IGNvaW5iYXNlLCBwYXNzd29yZCB9ID0gYWNjb3VudDtcblx0cmV0dXJuIHsgY29tcGlsZWQsIGludGVyZmFjZXMsIGNvaW5iYXNlLCBwYXNzd29yZCB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgeyBzZXREZXBsb3llZCwgc2V0SW5zdGFuY2UsIGFkZE5ld0V2ZW50cyB9KShDcmVhdGVCdXR0b24pO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcbmltcG9ydCBSZWFjdEpzb24gZnJvbSAncmVhY3QtanNvbi12aWV3J1xuaW1wb3J0IHsgVGFiLCBUYWJzLCBUYWJMaXN0LCBUYWJQYW5lbCB9IGZyb20gJ3JlYWN0LXRhYnMnXG5pbXBvcnQgR2FzSW5wdXQgZnJvbSAnLi4vR2FzSW5wdXQnXG5pbXBvcnQgSW5wdXRzRm9ybSBmcm9tICcuLi9JbnB1dHNGb3JtJ1xuaW1wb3J0IENyZWF0ZUJ1dHRvbiBmcm9tICcuLi9DcmVhdGVCdXR0b24nXG5pbXBvcnQgeyBhZGRJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9hY3Rpb25zJ1xuXG5jbGFzcyBDb250cmFjdENvbXBpbGVkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBlc3RpbWF0ZWRHYXM6IDkwMDAwMDAsXG4gICAgICAgICAgICBDb250cmFjdEFCSTogcHJvcHMuaW50ZXJmYWNlc1twcm9wcy5jb250cmFjdE5hbWVdLmludGVyZmFjZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hhbmRsZUdhc0NoYW5nZSA9IHRoaXMuX2hhbmRsZUdhc0NoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVJbnB1dCA9IHRoaXMuX2hhbmRsZUlucHV0LmJpbmQodGhpcyk7XG4gICAgfVxuICAgIGFzeW5jIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBjb2luYmFzZSwgYnl0ZWNvZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgICAgICBjb25zdCBnYXMgPSBhd2FpdCB0aGlzLmhlbHBlcnMuZ2V0R2FzRXN0aW1hdGUoY29pbmJhc2UsIGJ5dGVjb2RlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlc3RpbWF0ZWRHYXM6IGdhcyB9KTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIHRoaXMuaGVscGVycy5zaG93UGFuZWxFcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfaGFuZGxlR2FzQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlc3RpbWF0ZWRHYXM6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcbiAgICB9XG4gICAgX2hhbmRsZUlucHV0KCkge1xuICAgICAgICBjb25zdCB7IGNvbnRyYWN0TmFtZSB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgY29uc3QgeyBDb250cmFjdEFCSSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgdGhpcy5wcm9wcy5hZGRJbnRlcmZhY2UoeyBjb250cmFjdE5hbWUsIENvbnRyYWN0QUJJIH0pO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY29udHJhY3ROYW1lLCBieXRlY29kZSwgaW5kZXggfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IHsgZXN0aW1hdGVkR2FzLCBDb250cmFjdEFCSSB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250cmFjdC1jb250ZW50XCIga2V5PXtpbmRleH0+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjb250cmFjdC1uYW1lIGlubGluZS1ibG9jayBoaWdobGlnaHQtc3VjY2Vzc1wiPnsgY29udHJhY3ROYW1lIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ5dGUtY29kZVwiPlxuICAgICAgICAgICAgICAgICAgICA8cHJlIGNsYXNzPVwibGFyZ2UtY29kZVwiPnsgSlNPTi5zdHJpbmdpZnkoYnl0ZWNvZGUpIH08L3ByZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWJpLWRlZmluaXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYnM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiTGlzdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiX2J0bnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG5cIj5JbnRlcmZhY2U8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuXCI+SW50ZXJmYWNlIE9iamVjdDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVGFiTGlzdD5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwcmUgY2xhc3M9XCJsYXJnZS1jb2RlXCI+eyBKU09OLnN0cmluZ2lmeShDb250cmFjdEFCSSkgfTwvcHJlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWJQYW5lbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UmVhY3RKc29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17Q29udHJhY3RBQkl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lPVwiY2hhbGtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RGF0YVR5cGVzPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlZD17Mn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VTdHJpbmdzQWZ0ZXJMZW5ndGg9ezMyfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uU3R5bGU9XCJ0cmlhbmdsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgICAgIDwvVGFicz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENvbnRyYWN0QUJJLm1hcCgoYWJpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPElucHV0c0Zvcm0gY29udHJhY3ROYW1lPXtjb250cmFjdE5hbWV9IGFiaT17YWJpfSBvblN1Ym1pdD17dGhpcy5faGFuZGxlSW5wdXR9Lz5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPEdhc0lucHV0IGNvbnRyYWN0TmFtZT17Y29udHJhY3ROYW1lfSBnYXM9e2VzdGltYXRlZEdhc30gb25DaGFuZ2U9e3RoaXMuX2hhbmRsZUdhc0NoYW5nZX0gLz5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIDxDcmVhdGVCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyYWN0TmFtZT17Y29udHJhY3ROYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZWNvZGU9e2J5dGVjb2RlfVxuICAgICAgICAgICAgICAgICAgICAgICAgYWJpPXtDb250cmFjdEFCSX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGdhcz17ZXN0aW1hdGVkR2FzfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGVscGVycz17dGhpcy5oZWxwZXJzfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn07XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGFjY291bnQsIGNvbnRyYWN0IH0pID0+IHtcblx0Y29uc3QgeyBjb21waWxlZCwgaW50ZXJmYWNlcyB9ID0gY29udHJhY3Q7XG4gICAgY29uc3QgeyBjb2luYmFzZSB9ID0gYWNjb3VudDtcblx0cmV0dXJuIHsgY29tcGlsZWQsIGludGVyZmFjZXMsIGNvaW5iYXNlIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7IGFkZEludGVyZmFjZSB9KShDb250cmFjdENvbXBpbGVkKTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5cbmNsYXNzIEZ1bmN0aW9uQUJJIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgICAgIHRoaXMuX2hhbmRsZUNoYW5nZSA9IHRoaXMuX2hhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVQYXlhYmxlVmFsdWUgPSB0aGlzLl9oYW5kbGVQYXlhYmxlVmFsdWUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlRmFsbGJhY2sgPSB0aGlzLl9oYW5kbGVGYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVTdWJtaXQgPSB0aGlzLl9oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgX2hhbmRsZUNoYW5nZShpbnB1dCwgZXZlbnQpIHtcbiAgICAgICAgaW5wdXQudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfVxuICAgIF9oYW5kbGVQYXlhYmxlVmFsdWUoYWJpLCBldmVudCkge1xuICAgICAgICBhYmkucGF5YWJsZVZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIH1cbiAgICBhc3luYyBfaGFuZGxlRmFsbGJhY2soYWJpSXRlbSkge1xuICAgICAgICBjb25zdCB7IGNvbnRyYWN0TmFtZSwgY29pbmJhc2UsIHBhc3N3b3JkLCBpbnN0YW5jZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IGNvbnRyYWN0ID0gaW5zdGFuY2VzW2NvbnRyYWN0TmFtZV07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmhlbHBlcnMuY2FsbCh7IGNvaW5iYXNlLCBwYXNzd29yZCwgY29udHJhY3QsIGFiaUl0ZW0gfSk7XG4gICAgICAgICAgICB0aGlzLmhlbHBlcnMuc2hvd091dHB1dCh7IGFkZHJlc3M6IGNvbnRyYWN0Lm9wdGlvbnMuYWRkcmVzcywgZGF0YTogcmVzdWx0IH0pO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgdGhpcy5oZWxwZXJzLnNob3dQYW5lbEVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIF9oYW5kbGVTdWJtaXQobWV0aG9kSXRlbSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBjb250cmFjdE5hbWUsIGNvaW5iYXNlLCBwYXNzd29yZCwgaW5zdGFuY2VzIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICAgICAgY29uc3QgY29udHJhY3QgPSBpbnN0YW5jZXNbY29udHJhY3ROYW1lXTtcbiAgICAgICAgICAgIGxldCBwYXJhbXMgPSBbXTtcbiAgICAgICAgICAgIGZvcihpbnB1dCBvZiBtZXRob2RJdGVtLmlucHV0cykge1xuICAgICAgICAgICAgICAgIGlmKGlucHV0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmhlbHBlcnMuY2FsbCh7IGNvaW5iYXNlLCBwYXNzd29yZCwgY29udHJhY3QsIGFiaUl0ZW06IG1ldGhvZEl0ZW0sIHBhcmFtcyB9KTtcbiAgICAgICAgICAgIHRoaXMuaGVscGVycy5zaG93T3V0cHV0KHsgYWRkcmVzczogY29udHJhY3Qub3B0aW9ucy5hZGRyZXNzLCBkYXRhOiByZXN1bHQgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgdGhpcy5oZWxwZXJzLnNob3dQYW5lbEVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBjb250cmFjdE5hbWUsIGludGVyZmFjZXMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IENvbnRyYWN0QUJJID0gaW50ZXJmYWNlc1tjb250cmFjdE5hbWVdLmludGVyZmFjZTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhYmktY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDb250cmFjdEFCSS5tYXAoKGFiaSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYWJpLnR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZnVuY3Rpb24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17KCkgPT4geyB0aGlzLl9oYW5kbGVTdWJtaXQoYWJpKSB9fSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9e2FiaS5uYW1lfSBjbGFzcz1cInRleHQtc3VidGxlIGNhbGwtYnV0dG9uXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFiaS5pbnB1dHMubWFwKChpbnB1dCwgaikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImNhbGwtYnV0dG9uLXZhbHVlc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtpbnB1dC5uYW1lICsgJyAnICsgaW5wdXQudHlwZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2lucHV0LnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB0aGlzLl9oYW5kbGVDaGFuZ2UoaW5wdXQsIGV2ZW50KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtqfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFiaS5wYXlhYmxlID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJjYWxsLWJ1dHRvbi12YWx1ZXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInBheWFibGUgdmFsdWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldmVudCkgPT4gdGhpcy5faGFuZGxlUGF5YWJsZVZhbHVlKGFiaSwgZXZlbnQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFiaS50eXBlID09PSAnZmFsbGJhY2snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZhbGxiYWNrLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9eygpID0+IHsgdGhpcy5faGFuZGxlRmFsbGJhY2soYWJpKSB9fSBrZXk9e2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIj5mYWxsYmFjazwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJpLnBheWFibGUgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImNhbGwtYnV0dG9uLXZhbHVlc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwic2VuZCBldGhlciB0byBjb250cmFjdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2ZW50KSA9PiB0aGlzLl9oYW5kbGVQYXlhYmxlVmFsdWUoYWJpLCBldmVudCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn07XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGNvbnRyYWN0LCBhY2NvdW50IH0pID0+IHtcblx0Y29uc3QgeyBjb21waWxlZCwgaW50ZXJmYWNlcywgaW5zdGFuY2VzIH0gPSBjb250cmFjdDtcbiAgICBjb25zdCB7IGNvaW5iYXNlLCBwYXNzd29yZCB9ID0gYWNjb3VudDtcblx0cmV0dXJuIHsgY29tcGlsZWQsIGludGVyZmFjZXMsIGluc3RhbmNlcywgY29pbmJhc2UsIHBhc3N3b3JkIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7fSkoRnVuY3Rpb25BQkkpO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcbmltcG9ydCBSZWFjdEpzb24gZnJvbSAncmVhY3QtanNvbi12aWV3J1xuaW1wb3J0IHsgVGFiLCBUYWJzLCBUYWJMaXN0LCBUYWJQYW5lbCB9IGZyb20gJ3JlYWN0LXRhYnMnXG5pbXBvcnQgSW5wdXRzRm9ybSBmcm9tICcuLi9JbnB1dHNGb3JtJ1xuaW1wb3J0IEZ1bmN0aW9uQUJJIGZyb20gJy4uL0Z1bmN0aW9uQUJJJ1xuXG5jbGFzcyBDb250cmFjdEV4ZWN1dGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmhlbHBlcnMgPSBwcm9wcy5oZWxwZXJzO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY29udHJhY3ROYW1lLCBieXRlY29kZSwgaW5kZXgsIGluc3RhbmNlcywgaW50ZXJmYWNlcyB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgY29uc3QgY29udHJhY3QgPSBpbnN0YW5jZXNbY29udHJhY3ROYW1lXTtcbiAgICAgICAgY29uc3QgQ29udHJhY3RBQkkgPSBpbnRlcmZhY2VzW2NvbnRyYWN0TmFtZV0uaW50ZXJmYWNlO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRyYWN0LWNvbnRlbnRcIiBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNvbnRyYWN0LW5hbWUgaW5saW5lLWJsb2NrIGhpZ2hsaWdodC1zdWNjZXNzXCI+e2NvbnRyYWN0TmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ5dGUtY29kZVwiPlxuICAgICAgICAgICAgICAgICAgICA8cHJlIGNsYXNzPVwibGFyZ2UtY29kZVwiPnsgSlNPTi5zdHJpbmdpZnkoYnl0ZWNvZGUpIH08L3ByZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWJpLWRlZmluaXRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYnM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiTGlzdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFiX2J0bnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG5cIj5JbnRlcmZhY2U8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuXCI+SW50ZXJmYWNlIE9iamVjdDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVGFiTGlzdD5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwcmUgY2xhc3M9XCJsYXJnZS1jb2RlXCI+eyBKU09OLnN0cmluZ2lmeShDb250cmFjdEFCSSkgfTwvcHJlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxUYWJQYW5lbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UmVhY3RKc29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17Q29udHJhY3RBQkl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lPVwib2NlYW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RGF0YVR5cGVzPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlZD17Mn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgICAgICAgICAgPC9UYWJzPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3QudHJhbnNhY3Rpb25IYXNoICYmXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9e2NvbnRyYWN0TmFtZSArICdfdHhIYXNoJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlubGluZS1ibG9jayBoaWdobGlnaHRcIj5UcmFuc2FjdGlvbiBoYXNoOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwcmUgY2xhc3M9XCJsYXJnZS1jb2RlXCI+e2NvbnRyYWN0LnRyYW5zYWN0aW9uSGFzaH08L3ByZT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgIWNvbnRyYWN0Lm9wdGlvbnMuYWRkcmVzcyAmJlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPXtjb250cmFjdE5hbWUgKyAnX3N0YXQnfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3RhdC1taW5pbmcgc3RhdC1taW5pbmctYWxpZ25cIj53YWl0aW5nIHRvIGJlIG1pbmVkPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsb2FkaW5nIGxvYWRpbmctc3Bpbm5lci10aW55IGlubGluZS1ibG9jayBzdGF0LW1pbmluZy1hbGlnblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJhY3Qub3B0aW9ucy5hZGRyZXNzICYmXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9e2NvbnRyYWN0TmFtZSArICdfc3RhdCd9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0XCI+TWluZWQgYXQ6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHByZSBjbGFzcz1cImxhcmdlLWNvZGVcIj57Y29udHJhY3Qub3B0aW9ucy5hZGRyZXNzfTwvcHJlPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDb250cmFjdEFCSS5tYXAoKGFiaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxJbnB1dHNGb3JtIGNvbnRyYWN0TmFtZT17Y29udHJhY3ROYW1lfSBhYmk9e2FiaX0gLz5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPEZ1bmN0aW9uQUJJIGNvbnRyYWN0TmFtZT17Y29udHJhY3ROYW1lfSBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBjb250cmFjdCB9KSA9PiB7XG5cdGNvbnN0IHsgaW50ZXJmYWNlcywgaW5zdGFuY2VzIH0gPSBjb250cmFjdDtcblx0cmV0dXJuIHsgaW50ZXJmYWNlcywgaW5zdGFuY2VzIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCB7fSkoQ29udHJhY3RFeGVjdXRpb24pO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcblxuY2xhc3MgRXJyb3JWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBlcnJvcm1zZyB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImVycm9yLWxpc3QgYmxvY2tcIj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ybXNnLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgZXJyb3Jtc2cubWFwKG1zZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cuc2V2ZXJpdHkgPT09ICd3YXJuaW5nJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uIGljb24tYWxlcnQgdGV4dC13YXJuaW5nXCI+e21zZy5mb3JtYXR0ZWRNZXNzYWdlIHx8IG1zZy5tZXNzYWdlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cuc2V2ZXJpdHkgPT09ICdlcnJvcicgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbiBpY29uLWJ1ZyB0ZXh0LWVycm9yXCI+e21zZy5mb3JtYXR0ZWRNZXNzYWdlIHx8IG1zZy5tZXNzYWdlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICk7XG4gICAgfVxufVxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHsgZXJyb3JzIH0pID0+IHtcblx0Y29uc3QgeyBlcnJvcm1zZyB9ID0gZXJyb3JzO1xuXHRyZXR1cm4geyBlcnJvcm1zZyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywge30pKEVycm9yVmlldyk7XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY29ubmVjdCwgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCdcbmltcG9ydCB7IENvbGxhcHNlIH0gZnJvbSAncmVhY3QtY29sbGFwc2UnXG5pbXBvcnQgQ29udHJhY3RDb21waWxlZCBmcm9tICcuLi9Db250cmFjdENvbXBpbGVkJ1xuaW1wb3J0IENvbnRyYWN0RXhlY3V0aW9uIGZyb20gJy4uL0NvbnRyYWN0RXhlY3V0aW9uJ1xuaW1wb3J0IEVycm9yVmlldyBmcm9tICcuLi9FcnJvclZpZXcnXG5pbXBvcnQgeyBhZGRJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9hY3Rpb25zJ1xuXG5jbGFzcyBDb2xsYXBzZWRGaWxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBpc09wZW5lZDogZmFsc2UsXG4gICAgICAgICAgICB0b2dnbGVCdG5TdHlsZTogJ2J0biBpY29uIGljb24tdW5mb2xkIGlubGluZS1ibG9jay10aWdodCcsXG4gICAgICAgICAgICB0b2dnbGVCdG5UeHQ6ICdFeHBhbmQnXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdG9nZ2xlQ29sbGFwc2UgPSB0aGlzLl90b2dnbGVDb2xsYXBzZS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBfdG9nZ2xlQ29sbGFwc2UoKSB7XG4gICAgICAgIGNvbnN0IHsgaXNPcGVuZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc09wZW5lZDogIWlzT3BlbmVkIH0pO1xuICAgICAgICBpZighaXNPcGVuZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUJ0blN0eWxlOiAnYnRuIGJ0bi1zdWNjZXNzIGljb24gaWNvbi1mb2xkIGlubGluZS1ibG9jay10aWdodCcsXG4gICAgICAgICAgICAgICAgdG9nZ2xlQnRuVHh0OiAnQ29sbGFwc2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUJ0blN0eWxlOiAnYnRuIGljb24gaWNvbi11bmZvbGQgaW5saW5lLWJsb2NrLXRpZ2h0JyxcbiAgICAgICAgICAgICAgICB0b2dnbGVCdG5UeHQ6ICdFeHBhbmQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgaXNPcGVuZWQsIHRvZ2dsZUJ0blN0eWxlLCB0b2dnbGVCdG5UeHQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGNvbnN0IHsgZmlsZU5hbWUsIGNvbXBpbGVkLCBkZXBsb3llZCwgY29tcGlsaW5nLCBpbnRlcmZhY2VzIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJsYWJlbCBmaWxlLWNvbGxhcHNlLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPntmaWxlTmFtZX08L2g0PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPXt0b2dnbGVCdG5TdHlsZX0gb25DbGljaz17dGhpcy5fdG9nZ2xlQ29sbGFwc2V9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3RvZ2dsZUJ0blR4dH1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8Q29sbGFwc2UgaXNPcGVuZWQ9e2lzT3BlbmVkfT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29tcGlsZWQuY29udHJhY3RzW2ZpbGVOYW1lXSkubWFwKChjb250cmFjdE5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnl0ZWNvZGUgPSBjb21waWxlZC5jb250cmFjdHNbZmlsZU5hbWVdW2NvbnRyYWN0TmFtZV0uZXZtLmJ5dGVjb2RlLm9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBDb250cmFjdEFCSSA9IGNvbXBpbGVkLmNvbnRyYWN0c1tmaWxlTmFtZV1bY29udHJhY3ROYW1lXS5hYmk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD17Y29udHJhY3ROYW1lfSBjbGFzcz1cImNvbnRyYWN0LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFkZXBsb3llZFtjb250cmFjdE5hbWVdICYmIGludGVyZmFjZXMgIT09IG51bGwgJiYgaW50ZXJmYWNlc1tjb250cmFjdE5hbWVdICYmIGNvbXBpbGluZyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29udHJhY3RDb21waWxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cmFjdE5hbWU9e2NvbnRyYWN0TmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZWNvZGU9e2J5dGVjb2RlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlbHBlcnM9e3RoaXMuaGVscGVyc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcGxveWVkW2NvbnRyYWN0TmFtZV0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29udHJhY3RFeGVjdXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJhY3ROYW1lPXtjb250cmFjdE5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVjb2RlPXtieXRlY29kZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jbGFzcyBDb250cmFjdHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5oZWxwZXJzID0gcHJvcHMuaGVscGVycztcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGNvbXBpbGVkLCBkZXBsb3llZCwgY29tcGlsaW5nLCBpbnRlcmZhY2VzIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFByb3ZpZGVyIHN0b3JlPXt0aGlzLnByb3BzLnN0b3JlfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY29tcGlsZWQtY29kZVwiIGNsYXNzPVwiY29tcGlsZWQtY29kZVwiPlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29tcGlsZWQuY29udHJhY3RzKS5tYXAoKGZpbGVOYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2xsYXBzZWRGaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZT17ZmlsZU5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlZD17Y29tcGlsZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBsb3llZD17ZGVwbG95ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxpbmc9e2NvbXBpbGluZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyZmFjZXM9e2ludGVyZmFjZXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgIWNvbXBpbGVkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LXdhcm5pbmcgbm8taGVhZGVyXCI+Tm8gY29tcGlsZWQgY29udHJhY3QhPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY29tcGlsZWQtZXJyb3JcIiBjbGFzcz1cImVycm9yLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEVycm9yVmlldyAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUHJvdmlkZXI+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBjb250cmFjdCB9KSA9PiB7XG5cdGNvbnN0IHsgY29tcGlsZWQsIGRlcGxveWVkLCBjb21waWxpbmcsIGludGVyZmFjZXMgfSA9IGNvbnRyYWN0O1xuXHRyZXR1cm4geyBjb21waWxlZCwgZGVwbG95ZWQsIGNvbXBpbGluZywgaW50ZXJmYWNlcyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywgeyBhZGRJbnRlcmZhY2UgfSkoQ29udHJhY3RzKTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgeyBDb2xsYXBzZSB9IGZyb20gJ3JlYWN0LWNvbGxhcHNlJ1xuaW1wb3J0IFJlYWN0SnNvbiBmcm9tICdyZWFjdC1qc29uLXZpZXcnXG5pbXBvcnQgVmlydHVhbExpc3QgZnJvbSAncmVhY3QtdGlueS12aXJ0dWFsLWxpc3QnXG5cbmNsYXNzIFR4QW5hbHl6ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5oZWxwZXJzID0gcHJvcHMuaGVscGVycztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHR4SGFzaDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHhBbmFseXNpczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdG9nZ2xlQnRuU3R5bGU6ICdidG4gaWNvbiBpY29uLXVuZm9sZCBpbmxpbmUtYmxvY2stdGlnaHQnLFxuICAgICAgICAgICAgaXNPcGVuZWQ6IGZhbHNlLFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hhbmRsZVR4SGFzaENoYW5nZSA9IHRoaXMuX2hhbmRsZVR4SGFzaENoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVUeEhhc2hTdWJtaXQgPSB0aGlzLl9oYW5kbGVUeEhhc2hTdWJtaXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fdG9nZ2xlQ29sbGFwc2UgPSB0aGlzLl90b2dnbGVDb2xsYXBzZS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgY29uc3QgeyBwZW5kaW5nVHJhbnNhY3Rpb25zIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBpZihwZW5kaW5nVHJhbnNhY3Rpb25zLmxlbmd0aCA8IDEwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpc09wZW5lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0b2dnbGVCdG5TdHlsZTogJ2J0biBidG4tc3VjY2VzcyBpY29uIGljb24tZm9sZCBpbmxpbmUtYmxvY2stdGlnaHQnXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuICAgIF90b2dnbGVDb2xsYXBzZSgpIHtcbiAgICAgICAgY29uc3QgeyBpc09wZW5lZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzT3BlbmVkOiAhaXNPcGVuZWQgfSk7XG4gICAgICAgIGlmKCFpc09wZW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgdG9nZ2xlQnRuU3R5bGU6ICdidG4gYnRuLXN1Y2Nlc3MgaWNvbiBpY29uLWZvbGQgaW5saW5lLWJsb2NrLXRpZ2h0J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICB0b2dnbGVCdG5TdHlsZTogJ2J0biBpY29uIGljb24tdW5mb2xkIGlubGluZS1ibG9jay10aWdodCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9oYW5kbGVUeEhhc2hDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHR4SGFzaDogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xuICAgIH1cbiAgICBhc3luYyBfaGFuZGxlVHhIYXNoU3VibWl0KCkge1xuICAgICAgICBjb25zdCB7IHR4SGFzaCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgaWYodHhIYXNoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHR4QW5hbHlzaXMgPSBhd2FpdCB0aGlzLmhlbHBlcnMuZ2V0VHhBbmFseXNpcyh0eEhhc2gpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0eEFuYWx5c2lzIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyB0b2dnbGVCdG5TdHlsZSwgaXNPcGVuZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGNvbnN0IHsgcGVuZGluZ1RyYW5zYWN0aW9ucyB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgY29uc3QgdHJhbnNhY3Rpb25zID0gcGVuZGluZ1RyYW5zYWN0aW9ucy5zbGljZSgpO1xuICAgICAgICB0cmFuc2FjdGlvbnMucmV2ZXJzZSgpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInR4LWFuYWx5emVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzPVwiZmxleC1yb3dcIiBvblN1Ym1pdD17dGhpcy5faGFuZGxlVHhIYXNoU3VibWl0fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwidHhoYXNoXCIgdmFsdWU9e3RoaXMuc3RhdGUudHhIYXNofSBvbkNoYW5nZT17dGhpcy5faGFuZGxlVHhIYXNoQ2hhbmdlfSBwbGFjZWhvbGRlcj1cIlRyYW5zYWN0aW9uIGhhc2hcIiBjbGFzcz1cImlucHV0LXNlYXJjaFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiQW5hbHl6ZVwiIGNsYXNzPVwiYnRuXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9e3RvZ2dsZUJ0blN0eWxlfSBvbkNsaWNrPXt0aGlzLl90b2dnbGVDb2xsYXBzZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBUcmFuc2FjdGlvbiBMaXN0XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxDb2xsYXBzZSBpc09wZW5lZD17aXNPcGVuZWR9PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbnMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgPFZpcnR1YWxMaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUNvdW50PXt0cmFuc2FjdGlvbnMubGVuZ3RofVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1TaXplPXszMH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInR4LWxpc3QtY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyc2NhbkNvdW50PXsxMH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJJdGVtPXsoeyBpbmRleCB9KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidHgtbGlzdC1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBhZGRlZCB0ZXh0LXdhcm5pbmdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHJhbnNhY3Rpb25zW2luZGV4XX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5zdGF0ZS50eEFuYWx5c2lzICYmIHRoaXMuc3RhdGUudHhBbmFseXNpcy50cmFuc2FjdGlvbikgJiZcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJsb2NrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJibG9jayBoaWdobGlnaHQtaW5mbyB0eC1oZWFkZXJcIj5UcmFuc2FjdGlvbjwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8UmVhY3RKc29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXt0aGlzLnN0YXRlLnR4QW5hbHlzaXMudHJhbnNhY3Rpb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU9XCJjaGFsa1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheURhdGFUeXBlcz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VTdHJpbmdzQWZ0ZXJMZW5ndGg9ezY0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25TdHlsZT1cInRyaWFuZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnN0YXRlLnR4QW5hbHlzaXMgJiYgdGhpcy5zdGF0ZS50eEFuYWx5c2lzLnRyYW5zYWN0aW9uUmVjaXB0KSAmJlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmxvY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cImJsb2NrIGhpZ2hsaWdodC1pbmZvIHR4LWhlYWRlclwiPlRyYW5zYWN0aW9uIHJlY2VpcHQ8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFJlYWN0SnNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17dGhpcy5zdGF0ZS50eEFuYWx5c2lzLnRyYW5zYWN0aW9uUmVjaXB0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lPVwiY2hhbGtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlEYXRhVHlwZXM9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlU3RyaW5nc0FmdGVyTGVuZ3RoPXs2NH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uU3R5bGU9XCJ0cmlhbmdsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBldmVudFJlZHVjZXIgfSkgPT4ge1xuXHRjb25zdCB7IHBlbmRpbmdUcmFuc2FjdGlvbnMgfSA9IGV2ZW50UmVkdWNlcjtcblx0cmV0dXJuIHsgcGVuZGluZ1RyYW5zYWN0aW9ucyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywge30pKFR4QW5hbHl6ZXIpO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcbmltcG9ydCBSZWFjdEpzb24gZnJvbSAncmVhY3QtanNvbi12aWV3J1xuaW1wb3J0IHsgQ29sbGFwc2UgfSBmcm9tICdyZWFjdC1jb2xsYXBzZSdcblxuY2xhc3MgRXZlbnRJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBpc09wZW5lZDogZmFsc2UsXG4gICAgICAgICAgICB0b2dnbGVCdG5TdHlsZTogJ2J0biBpY29uIGljb24tdW5mb2xkIGlubGluZS1ibG9jay10aWdodCcsXG4gICAgICAgICAgICB0b2dnbGVCdG5UeHQ6ICdFeHBhbmQnXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdG9nZ2xlQ29sbGFwc2UgPSB0aGlzLl90b2dnbGVDb2xsYXBzZS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBfdG9nZ2xlQ29sbGFwc2UoKSB7XG4gICAgICAgIGNvbnN0IHsgaXNPcGVuZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc09wZW5lZDogIWlzT3BlbmVkIH0pO1xuICAgICAgICBpZighaXNPcGVuZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUJ0blN0eWxlOiAnYnRuIGJ0bi1zdWNjZXNzIGljb24gaWNvbi1mb2xkIGlubGluZS1ibG9jay10aWdodCcsXG4gICAgICAgICAgICAgICAgdG9nZ2xlQnRuVHh0OiAnQ29sbGFwc2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUJ0blN0eWxlOiAnYnRuIGljb24gaWNvbi11bmZvbGQgaW5saW5lLWJsb2NrLXRpZ2h0JyxcbiAgICAgICAgICAgICAgICB0b2dnbGVCdG5UeHQ6ICdFeHBhbmQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgZXZlbnQgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IHsgaXNPcGVuZWQsIHRvZ2dsZUJ0blN0eWxlLCB0b2dnbGVCdG5UeHQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJldmVudC1saXN0LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJsYWJlbCBldmVudC1jb2xsYXBzZS1sYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJwYWRkZWQgdGV4dC13YXJuaW5nXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7ZXZlbnQuaWR9IDoge2V2ZW50LmV2ZW50fVxuICAgICAgICAgICAgICAgICAgICA8L2g0PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPXt0b2dnbGVCdG5TdHlsZX0gb25DbGljaz17dGhpcy5fdG9nZ2xlQ29sbGFwc2V9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3RvZ2dsZUJ0blR4dH1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8Q29sbGFwc2UgaXNPcGVuZWQ9e2lzT3BlbmVkfT5cbiAgICAgICAgICAgICAgICAgICAgPFJlYWN0SnNvblxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtldmVudH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lPVwiY2hhbGtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheURhdGFUeXBlcz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlU3RyaW5nc0FmdGVyTGVuZ3RoPXs2NH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGljb25TdHlsZT1cInRyaWFuZ2xlXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50SXRlbTtcbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgRXZlbnRJdGVtIGZyb20gJy4uL0V2ZW50SXRlbSdcblxuY2xhc3MgRXZlbnRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBldmVudHMgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGNvbnN0IGV2ZW50c18gPSBldmVudHMuc2xpY2UoKTtcbiAgICAgICAgZXZlbnRzXy5yZXZlcnNlKCk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZlbnRzLWNvbnRhaW5lciBzZWxlY3QtbGlzdFwiPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzXy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudHNfLm1hcCgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RXZlbnRJdGVtIGV2ZW50PXtldmVudH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAhKGV2ZW50c18ubGVuZ3RoID4gMCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cInRleHQtd2FybmluZyBuby1oZWFkZXJcIj5ObyBldmVudHMgZm91bmQhPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBldmVudFJlZHVjZXIgfSkgPT4ge1xuXHRjb25zdCB7IGV2ZW50cyB9ID0gZXZlbnRSZWR1Y2VyO1xuXHRyZXR1cm4geyBldmVudHMgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHt9KShFdmVudHMpO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcbmltcG9ydCB7IFNFVF9BQ0NPVU5UUyB9IGZyb20gJy4uLy4uL2FjdGlvbnMvdHlwZXMnXG5pbXBvcnQgeyBzZXRBY2NvdW50cywgc2V0U3luY1N0YXR1cywgc2V0TWluaW5nLCBzZXRIYXNocmF0ZSB9IGZyb20gJy4uLy4uL2FjdGlvbnMnXG5cbmNsYXNzIE5vZGVDb250cm9sIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuaGVscGVycyA9IHByb3BzLmhlbHBlcnM7XG4gICAgICAgIHRoaXMuX3JlZnJlc2hTeW5jID0gdGhpcy5fcmVmcmVzaFN5bmMuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5nZXROb2RlSW5mbyA9IHRoaXMuZ2V0Tm9kZUluZm8uYmluZCh0aGlzKTtcbiAgICB9XG4gICAgYXN5bmMgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMuZ2V0Tm9kZUluZm8oKTtcbiAgICB9XG4gICAgYXN5bmMgX3JlZnJlc2hTeW5jKCkge1xuICAgICAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IHRoaXMuaGVscGVycy5nZXRBY2NvdW50cygpO1xuICAgICAgICB0aGlzLnByb3BzLnNldEFjY291bnRzKHsgYWNjb3VudHMgfSk7XG4gICAgICAgIHRoaXMuZ2V0Tm9kZUluZm8oKTtcbiAgICB9XG4gICAgYXN5bmMgZ2V0Tm9kZUluZm8oKSB7XG4gICAgICAgIC8vIGdldCBzeW5jIHN0YXR1c1xuICAgICAgICBjb25zdCBzeW5jU3RhdCA9IGF3YWl0IHRoaXMuaGVscGVycy5nZXRTeW5jU3RhdCgpO1xuICAgICAgICB0aGlzLnByb3BzLnNldFN5bmNTdGF0dXMoc3luY1N0YXQpO1xuICAgICAgICAvLyBnZXQgbWluaW5nIHN0YXR1c1xuICAgICAgICBjb25zdCBtaW5pbmcgPSBhd2FpdCB0aGlzLmhlbHBlcnMuZ2V0TWluaW5nKCk7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0TWluaW5nKG1pbmluZyk7XG4gICAgICAgIC8vIGdldCBoYXNocmF0ZVxuICAgICAgICBjb25zdCBoYXNoUmF0ZSA9IGF3YWl0IHRoaXMuaGVscGVycy5nZXRIYXNocmF0ZSgpO1xuICAgICAgICB0aGlzLnByb3BzLnNldEhhc2hyYXRlKGhhc2hSYXRlKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGNvaW5iYXNlLCBzdGF0dXMsIHN5bmNpbmcsIG1pbmluZywgaGFzaFJhdGUgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJOb2RlQ29udHJvbFwiPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz0nbGlzdC1ncm91cCc+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz0nbGlzdC1pdGVtJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0Jz5Db2luYmFzZTo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0naW5saW5lLWJsb2NrJz57IGNvaW5iYXNlIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIChPYmplY3Qua2V5cyhzdGF0dXMpLmxlbmd0aCA+IDAgJiYgc3RhdHVzIGluc3RhbmNlb2YgT2JqZWN0KSAmJlxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9J2xpc3QtaXRlbSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayBoaWdobGlnaHQnPlN5bmMgcHJvZ3Jlc3M6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwcm9ncmVzcyBjbGFzcz0naW5saW5lLWJsb2NrJyBtYXg9JzEwMCcgdmFsdWU9eyAoMTAwICogKHN0YXR1cy5jdXJyZW50QmxvY2svc3RhdHVzLmhpZ2hlc3RCbG9jaykpLnRvRml4ZWQoMikgfT48L3Byb2dyZXNzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdpbmxpbmUtYmxvY2snPnsgKDEwMCAqIChzdGF0dXMuY3VycmVudEJsb2NrL3N0YXR1cy5oaWdoZXN0QmxvY2spKS50b0ZpeGVkKDIpIH0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz0nbGlzdC1pdGVtJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0naW5saW5lLWJsb2NrIGhpZ2hsaWdodCc+Q3VycmVudCBCbG9jazo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayc+eyBzdGF0dXMuY3VycmVudEJsb2NrIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPSdsaXN0LWl0ZW0nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0Jz5IaWdoZXN0IEJsb2NrOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0naW5saW5lLWJsb2NrJz57IHN0YXR1cy5oaWdoZXN0QmxvY2sgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9J2xpc3QtaXRlbSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayBoaWdobGlnaHQnPktub3duIFN0YXRlczo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayc+eyBzdGF0dXMua25vd25TdGF0ZXMgfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9J2xpc3QtaXRlbSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayBoaWdobGlnaHQnPlB1bGxlZCBTdGF0ZXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayc+eyBzdGF0dXMucHVsbGVkU3RhdGVzIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPSdsaXN0LWl0ZW0nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0Jz5TdGFydGluZyBCbG9jazo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayc+eyBzdGF0dXMuc3RhcnRpbmdCbG9jayB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAhc3luY2luZyAmJlxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9J2xpc3QtaXRlbSc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayBoaWdobGlnaHQnPlN5bmNpbmc6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdpbmxpbmUtYmxvY2snPnsgYCR7c3luY2luZ31gIH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz0nbGlzdC1pdGVtJz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0Jz5NaW5pbmc6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayc+eyBgJHttaW5pbmd9YCB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9J2xpc3QtaXRlbSc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0naW5saW5lLWJsb2NrIGhpZ2hsaWdodCc+SGFzaHJhdGU6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2lubGluZS1ibG9jayc+eyBoYXNoUmF0ZSB9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiIG9uQ2xpY2s9e3RoaXMuX3JlZnJlc2hTeW5jfT5SZWZyZXNoPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59O1xuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBhY2NvdW50LCBub2RlIH0pID0+IHtcbiAgICBjb25zdCB7IGNvaW5iYXNlIH0gPSBhY2NvdW50O1xuICAgIGNvbnN0IHsgc3RhdHVzLCBzeW5jaW5nLCBtaW5pbmcsIGhhc2hSYXRlIH0gPSBub2RlO1xuICAgIHJldHVybiB7IGNvaW5iYXNlLCBzdGF0dXMsIHN5bmNpbmcsIG1pbmluZywgaGFzaFJhdGUgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHsgc2V0QWNjb3VudHMsIHNldFN5bmNTdGF0dXMsIHNldE1pbmluZywgc2V0SGFzaHJhdGUgfSkoTm9kZUNvbnRyb2wpO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcbmltcG9ydCB7IENvbGxhcHNlIH0gZnJvbSAncmVhY3QtY29sbGFwc2UnXG5pbXBvcnQgUmVhY3RKc29uIGZyb20gJ3JlYWN0LWpzb24tdmlldydcbmltcG9ydCBWaXJ0dWFsTGlzdCBmcm9tICdyZWFjdC10aW55LXZpcnR1YWwtbGlzdCdcbmltcG9ydCB7IENvZGVBbmFseXNpcyB9IGZyb20gJ3JlbWl4LXNvbGlkaXR5J1xuaW1wb3J0IENoZWNrYm94VHJlZSBmcm9tICdyZWFjdC1jaGVja2JveC10cmVlJ1xuXG5jbGFzcyBTdGF0aWNBbmFseXNpcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmhlbHBlcnMgPSBwcm9wcy5oZWxwZXJzO1xuICAgICAgICB0aGlzLmFubHNSdW5uZXIgPSBuZXcgQ29kZUFuYWx5c2lzKCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBhbmxzTW9kdWxlczogdGhpcy5hbmxzUnVubmVyLm1vZHVsZXMoKSxcbiAgICAgICAgICAgIG5vZGVzOiB0aGlzLl9nZXROb2Rlcyh0aGlzLmFubHNSdW5uZXIubW9kdWxlcygpKSxcbiAgICAgICAgICAgIGNoZWNrZWQ6IFtdLFxuICAgICAgICAgICAgYW5hbHlzaXM6IFtdXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcnVuQW5hbHlzaXMgPSB0aGlzLl9ydW5BbmFseXNpcy5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgLy8gTWFyayBhbGwgbW9kdWxlcyBjaGVja2VkIGluIHRoZSBiZWdpbmluZ1xuICAgICAgICBjb25zdCB7IG5vZGVzIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICBjb25zdCBjaGVja2VkID0gW107XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY2hlY2tlZC5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjaGVja2VkIH0pO1xuICAgIH1cbiAgICBfZ2V0Tm9kZXMobW9kdWxlcykge1xuICAgICAgICByZXR1cm4gbW9kdWxlcy5tYXAoKG1vZHVsZSwgaSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHt9LCB7IHZhbHVlOiBpLCBsYWJlbDogbW9kdWxlLmRlc2NyaXB0aW9uLCBpbmRleDogaSB9KTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgYXN5bmMgX3J1bkFuYWx5c2lzKCkge1xuICAgICAgICBjb25zdCB7IGNoZWNrZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGNvbnN0IHsgY29tcGlsZWQgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGlmKGNvbXBpbGVkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYW5hbHlzaXMgPSBhd2FpdCB0aGlzLmdldEFuYWx5c2lzKGNvbXBpbGVkLCBjaGVja2VkKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhbmFseXNpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFuYWx5c2lzIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZ2V0QW5hbHlzaXMoY29tcGlsZWQsIGNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYW5sc1J1bm5lci5ydW4oY29tcGlsZWQsIGNoZWNrZWQsIChhbmFseXNpcywgZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUoYW5hbHlzaXMpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IG5vZGVzLCBjaGVja2VkLCBhbmFseXNpcyB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0aWMtYW5hbHl6ZXJcIj5cbiAgICAgICAgICAgICAgICA8Q2hlY2tib3hUcmVlXG4gICAgICAgICAgICAgICAgICAgIG5vZGVzPXtub2Rlc31cbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5zdGF0ZS5jaGVja2VkfVxuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZD17dGhpcy5zdGF0ZS5leHBhbmRlZH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGVjaz17Y2hlY2tlZCA9PiB0aGlzLnNldFN0YXRlKHsgY2hlY2tlZCB9KX1cbiAgICAgICAgICAgICAgICAgICAgc2hvd05vZGVJY29uPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgaW5saW5lLWJsb2NrLXRpZ2h0XCIgb25DbGljaz17dGhpcy5fcnVuQW5hbHlzaXN9PlxuICAgICAgICAgICAgICAgICAgICBSdW4gYW5hbHlzaXNcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGFuYWx5c2lzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgYW5hbHlzaXMubWFwKGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYS5yZXBvcnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWRkZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhLnJlcG9ydC5tYXAoKHJlcG9ydCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0LmxvY2F0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1pbmZvXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cmVwb3J0LmxvY2F0aW9ufXsnICd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBvcnQud2FybmluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQtd2FybmluZ1wiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogcmVwb3J0Lndhcm5pbmcgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBvcnQubW9yZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwidGV4dC1pbmZvXCIgaHJlZj17cmVwb3J0Lm1vcmV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyZXBvcnQubW9yZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGNvbnRyYWN0IH0pID0+IHtcbiAgICBjb25zdCB7IGNvbXBpbGVkIH0gPSBjb250cmFjdDtcblx0cmV0dXJuIHsgY29tcGlsZWQgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHt9KShTdGF0aWNBbmFseXNpcyk7XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgVGFiLCBUYWJzLCBUYWJMaXN0LCBUYWJQYW5lbCB9IGZyb20gJ3JlYWN0LXRhYnMnXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgQ29udHJhY3RzIGZyb20gJy4uL0NvbnRyYWN0cydcbmltcG9ydCBUeEFuYWx5emVyIGZyb20gJy4uL1R4QW5hbHl6ZXInXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cydcbmltcG9ydCBOb2RlQ29udHJvbCBmcm9tICcuLi9Ob2RlQ29udHJvbCdcbmltcG9ydCBTdGF0aWNBbmFseXNpcyBmcm9tICcuLi9TdGF0aWNBbmFseXNpcydcblxuY2xhc3MgVGFiVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmhlbHBlcnMgPSBwcm9wcy5oZWxwZXJzO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgdHhCdG5TdHlsZTogJ2J0bicsXG4gICAgICAgICAgICBldmVudEJ0blN0eWxlOiAnYnRuJyxcbiAgICAgICAgICAgIG5ld1R4Q291bnRlcjogMCxcbiAgICAgICAgICAgIG5ld0V2ZW50Q291bnRlcjogMFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hhbmRsZVRhYlNlbGVjdCA9IHRoaXMuX2hhbmRsZVRhYlNlbGVjdC5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBfaGFuZGxlVGFiU2VsZWN0KGluZGV4KSB7XG4gICAgICAgIGlmKGluZGV4ID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmV3VHhDb3VudGVyOiAwLCB0eEJ0blN0eWxlOiAnYnRuJyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZihpbmRleCA9PT0gMykge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5ld0V2ZW50Q291bnRlcjogMCwgZXZlbnRCdG5TdHlsZTogJ2J0bicgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgY29uc3QgeyBuZXdUeENvdW50ZXIsIG5ld0V2ZW50Q291bnRlciB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgaWYodGhpcy5wcm9wcy5wZW5kaW5nVHJhbnNhY3Rpb25zICE9PSBuZXh0UHJvcHMucGVuZGluZ1RyYW5zYWN0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5ld1R4Q291bnRlcjogbmV3VHhDb3VudGVyKzEsIHR4QnRuU3R5bGU6ICdidG4gYnRuLWVycm9yJyB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLnByb3BzLmV2ZW50cyAhPT0gbmV4dFByb3BzLmV2ZW50cyAmJiBuZXh0UHJvcHMuZXZlbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBuZXdFdmVudENvdW50ZXI6IG5ld0V2ZW50Q291bnRlcisxLCBldmVudEJ0blN0eWxlOiAnYnRuIGJ0bi1lcnJvcicgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7IGV2ZW50QnRuU3R5bGUsIHR4QnRuU3R5bGUsIG5ld1R4Q291bnRlciwgbmV3RXZlbnRDb3VudGVyICB9ID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFRhYnMgb25TZWxlY3Q9e2luZGV4ID0+IHRoaXMuX2hhbmRsZVRhYlNlbGVjdChpbmRleCl9IGNsYXNzTmFtZT1cInJlYWN0LXRhYnMgdmVydGljYWwtdGFic1wiPlxuICAgICAgICAgICAgICAgIDxUYWJMaXN0IGNsYXNzTmFtZT1cInJlYWN0LXRhYnNfX3RhYi1saXN0IHZlcnRpY2FsIHRhYmxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYl9idG5zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG5cIj5Db250cmFjdDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG5cIj5BbmFseXNpczwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9e3R4QnRuU3R5bGV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmFuc2FjdGlvbiBhbmFseXplclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdUeENvdW50ZXIgPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nYmFkZ2UgYmFkZ2Utc21hbGwgYmFkZ2UtZXJyb3Igbm90aWZ5LWJhZGdlJz57bmV3VHhDb3VudGVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9e2V2ZW50QnRuU3R5bGV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFdmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnRDb3VudGVyID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2JhZGdlIGJhZGdlLXNtYWxsIGJhZGdlLWVycm9yIG5vdGlmeS1iYWRnZSc+e25ld0V2ZW50Q291bnRlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvVGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRhYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuXCI+Tm9kZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9UYWI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VGFiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4gYnRuLXdhcm5pbmdcIj5IZWxwPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1RhYj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9UYWJMaXN0PlxuXG4gICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICA8Q29udHJhY3RzIHN0b3JlPXt0aGlzLnByb3BzLnN0b3JlfSBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9IC8+XG4gICAgICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgICAgIDxTdGF0aWNBbmFseXNpcyBzdG9yZT17dGhpcy5wcm9wcy5zdG9yZX0gaGVscGVycz17dGhpcy5oZWxwZXJzfSAvPlxuICAgICAgICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICA8VHhBbmFseXplciBzdG9yZT17dGhpcy5wcm9wcy5zdG9yZX0gaGVscGVycz17dGhpcy5oZWxwZXJzfSAvPlxuICAgICAgICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICA8RXZlbnRzIHN0b3JlPXt0aGlzLnByb3BzLnN0b3JlfSBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9IC8+XG4gICAgICAgICAgICAgICAgPC9UYWJQYW5lbD5cbiAgICAgICAgICAgICAgICA8VGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgICAgIDxOb2RlQ29udHJvbCBzdG9yZT17dGhpcy5wcm9wcy5zdG9yZX0gaGVscGVycz17dGhpcy5oZWxwZXJzfSAvPlxuICAgICAgICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgICAgICAgPFRhYlBhbmVsPlxuICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LXdhcm5pbmdcIj5IZWxwIEV0aGVyYXRvbSB0byBrZWVwIHNvbGlkaXR5IGRldmVsb3BtZW50IGludGVyYWN0aXZlLjwvaDI+XG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPkRvbmF0ZSBFdGhlcmV1bTogMHhkMjJmRTRhRUZlZDBBOTg0QjExNjVkYzI0MDk1NzI4RUU3MDA1YTM2PC9oND5cbiAgICAgICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5FdGhlcmF0b20gbmV3cyA8L3NwYW4+PGEgaHJlZj1cImh0dHBzOi8vdHdpdHRlci5jb20vaGFzaHRhZy9FdGhlcmF0b21cIj4jRXRoZXJhdG9tPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ29udGFjdDogPGEgaHJlZj1cIm1haWx0bzowbWthckBwcm90b25tYWlsLmNvbVwiIHRhcmdldD1cIl90b3BcIj4wbWthckBwcm90b25tYWlsLmNvbTwvYT5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvVGFiUGFuZWw+XG4gICAgICAgICAgICA8L1RhYnM+XG4gICAgICAgICk7XG4gICAgfVxufVxuXG5jb25zdCBtYXBTdGF0ZVRvUHJvcHMgPSAoeyBjb250cmFjdCwgZXZlbnRSZWR1Y2VyIH0pID0+IHtcblx0Y29uc3QgeyBjb21waWxlZCB9ID0gY29udHJhY3Q7XG4gICAgY29uc3QgeyBwZW5kaW5nVHJhbnNhY3Rpb25zLCBldmVudHMgfSA9IGV2ZW50UmVkdWNlcjtcblx0cmV0dXJuIHsgY29tcGlsZWQsIHBlbmRpbmdUcmFuc2FjdGlvbnMsIGV2ZW50cyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywge30pKFRhYlZpZXcpO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCdcbmltcG9ydCB7IHNldENvaW5iYXNlLCBzZXRQYXNzd29yZCB9IGZyb20gJy4uLy4uL2FjdGlvbnMnXG5cbmNsYXNzIENvaW5iYXNlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICB0aGlzLmhlbHBlcnMgPSBwcm9wcy5oZWxwZXJzO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgY29pbmJhc2U6IHByb3BzLmFjY291bnRzWzBdLFxuICAgICAgICAgICAgYmFsYW5jZTogMC4wMCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiAnJyxcbiAgICAgICAgICAgIHVubG9ja19zdHlsZTogJ3VubG9jay1kZWZhdWx0J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9oYW5kbGVBY2NDaGFuZ2UgPSB0aGlzLl9oYW5kbGVBY2NDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5faGFuZGxlUGFzc3dvcmRDaGFuZ2UgPSB0aGlzLl9oYW5kbGVQYXNzd29yZENoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9oYW5kbGVVbmxvY2sgPSB0aGlzLl9oYW5kbGVVbmxvY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fbGlua0NsaWNrID0gdGhpcy5fbGlua0NsaWNrLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIGFzeW5jIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBjb25zdCB7IGNvaW5iYXNlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICBjb25zdCBiYWxhbmNlID0gYXdhaXQgdGhpcy5oZWxwZXJzLmdldEJhbGFuY2UoY29pbmJhc2UpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYmFsYW5jZSB9KTtcbiAgICB9XG4gICAgX2xpbmtDbGljayhldmVudCkge1xuICAgICAgICBjb25zdCB7IGNvaW5iYXNlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICBhdG9tLmNsaXBib2FyZC53cml0ZShjb2luYmFzZSk7XG4gICAgfVxuICAgIGFzeW5jIF9oYW5kbGVBY2NDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgY29pbmJhc2UgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIGNvbnN0IGJhbGFuY2UgPSBhd2FpdCB0aGlzLmhlbHBlcnMuZ2V0QmFsYW5jZShjb2luYmFzZSk7XG4gICAgICAgIHRoaXMucHJvcHMuc2V0Q29pbmJhc2UoY29pbmJhc2UpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgY29pbmJhc2UsIGJhbGFuY2UgfSk7XG4gICAgfVxuICAgIF9oYW5kbGVQYXNzd29yZENoYW5nZShldmVudCkge1xuICAgICAgICBjb25zdCBwYXNzd29yZCA9IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGFzc3dvcmQgfSk7XG4gICAgICAgIC8vIFRPRE86IHVubGVzcyB3ZSBzaG93IHNvbWUgaW5kaWNhdG9yIG9uIGBVbmxvY2tgIGxldCBwYXNzd29yZCBzZXQgb24gY2hhbmdlXG4gICAgICAgIGlmICghKChwYXNzd29yZC5sZW5ndGggLSAxKSA+IDApKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdW5sb2NrX3N0eWxlOiAndW5sb2NrLWRlZmF1bHQnIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9oYW5kbGVVbmxvY2soZXZlbnQpIHtcbiAgICAgICAgLy8gVE9ETzogaGVyZSB0cnkgdG8gdW5sb2NrIGdldGggYmFja2VuZCBub2RlIHVzaW5nIGNvaW5iYXNlIGFuZCBwYXNzd29yZCBhbmQgc2hvdyByZXN1bHRcbiAgICAgICAgY29uc3QgeyBwYXNzd29yZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgaWYgKHBhc3N3b3JkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0UGFzc3dvcmQoeyBwYXNzd29yZCB9KTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB1bmxvY2tfc3R5bGU6ICd1bmxvY2stYWN0aXZlJyB9KTtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY29pbmJhc2UsIGJhbGFuY2UsIHBhc3N3b3JkIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICBjb25zdCB7IGFjY291bnRzIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpY29uIGljb24tbGluayBidG4gY29weS1idG4gYnRuLXN1Y2Nlc3NcIiBvbkNsaWNrPXt0aGlzLl9saW5rQ2xpY2t9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IG9uQ2hhbmdlPXt0aGlzLl9oYW5kbGVBY2NDaGFuZ2V9IHZhbHVlPXt0aGlzLnN0YXRlLmNvaW5iYXNlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2NvdW50cy5tYXAoKGFjY291bnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2FjY291bnR9PnthY2NvdW50fTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+e2JhbGFuY2V9IEVUSDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxmb3JtIGNsYXNzPVwicm93XCIgb25TdWJtaXQ9e3RoaXMuX2hhbmRsZVVubG9ja30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpY29uIGljb24tbG9ja1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX2hhbmRsZVBhc3N3b3JkQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9e3RoaXMuc3RhdGUudW5sb2NrX3N0eWxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9XCJVbmxvY2tcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn07XG5cbmNvbnN0IG1hcFN0YXRlVG9Qcm9wcyA9ICh7IGFjY291bnQgfSkgPT4ge1xuXHRjb25zdCB7IGNvaW5iYXNlLCBwYXNzd29yZCwgYWNjb3VudHMgfSA9IGFjY291bnQ7XG5cdHJldHVybiB7IGNvaW5iYXNlLCBwYXNzd29yZCwgYWNjb3VudHMgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMsIHsgc2V0Q29pbmJhc2UsIHNldFBhc3N3b3JkIH0pKENvaW5iYXNlVmlldyk7XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xuXG5jbGFzcyBDb21waWxlQnRuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuX2hhbmRsZVN1Ym1pdCA9IHRoaXMuX2hhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBhc3luYyBfaGFuZGxlU3VibWl0KCkge1xuICAgICAgICBjb25zdCB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2V0aC1pbnRlcmZhY2U6Y29tcGlsZScpO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY29tcGlsaW5nIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGZvcm0gY2xhc3M9XCJyb3dcIiBvblN1Ym1pdD17dGhpcy5faGFuZGxlU3VibWl0fT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBpbGluZyAmJlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiQ29tcGlsaW5nLi4uXCIgY2xhc3M9XCJidG4gY29weS1idG4gYnRuLXN1Y2Nlc3NcIiBkaXNhYmxlZCAvPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICFjb21waWxpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIkNvbXBpbGVcIiBjbGFzcz1cImJ0biBjb3B5LWJ0biBidG4tc3VjY2Vzc1wiIC8+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICApO1xuICAgIH1cbn1cblxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHsgY29udHJhY3QgfSkgPT4ge1xuXHRjb25zdCB7IGNvbXBpbGluZyB9ID0gY29udHJhY3Q7XG5cdHJldHVybiB7IGNvbXBpbGluZyB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KG1hcFN0YXRlVG9Qcm9wcywge30pKENvbXBpbGVCdG4pO1xuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgY3JlYXRlUmVhY3RDbGFzcyBmcm9tICdjcmVhdGUtcmVhY3QtY2xhc3MnXG5pbXBvcnQgUmVhY3RVcGRhdGUgZnJvbSAncmVhY3QtYWRkb25zLXVwZGF0ZSdcbmltcG9ydCBSZWFjdEpzb24gZnJvbSAncmVhY3QtanNvbi12aWV3J1xuaW1wb3J0IFdlYjNIZWxwZXJzIGZyb20gJy4vbWV0aG9kcydcbmltcG9ydCBDbGllbnRTZWxlY3RvciBmcm9tICcuLi9jb21wb25lbnRzL0NsaWVudFNlbGVjdG9yJ1xuaW1wb3J0IFRhYlZpZXcgZnJvbSAnLi4vY29tcG9uZW50cy9UYWJWaWV3J1xuaW1wb3J0IENvaW5iYXNlVmlldyBmcm9tICcuLi9jb21wb25lbnRzL0NvaW5iYXNlVmlldydcbmltcG9ydCBDb21waWxlQnRuIGZyb20gJy4uL2NvbXBvbmVudHMvQ29tcGlsZUJ0bidcbmltcG9ydCB7IFNFVF9BQ0NPVU5UUywgU0VUX0NPSU5CQVNFIH0gZnJvbSAnLi4vYWN0aW9ucy90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XG5cdGNvbnN0cnVjdG9yKHN0b3JlLCB3ZWIzKSB7XG5cdFx0dGhpcy5BY2NvdW50cyA9IFtdO1xuXHRcdHRoaXMuY29pbmJhc2UgPSBudWxsO1xuXHRcdHRoaXMud2ViMyA9IHdlYjM7XG5cdFx0dGhpcy5zdG9yZSA9IHN0b3JlO1xuXHRcdHRoaXMuaGVscGVycyA9IG5ldyBXZWIzSGVscGVycyh0aGlzLndlYjMpO1xuXHR9XG5cdGNyZWF0ZUNvbXBpbGVyT3B0aW9uc1ZpZXcoKSB7XG5cdFx0UmVhY3RET00ucmVuZGVyKDxDbGllbnRTZWxlY3RvciBzdG9yZT17dGhpcy5zdG9yZX0gLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGllbnQtb3B0aW9ucycpKTtcblx0fVxuXHRhc3luYyBjcmVhdGVDb2luYmFzZVZpZXcoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGFjY291bnRzID0gYXdhaXQgdGhpcy53ZWIzLmV0aC5nZXRBY2NvdW50cygpO1xuXHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9BQ0NPVU5UUywgcGF5bG9hZDogYWNjb3VudHMgfSk7XG5cdFx0XHR0aGlzLnN0b3JlLmRpc3BhdGNoKHsgdHlwZTogU0VUX0NPSU5CQVNFLCBwYXlsb2FkOiBhY2NvdW50c1swXSB9KTtcblx0XHRcdFJlYWN0RE9NLnJlbmRlcig8Q29pbmJhc2VWaWV3IHN0b3JlPXt0aGlzLnN0b3JlfSBoZWxwZXJzPXt0aGlzLmhlbHBlcnN9IC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWNjb3VudHMtbGlzdCcpKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdHRoaXMuaGVscGVycy5zaG93UGFuZWxFcnJvcihcIk5vIGFjY291bnQgZXhpc3RzISBQbGVhc2UgY3JlYXRlIG9uZS5cIik7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0fVxuXHRjcmVhdGVCdXR0b25zVmlldygpIHtcblx0XHRSZWFjdERPTS5yZW5kZXIoPENvbXBpbGVCdG4gc3RvcmU9e3RoaXMuc3RvcmV9IC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29tcGlsZV9idG4nKSk7XG5cdH1cblx0Y3JlYXRlVGFiVmlldygpIHtcblx0XHRSZWFjdERPTS5yZW5kZXIoPFRhYlZpZXcgc3RvcmU9e3RoaXMuc3RvcmV9IGhlbHBlcnM9e3RoaXMuaGVscGVyc30vPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYl92aWV3JykpO1xuXHR9XG5cdGNyZWF0ZVRleHRhcmVhUih0ZXh0KSB7XG5cdFx0dmFyIHRleHROb2RlO1xuXHRcdHRoaXMudGV4dCA9IHRleHQ7XG5cdFx0dGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKTtcblx0XHR0ZXh0Tm9kZS50ZXh0Q29udGVudCA9IHRoaXMudGV4dDtcblx0XHR0ZXh0Tm9kZS5jbGFzc0xpc3QuYWRkKCdsYXJnZS1jb2RlJyk7XG5cdFx0cmV0dXJuIHRleHROb2RlO1xuXHR9XG5cdGFzeW5jIGdldEFkZHJlc3NlcyhjYWxsYmFjaykge1xuXHRcdHJldHVybiB0aGlzLndlYjMuZXRoLmdldEFjY291bnRzKGZ1bmN0aW9uKGVyciwgYWNjb3VudHMpIHtcblx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKCdFcnJvciBubyBiYXNlIGFjY291bnQhJywgbnVsbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobnVsbCwgYWNjb3VudHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vLyB3ZWIzLmpzIHNob3VsZCBiZSB1c2UgdG8gaGFuZGxlIGFsbCB3ZWIzIGNvbXBpbGF0aW9uIGV2ZW50c1xuLy8gRXZlcnkgc29saWRpdHkgZmlsZSBjYW4gYmUgY29tcGlsZWQgaW4gdHdvIHdheXMganN2bSBhbmQgZXRoZXJldW0gZW5kcG9pbnRcbi8vIEFmdGVyIGV2ZXJ5IGNvbW1hbmQgaXMgaW52b2tlZCBjb21waWxhdGlvbiBlbmRwb2ludCBzaG91bGQgYmUgY2hvc2VuXG4vLyBJZiBKc1ZNIGlzIGNvbXBpbGF0aW9uIGVuZHBvaW50IFZNIHdpbGwgYmUgdXNlZCB0byBjb21waWxlIGFuZCBleGVjdXRlIHNvbGlkaXR5IHByb2dyYW1cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBXZWIzIGZyb20gJ3dlYjMnXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgV2ViM0hlbHBlcnMgZnJvbSAnLi9tZXRob2RzJ1xuaW1wb3J0IHsgY29tYmluZVNvdXJjZSB9IGZyb20gJy4uL2hlbHBlcnMvY29tcGlsZXItaW1wb3J0cydcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldydcbmltcG9ydCB7XG5cdFNFVF9DT01QSUxFRCxcblx0QUREX0lOVEVSRkFDRSxcblx0U0VUX0NPTVBJTElORyxcblx0U0VUX0VSUk9SUyxcblx0QUREX1BFTkRJTkdfVFJBTlNBQ1RJT04sXG5cdFNFVF9FVkVOVFMsXG5cdFNFVF9HQVNfTElNSVQsXG5cdFNFVF9TWU5DX1NUQVRVUyxcblx0U0VUX1NZTkNJTkdcbn0gZnJvbSAnLi4vYWN0aW9ucy90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViM0VudiB7XG5cdGNvbnN0cnVjdG9yKHN0b3JlKSB7XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHR0aGlzLndlYjNTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHR0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHR0aGlzLmNvbXBpbGVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHR0aGlzLnN0b3JlID0gc3RvcmU7XG5cdFx0dGhpcy5vYnNlcnZlQ29uZmlnKCk7XG5cdH1cblx0ZGlzcG9zZSgpIHtcblx0XHRpZih0aGlzLnN1YnNjcmlwdGlvbnMpIHtcblx0XHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblx0XHR9XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuXG5cdFx0aWYodGhpcy5zYXZlU3Vic2NyaXB0aW9ucykge1xuXHRcdFx0dGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblx0XHR9XG5cdFx0dGhpcy5zYXZlU3Vic2NyaXB0aW9ucyA9IG51bGxcblxuXHRcdGlmKHRoaXMud2ViM1N1YnNjcmlwdGlvbnMpIHtcblx0XHRcdHRoaXMud2ViM1N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cdFx0fVxuXHRcdHRoaXMud2ViM1N1YnNjcmlwdGlvbnMgPSBudWxsXG5cdH1cblx0ZGVzdHJveSgpIHtcblx0XHRpZih0aGlzLnNhdmVTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHR0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXHRcdH1cblx0XHR0aGlzLnNhdmVTdWJzY3JpcHRpb25zID0gbnVsbFxuXG5cdFx0aWYodGhpcy5jb21waWxlU3Vic2NyaXB0aW9ucykge1xuXHRcdFx0dGhpcy5jb21waWxlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblx0XHR9XG5cdFx0dGhpcy5jb21waWxlU3Vic2NyaXB0aW9ucyA9IG51bGxcblxuXHRcdGlmKHRoaXMud2ViM1N1YnNjcmlwdGlvbnMpIHtcblx0XHRcdHRoaXMud2ViM1N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cdFx0fVxuXHRcdHRoaXMud2ViM1N1YnNjcmlwdGlvbnMgPSBudWxsXG5cdH1cblx0b2JzZXJ2ZUNvbmZpZygpIHtcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2V0aGVyYXRvbS5leGVjdXRpb25FbnYnLCAoZXhlY3V0aW9uRW52KSA9PiB7XG5cdFx0XHRpZih0aGlzLndlYjNTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHRcdHRoaXMuZGVzdHJveSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdFx0XHRpZihleGVjdXRpb25FbnYgPT0gJ3dlYjMnKSB7XG5cdFx0XHRcdHRoaXMuc3Vic2NyaWJlVG9XZWIzQ29tbWFuZHMoKTtcblx0XHRcdFx0dGhpcy5zdWJzY3JpYmVUb1dlYjNFdmVudHMoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9KSk7XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnZXRoZXJhdG9tLmV4ZWN1dGlvbkVudicsIChlbnZDaGFuZ2UpID0+IHtcblx0XHRcdGlmKGVudkNoYW5nZS5uZXdWYWx1ZSAhPT0gJ3dlYjMnKSB7XG5cdFx0XHRcdHRoaXMuZGVzdHJveSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYoZW52Q2hhbmdlLm5ld1ZhbHVlID09ICd3ZWIzJykge1xuXHRcdFx0XHRpZih0aGlzLndlYjNTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHRcdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdFx0XHRcdHRoaXMuc3Vic2NyaWJlVG9XZWIzQ29tbWFuZHMoKTtcblx0XHRcdFx0dGhpcy5zdWJzY3JpYmVUb1dlYjNFdmVudHMoKTtcblx0XHRcdH1cblx0XHR9KSk7XG5cdH1cblxuXHQvLyBTdWJzY3JpcHRpb25zXG5cdHN1YnNjcmliZVRvV2ViM0NvbW1hbmRzKCkge1xuXHRcdGlmKCF0aGlzLndlYjNTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2V0aC1pbnRlcmZhY2U6Y29tcGlsZScsICgpID0+IHtcblx0XHRcdGlmKHRoaXMuY29tcGlsZVN1YnNjcmlwdGlvbnMpIHtcblx0XHRcdFx0dGhpcy5jb21waWxlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNvbXBpbGVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblx0XHRcdHRoaXMuc3Vic2NyaWJlVG9Db21waWxlRXZlbnRzKCk7XG5cdFx0fSkpO1xuXHR9XG5cdHN1YnNjcmliZVRvV2ViM0V2ZW50cygpIHtcblx0XHRpZighdGhpcy53ZWIzU3Vic2NyaXB0aW9ucykge1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdGNvbnN0IHJwY0FkZHJlc3MgPSBhdG9tLmNvbmZpZy5nZXQoJ2V0aGVyYXRvbS5ycGNBZGRyZXNzJyk7XG5cdFx0Y29uc3Qgd2Vic29ja2V0QWRkcmVzcyA9IGF0b20uY29uZmlnLmdldCgnZXRoZXJhdG9tLndlYnNvY2tldEFkZHJlc3MnKVxuXHRcdGlmKHR5cGVvZiB0aGlzLndlYjMgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR0aGlzLndlYjMgPSBuZXcgV2ViMyh0aGlzLndlYjMuY3VycmVudFByb3ZpZGVyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy53ZWIzID0gbmV3IFdlYjMoV2ViMy5naXZlblByb3ZpZGVyIHx8IG5ldyBXZWIzLnByb3ZpZGVycy5IdHRwUHJvdmlkZXIocnBjQWRkcmVzcykpO1xuXHRcdFx0aWYod2Vic29ja2V0QWRkcmVzcykge1xuXHRcdFx0XHR0aGlzLndlYjMuc2V0UHJvdmlkZXIobmV3IFdlYjMucHJvdmlkZXJzLldlYnNvY2tldFByb3ZpZGVyKHdlYnNvY2tldEFkZHJlc3MpKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuaGVscGVycyA9IG5ldyBXZWIzSGVscGVycyh0aGlzLndlYjMpO1xuXHRcdH1cblx0XHR0aGlzLnZpZXcgPSBuZXcgVmlldyh0aGlzLnN0b3JlLCB0aGlzLndlYjMpO1xuXHRcdGlmKE9iamVjdC5pcyh0aGlzLndlYjMuY3VycmVudFByb3ZpZGVyLmNvbnN0cnVjdG9yLCBXZWIzLnByb3ZpZGVycy5XZWJzb2NrZXRQcm92aWRlcikpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiJWMgUHJvdmlkZXIgaXMgd2Vic29ja2V0LiBDcmVhdGluZyBzdWJzY3JpcHRpb25zLi4uIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0XHQvLyBuZXdCbG9ja0hlYWRlcnMgc3Vic2NyaWJlclxuXHRcdFx0dGhpcy53ZWIzLmV0aC5zdWJzY3JpYmUoJ25ld0Jsb2NrSGVhZGVycycpXG5cdFx0XHRcdC5vbihcImRhdGFcIiwgKGJsb2NrcykgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiJWMgbmV3QmxvY2tIZWFkZXJzOmRhdGEgXCIsICdiYWNrZ3JvdW5kOiByZ2JhKDM2LCAxOTQsIDIwMywgMC4zKTsgY29sb3I6ICNFRjUyNUInKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhibG9ja3MpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ2Vycm9yJywgKGUpID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIiVjIG5ld0Jsb2NrSGVhZGVyczplcnJvciBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0Ly8gcGVuZGluZ1RyYW5zYWN0aW9ucyBzdWJzY3JpYmVyXG5cdFx0XHR0aGlzLndlYjMuZXRoLnN1YnNjcmliZSgncGVuZGluZ1RyYW5zYWN0aW9ucycpXG5cdFx0XHRcdC5vbihcImRhdGFcIiwgKHRyYW5zYWN0aW9uKSA9PiB7XG5cdFx0XHRcdFx0Lypjb25zb2xlLmxvZyhcIiVjIHBlbmRpbmdUcmFuc2FjdGlvbnM6ZGF0YSBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHRyYW5zYWN0aW9uKTsqL1xuXHRcdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBBRERfUEVORElOR19UUkFOU0FDVElPTiwgcGF5bG9hZDogdHJhbnNhY3Rpb24gfSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbignZXJyb3InLCAoZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiJWMgcGVuZGluZ1RyYW5zYWN0aW9uczplcnJvciBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0Ly8gc3luY2luZyBzdWJzY3JpcHRpb25cblx0XHRcdHRoaXMud2ViMy5ldGguc3Vic2NyaWJlKCdzeW5jaW5nJylcblx0XHRcdFx0Lm9uKFwiZGF0YVwiLCAoc3luYykgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiJWMgc3luY2luZzpkYXRhIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc3luYyk7XG5cdFx0XHRcdFx0aWYodHlwZW9mKHN5bmMpID09PSAnYm9vbGVhbicpIHtcblx0XHRcdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBTRVRfU1lOQ0lORywgcGF5bG9hZDogc3luYyB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYodHlwZW9mKHN5bmMpID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9TWU5DSU5HLCBwYXlsb2FkOiBzeW5jLnN5bmNpbmcgfSk7XG5cdFx0XHRcdFx0XHRjb25zdCBzdGF0dXMgPSB7XG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRCbG9jazogc3luYy5zdGF0dXMuQ3VycmVudEJsb2NrLFxuXHRcdFx0XHRcdFx0XHRoaWdoZXN0QmxvY2s6IHN5bmMuc3RhdHVzLkhpZ2hlc3RCbG9jayxcblx0XHRcdFx0XHRcdFx0a25vd25TdGF0ZXM6IHN5bmMuc3RhdHVzLktub3duU3RhdGVzLFxuXHRcdFx0XHRcdFx0XHRwdWxsZWRTdGF0ZXM6IHN5bmMuc3RhdHVzLlB1bGxlZFN0YXRlcyxcblx0XHRcdFx0XHRcdFx0c3RhcnRpbmdCbG9jazogc3luYy5zdGF0dXMuU3RhcnRpbmdCbG9ja1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9TWU5DX1NUQVRVUywgcGF5bG9hZDogc3RhdHVzIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdjaGFuZ2VkJywgKGlzU3luY2luZykgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiJWMgc3luY2luZzpjaGFuZ2VkIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coaXNTeW5jaW5nKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Lm9uKCdlcnJvcicsIChlKSA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCIlYyBzeW5jaW5nOmVycm9yIFwiLCAnYmFja2dyb3VuZDogcmdiYSgzNiwgMTk0LCAyMDMsIDAuMyk7IGNvbG9yOiAjRUY1MjVCJyk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZSk7XG5cdFx0XHRcdH0pXG5cdFx0fVxuXHRcdHRoaXMuY2hlY2tDb25uZWN0aW9uKChlcnJvciwgY29ubmVjdGlvbikgPT4ge1xuXHRcdFx0aWYoZXJyb3IpIHtcblx0XHRcdFx0dGhpcy5oZWxwZXJzLnNob3dQYW5lbEVycm9yKGVycm9yKTtcblx0XHRcdH0gZWxzZSBpZihjb25uZWN0aW9uKSB7XG5cdFx0XHRcdHRoaXMudmlldy5jcmVhdGVDb21waWxlck9wdGlvbnNWaWV3KCk7XG5cdFx0XHRcdHRoaXMudmlldy5jcmVhdGVDb2luYmFzZVZpZXcoKTtcblx0XHRcdFx0dGhpcy52aWV3LmNyZWF0ZUJ1dHRvbnNWaWV3KCk7XG5cdFx0XHRcdHRoaXMudmlldy5jcmVhdGVUYWJWaWV3KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcblx0XHRcdGlmKCFlZGl0b3IgfHwgIWVkaXRvci5nZXRCdWZmZXIoKSkge1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblxuXHRcdFx0dGhpcy53ZWIzU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnZXRoZXJhdG9tLmNvbXBpbGVPblNhdmUnLCAoY29tcGlsZU9uU2F2ZSkgPT4ge1xuXHRcdFx0XHRpZih0aGlzLnNhdmVTdWJzY3JpcHRpb25zKSB7XG5cdFx0XHRcdFx0dGhpcy5zYXZlU3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5zYXZlU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdFx0XHRcdGlmKGNvbXBpbGVPblNhdmUpIHtcblx0XHRcdFx0XHR0aGlzLnN1YnNjcmliZVRvU2F2ZUV2ZW50cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KSk7XG5cdFx0fSkpO1xuXHR9XG5cblx0Ly8gRXZlbnQgc3Vic2NyaXB0aW9uc1xuXHRzdWJzY3JpYmVUb1NhdmVFdmVudHMoKSB7XG5cdFx0aWYoIXRoaXMud2ViM1N1YnNjcmlwdGlvbnMpIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHR0aGlzLnNhdmVTdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuXHRcdFx0aWYoIWVkaXRvciB8fCAhZWRpdG9yLmdldEJ1ZmZlcigpKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBidWZmZXJTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXHRcdFx0YnVmZmVyU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoZmlsZVBhdGgpID0+IHtcblx0XHRcdFx0dGhpcy5jb21waWxlKGVkaXRvcilcblx0XHRcdH0pKVxuXHRcdFx0YnVmZmVyU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkRGVzdHJveSgoKSA9PiB7XG5cdFx0XHRcdGJ1ZmZlclN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cdFx0XHR9KSlcblx0XHRcdHRoaXMuc2F2ZVN1YnNjcmlwdGlvbnMuYWRkKGJ1ZmZlclN1YnNjcmlwdGlvbnMpXG5cdFx0fSkpO1xuXHR9XG5cdHN1YnNjcmliZVRvQ29tcGlsZUV2ZW50cygpIHtcblx0XHRpZighdGhpcy53ZWIzU3Vic2NyaXB0aW9ucykge1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdHRoaXMuY29tcGlsZVN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG5cdFx0XHRpZighZWRpdG9yIHx8ICFlZGl0b3IuZ2V0QnVmZmVyKCkpIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNvbXBpbGUoZWRpdG9yKTtcblx0XHR9KSk7XG5cdH1cblxuXHQvLyBjb21tb24gZnVuY3Rpb25zXG5cdGNoZWNrQ29ubmVjdGlvbihjYWxsYmFjaykge1xuXHRcdGxldCBoYXZlQ29ubjtcblx0XHRoYXZlQ29ubiA9IHRoaXMud2ViMy5jdXJyZW50UHJvdmlkZXI7XG5cdFx0aWYoIWhhdmVDb25uKSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soJ0Vycm9yIGNvdWxkIG5vdCBjb25uZWN0IHRvIGxvY2FsIGdldGggaW5zdGFuY2UhJywgbnVsbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBjYWxsYmFjayhudWxsLCB0cnVlKTtcblx0XHR9XG5cdH1cblx0YXN5bmMgY29tcGlsZShlZGl0b3IpIHtcblx0XHRjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG5cdFx0Y29uc3QgZmlsZW5hbWUgPSBmaWxlUGF0aC5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG5cblx0XHRpZihmaWxlUGF0aC5zcGxpdCgnLicpLnBvcCgpID09ICdzb2wnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiVjIENvbXBpbGluZyBjb250cmFjdC4uLiBcIiwgJ2JhY2tncm91bmQ6IHJnYmEoMzYsIDE5NCwgMjAzLCAwLjMpOyBjb2xvcjogI0VGNTI1QicpO1xuXHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9DT01QSUxJTkcsIHBheWxvYWQ6IHRydWUgfSk7XG5cdFx0XHRjb25zdCBkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuXHRcdFx0dmFyIHNvdXJjZXMgPSB7fTtcblx0XHRcdHNvdXJjZXNbZmlsZW5hbWVdID0geyBjb250ZW50OiBlZGl0b3IuZ2V0VGV4dCgpIH1cblx0XHRcdHNvdXJjZXMgPSBhd2FpdCBjb21iaW5lU291cmNlKGRpciwgc291cmNlcyk7XG5cdFx0XHRjb25zb2xlLmxvZyhzb3VyY2VzKTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdC8vIFJlc2V0IHJlZHV4IHN0b3JlXG5cdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBTRVRfQ09NUElMRUQsIHBheWxvYWQ6IG51bGwgfSk7XG5cdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBTRVRfRVJST1JTLCBwYXlsb2FkOiBbXSB9KTtcblx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9FVkVOVFMsIHBheWxvYWQ6IFtdIH0pO1xuXHRcdFx0XHRjb25zdCBjb21waWxlZCA9IGF3YWl0IHRoaXMuaGVscGVycy5jb21waWxlV2ViMyhzb3VyY2VzKTtcblx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9DT01QSUxFRCwgcGF5bG9hZDogY29tcGlsZWQgfSk7XG5cdFx0XHRcdGlmKGNvbXBpbGVkLmNvbnRyYWN0cykge1xuXHRcdFx0XHRcdGZvcihjb25zdCBbZmlsZU5hbWUsIGNvbnRyYWN0c10gb2YgT2JqZWN0LmVudHJpZXMoY29tcGlsZWQuY29udHJhY3RzKSkge1xuXHRcdFx0XHRcdFx0Zm9yKGNvbnN0IFtjb250cmFjdE5hbWUsIGNvbnRyYWN0XSBvZiBPYmplY3QuZW50cmllcyhjb250cmFjdHMpKSB7XG5cdFx0XHRcdFx0XHRcdC8vIEFkZCBpbnRlcmZhY2UgdG8gcmVkdXhcblx0XHRcdFx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IEFERF9JTlRFUkZBQ0UsIHBheWxvYWQ6IHsgY29udHJhY3ROYW1lLCBpbnRlcmZhY2U6IGNvbnRyYWN0LmFiaSB9IH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZihjb21waWxlZC5lcnJvcnMpIHtcblx0XHRcdFx0XHR0aGlzLnN0b3JlLmRpc3BhdGNoKHsgdHlwZTogU0VUX0VSUk9SUywgcGF5bG9hZDogY29tcGlsZWQuZXJyb3JzIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGdhc0xpbWl0ID0gYXdhaXQgdGhpcy5oZWxwZXJzLmdldEdhc0xpbWl0KCk7XG5cdFx0XHRcdHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBTRVRfR0FTX0xJTUlULCBwYXlsb2FkOiBnYXNMaW1pdCB9KTtcblx0XHRcdFx0dGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGU6IFNFVF9DT01QSUxJTkcsIHBheWxvYWQ6IGZhbHNlIH0pO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcblx0XHRcdFx0dGhpcy5oZWxwZXJzLnNob3dQYW5lbEVycm9yKGUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG59XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IHtcbiAgICBTRVRfQ09NUElMSU5HLFxuICAgIFNFVF9ERVBMT1lFRCxcbiAgICBTRVRfQ09NUElMRUQsXG4gICAgU0VUX0lOU1RBTkNFLFxuICAgIFNFVF9QQVJBTVMsXG4gICAgQUREX0lOVEVSRkFDRSxcbiAgICBTRVRfR0FTX0xJTUlUXG59IGZyb20gJy4uL2FjdGlvbnMvdHlwZXMnO1xuY29uc3QgSU5JVElBTF9TVEFURSA9IHtcbiAgY29tcGlsZWQ6IG51bGwsXG4gIGNvbXBpbGluZzogZmFsc2UsXG4gIGRlcGxveWVkOiBmYWxzZSxcbiAgaW50ZXJmYWNlczogbnVsbCxcbiAgaW5zdGFuY2VzOiBudWxsLFxuICBnYXNMaW1pdDogMFxufTtcbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSA9IElOSVRJQUxfU1RBVEUsIGFjdGlvbikgPT4ge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBTRVRfQ09NUElMSU5HOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGNvbXBpbGluZzogYWN0aW9uLnBheWxvYWQgfTtcbiAgICAgICAgY2FzZSBTRVRfREVQTE9ZRUQ6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgZGVwbG95ZWQ6IHsgLi4uc3RhdGUuZGVwbG95ZWQsIFthY3Rpb24ucGF5bG9hZC5jb250cmFjdE5hbWVdOiBhY3Rpb24ucGF5bG9hZC5kZXBsb3llZCB9IH07XG4gICAgICAgIGNhc2UgU0VUX0NPTVBJTEVEOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uSU5JVElBTF9TVEFURSwgY29tcGlsZWQ6IGFjdGlvbi5wYXlsb2FkIH07XG4gICAgICAgIGNhc2UgU0VUX0lOU1RBTkNFOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGluc3RhbmNlczogeyAuLi5zdGF0ZS5pbnN0YW5jZXMsIFthY3Rpb24ucGF5bG9hZC5jb250cmFjdE5hbWVdOiBhY3Rpb24ucGF5bG9hZC5pbnN0YW5jZSB9IH07XG4gICAgICAgIGNhc2UgU0VUX1BBUkFNUzpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBpbnRlcmZhY2VzOiB7IC4uLnN0YXRlLmludGVyZmFjZXMsIFthY3Rpb24ucGF5bG9hZC5jb250cmFjdE5hbWVdOiB7IGludGVyZmFjZTogYWN0aW9uLnBheWxvYWQuaW50ZXJmYWNlIH0gfSB9O1xuICAgICAgICBjYXNlIEFERF9JTlRFUkZBQ0U6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgaW50ZXJmYWNlczogeyAuLi5zdGF0ZS5pbnRlcmZhY2VzLCBbYWN0aW9uLnBheWxvYWQuY29udHJhY3ROYW1lXTogeyBpbnRlcmZhY2U6IGFjdGlvbi5wYXlsb2FkLmludGVyZmFjZSB9IH0gfTtcbiAgICAgICAgY2FzZSBTRVRfR0FTX0xJTUlUOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGdhc0xpbWl0OiBhY3Rpb24ucGF5bG9hZCB9O1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cbiIsIid1c2UgYmFiZWwnXG4vLyBDb3B5cmlnaHQgMjAxOCBFdGhlcmF0b20gQXV0aG9yc1xuLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgRXRoZXJhdG9tLlxuXG4vLyBFdGhlcmF0b20gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4vLyBFdGhlcmF0b20gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBFdGhlcmF0b20uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5pbXBvcnQgeyBTRVRfQ09JTkJBU0UsIFNFVF9QQVNTV09SRCwgU0VUX0FDQ09VTlRTIH0gZnJvbSAnLi4vYWN0aW9ucy90eXBlcyc7XG5jb25zdCBJTklUSUFMX1NUQVRFID0ge1xuICBjb2luYmFzZTogbnVsbCxcbiAgcGFzc3dvcmQ6IGZhbHNlLFxuICBhY2NvdW50czogW11cbn07XG5leHBvcnQgZGVmYXVsdCAoc3RhdGUgPSBJTklUSUFMX1NUQVRFLCBhY3Rpb24pID0+IHtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgU0VUX0NPSU5CQVNFOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGNvaW5iYXNlOiBhY3Rpb24ucGF5bG9hZCB9O1xuICAgICAgICBjYXNlIFNFVF9QQVNTV09SRDpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBwYXNzd29yZDogYWN0aW9uLnBheWxvYWQucGFzc3dvcmQgfTtcbiAgICAgICAgY2FzZSBTRVRfQUNDT1VOVFM6XG4gICAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgYWNjb3VudHM6IGFjdGlvbi5wYXlsb2FkIH07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCB7IFNFVF9FUlJPUlMgfSBmcm9tICcuLi9hY3Rpb25zL3R5cGVzJztcbmNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gIGVycm9ybXNnOiBbXSxcbn07XG5leHBvcnQgZGVmYXVsdCAoc3RhdGUgPSBJTklUSUFMX1NUQVRFLCBhY3Rpb24pID0+IHtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgU0VUX0VSUk9SUzpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBlcnJvcm1zZzogYWN0aW9uLnBheWxvYWQgfTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IHsgQUREX1BFTkRJTkdfVFJBTlNBQ1RJT04sIEFERF9FVkVOVFMsIFNFVF9FVkVOVFMgfSBmcm9tICcuLi9hY3Rpb25zL3R5cGVzJztcbmNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gIHBlbmRpbmdUcmFuc2FjdGlvbnM6IFtdLFxuICBldmVudHM6IFtdXG59O1xuZXhwb3J0IGRlZmF1bHQgKHN0YXRlID0gSU5JVElBTF9TVEFURSwgYWN0aW9uKSA9PiB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIEFERF9QRU5ESU5HX1RSQU5TQUNUSU9OOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHBlbmRpbmdUcmFuc2FjdGlvbnM6IFsuLi5zdGF0ZS5wZW5kaW5nVHJhbnNhY3Rpb25zLCBhY3Rpb24ucGF5bG9hZF0gfTtcbiAgICAgICAgY2FzZSBBRERfRVZFTlRTOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGV2ZW50czogWy4uLnN0YXRlLmV2ZW50cywgYWN0aW9uLnBheWxvYWRdIH07XG4gICAgICAgIGNhc2UgU0VUX0VWRU5UUzpcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBldmVudHM6IFtdIH07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gICAgY2xpZW50czogW1xuICAgICAgICAvKntcbiAgICAgICAgICAgIHByb3ZpZGVyOiAnc29sY2pzJyxcbiAgICAgICAgICAgIGRlc2M6ICdKYXZhc2NyaXB0IFZNJ1xuICAgICAgICB9LCovXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGVyOiAnd2ViMycsXG4gICAgICAgICAgICBkZXNjOiAnQmFja2VuZCBldGhlcmV1bSBub2RlJ1xuICAgICAgICB9XG4gICAgXVxufTtcbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSA9IElOSVRJQUxfU1RBVEUsIGFjdGlvbikgPT4ge1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG4iLCIndXNlIGJhYmVsJ1xuLy8gQ29weXJpZ2h0IDIwMTggRXRoZXJhdG9tIEF1dGhvcnNcbi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIEV0aGVyYXRvbS5cblxuLy8gRXRoZXJhdG9tIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuLy8gRXRoZXJhdG9tIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggRXRoZXJhdG9tLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuaW1wb3J0IHsgU0VUX1NZTkNfU1RBVFVTLCBTRVRfU1lOQ0lORywgU0VUX01JTklORywgU0VUX0hBU0hfUkFURSB9IGZyb20gJy4uL2FjdGlvbnMvdHlwZXMnO1xuY29uc3QgSU5JVElBTF9TVEFURSA9IHtcbiAgc3luY2luZzogZmFsc2UsXG4gIHN0YXR1czoge30sXG4gIG1pbmluZzogZmFsc2UsXG4gIGhhc2hSYXRlOiAwXG59O1xuZXhwb3J0IGRlZmF1bHQgKHN0YXRlID0gSU5JVElBTF9TVEFURSwgYWN0aW9uKSA9PiB7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIFNFVF9TWU5DSU5HOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHN5bmNpbmc6IGFjdGlvbi5wYXlsb2FkIH07XG4gICAgICAgIGNhc2UgU0VUX1NZTkNfU1RBVFVTOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHN0YXR1czogYWN0aW9uLnBheWxvYWQgfTtcbiAgICAgICAgY2FzZSBTRVRfTUlOSU5HOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIG1pbmluZzogYWN0aW9uLnBheWxvYWQgfTtcbiAgICAgICAgY2FzZSBTRVRfSEFTSF9SQVRFOlxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIGhhc2hSYXRlOiBhY3Rpb24ucGF5bG9hZCB9O1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cbiIsIid1c2UgYmFiZWwnXG5pbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCdcbmltcG9ydCBDb250cmFjdFJlZHVjZXIgZnJvbSAnLi9Db250cmFjdFJlZHVjZXInXG5pbXBvcnQgQWNjb3VudFJlZHVjZXIgZnJvbSAnLi9BY2NvdW50UmVkdWNlcidcbmltcG9ydCBFcnJvclJlZHVjZXIgZnJvbSAnLi9FcnJvclJlZHVjZXInXG5pbXBvcnQgRXZlbnRSZWR1Y2VyIGZyb20gJy4vRXZlbnRSZWR1Y2VyJ1xuaW1wb3J0IENsaWVudFJlZHVjZXIgZnJvbSAnLi9DbGllbnRSZWR1Y2VyJ1xuaW1wb3J0IE5vZGVSZWR1Y2VyIGZyb20gJy4vTm9kZVJlZHVjZXInXG7igIpcbmV4cG9ydCBkZWZhdWx0IGNvbWJpbmVSZWR1Y2Vycyh7XG4gICAgY29udHJhY3Q6IENvbnRyYWN0UmVkdWNlcixcbiAgICBhY2NvdW50OiBBY2NvdW50UmVkdWNlcixcbiAgICBlcnJvcnM6IEVycm9yUmVkdWNlcixcbiAgICBldmVudFJlZHVjZXI6IEV2ZW50UmVkdWNlcixcbiAgICBjbGllbnRSZWR1Y2VyOiBDbGllbnRSZWR1Y2VyLFxuICAgIG5vZGU6IE5vZGVSZWR1Y2VyXG59KTtcbiIsIid1c2UgYmFiZWwnXG5pbXBvcnQgZXRoZXJhdG9tUmVkdWNlcnMgZnJvbSAnLi4vcmVkdWNlcnMnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ3JlZHV4LWxvZ2dlcidcbmltcG9ydCBSZWR1eFRodW5rIGZyb20gJ3JlZHV4LXRodW5rJ1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSB9IGZyb20gJ3JlZHV4J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25maWd1cmVTdG9yZShpbml0aWFsU3RhdGUpIHtcbiAgICBjb25zdCBtaWRkbGVXYXJlcyA9IFtSZWR1eFRodW5rXTtcbiAgICBpZihhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgICAgIG1pZGRsZVdhcmVzLnB1c2gobG9nZ2VyKTtcbiAgICB9XG4gICAgY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcbiAgICAgICAgZXRoZXJhdG9tUmVkdWNlcnMsXG4gICAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgICAgYXBwbHlNaWRkbGV3YXJlKC4uLm1pZGRsZVdhcmVzKVxuICAgICk7XG4gICAgcmV0dXJuIHN0b3JlO1xufVxuIiwiJ3VzZSBiYWJlbCdcbi8vIENvcHlyaWdodCAyMDE4IEV0aGVyYXRvbSBBdXRob3JzXG4vLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBFdGhlcmF0b20uXG5cbi8vIEV0aGVyYXRvbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbi8vIEV0aGVyYXRvbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIEV0aGVyYXRvbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbmltcG9ydCBcImJhYmVsLXBvbHlmaWxsXCJcbmltcG9ydCB7IEF0b21Tb2xpZGl0eVZpZXcgfSBmcm9tICcuL2V0aGVyZXVtLWludGVyZmFjZS12aWV3J1xuaW1wb3J0IFdlYjNFbnYgZnJvbSAnLi93ZWIzL3dlYjMnXG5pbXBvcnQgY29uZmlndXJlU3RvcmUgZnJvbSAnLi9oZWxwZXJzL2NvbmZpZ3VyZVN0b3JlJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBjbGFzcyBFdGhlcmF0b20ge1xuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdFx0dGhpcy5hdG9tU29saWRpdHlWaWV3ID0gbmV3IEF0b21Tb2xpZGl0eVZpZXcoKTtcblx0XHR0aGlzLm1vZGFsUGFuZWwgPSBudWxsO1xuXHRcdHRoaXMubG9hZGVkID0gZmFsc2U7XG5cdFx0dGhpcy5zdG9yZSA9IGNvbmZpZ3VyZVN0b3JlKCk7XG5cdH1cblx0YWN0aXZhdGUoKSB7XG5cdFx0cmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdldGhlcmF0b20nLCB0cnVlKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdBbGwgZGVwZW5kZW5jaWVzIGluc3RhbGxlZCwgZ29vZCB0byBnbycpXG5cdFx0XHR9KVxuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuXHRcdFx0J2V0aC1pbnRlcmZhY2U6dG9nZ2xlJzogKChfdGhpcykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0X3RoaXMudG9nZ2xlVmlldygpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSkodGhpcyksXG5cdFx0XHQnZXRoLWludGVyZmFjZTphY3RpdmF0ZSc6ICgoX3RoaXMpID0+IHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdF90aGlzLnRvZ2dsZVZpZXcoKTtcblx0XHRcdFx0fTtcblx0XHRcdH0pKHRoaXMpXG5cdFx0fSkpO1xuXHRcdHRoaXMubW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZFJpZ2h0UGFuZWwoe1xuXHRcdFx0aXRlbTogdGhpcy5hdG9tU29saWRpdHlWaWV3LmdldEVsZW1lbnQoKSxcblx0XHRcdHZpc2libGU6IGZhbHNlXG5cdFx0fSk7XG5cdFx0Ly8gSW5pdGlhdGUgZW52XG5cdFx0dGhpcy5sb2FkKCk7XG5cdH1cblx0ZGVhY3RpdmF0ZSgpIHtcblx0XHR0aGlzLm1vZGFsUGFuZWwuZGVzdHJveSgpO1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cdFx0dGhpcy5hdG9tU29saWRpdHlWaWV3LmRlc3Ryb3koKTtcblx0fVxuXHRzZXJpYWxpemUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGF0b21Tb2xpZGl0eVZpZXdTdGF0ZTogdGhpcy5hdG9tU29saWRpdHlWaWV3LnNlcmlhbGl6ZSgpXG5cdFx0fTtcblx0fVxuXHRsb2FkKCkge1xuXHRcdC8vdGhpcy5sb2FkVk0oKTtcblx0XHR0aGlzLmxvYWRXZWIzKCk7XG5cdFx0dGhpcy5sb2FkZWQgPSB0cnVlO1xuXHR9XG5cdC8qbG9hZFZNKCkge1xuXHRcdGlmKHRoaXMudGVzdFZNKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50ZXN0Vk07XG5cdFx0fVxuXHRcdGNvbnN0IHsgVk1FbnYgfSA9IHJlcXVpcmUoJy4vdm0vdm0nKTtcblx0XHR0aGlzLnRlc3RWTSA9IG5ldyBWTUVudigpO1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy50ZXN0Vk0pO1xuXHRcdHJldHVybiB0aGlzLnRlc3RWTTtcblx0fSovXG5cdGxvYWRXZWIzKCkge1xuXHRcdGlmKHRoaXMuV2ViM0ludGVyZmFjZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuV2ViM0ludGVyZmFjZTtcblx0XHR9XG5cdFx0dGhpcy5XZWIzSW50ZXJmYWNlID0gbmV3IFdlYjNFbnYodGhpcy5zdG9yZSk7XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLldlYjNJbnRlcmZhY2UpO1xuXHRcdHJldHVybiB0aGlzLldlYjNJbnRlcmZhY2U7XG5cdH1cblx0dG9nZ2xlVmlldygpIHtcblx0XHRpZih0aGlzLm1vZGFsUGFuZWwuaXNWaXNpYmxlKCkpIHtcblx0XHRcdHJldHVybiB0aGlzLm1vZGFsUGFuZWwuaGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RhbFBhbmVsLnNob3coKTtcblx0XHR9XG5cdH1cbn1cbiIsIid1c2UgYmFiZWwnXG5pbXBvcnQgeyBFdGhlcmF0b20gfSBmcm9tICcuL2xpYi9ldGhlcmV1bS1pbnRlcmZhY2UnXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBFdGhlcmF0b20oe1xuICAgIGNvbmZpZzogYXRvbS5jb25maWcsXG4gICAgd29ya3NwYWNlOiBhdG9tLndvcmtzcGFjZVxufSlcbiJdLCJuYW1lcyI6WyJBdG9tU29saWRpdHlWaWV3IiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImF0dCIsInJlc2l6ZU5vZGUiLCJvbm1vdXNlZG93biIsImhhbmRsZU1vdXNlRG93biIsImJpbmQiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsIm1haW5Ob2RlIiwibWVzc2FnZSIsInRleHRDb250ZW50IiwiY29tcGlsZXJOb2RlIiwiY3JlYXRlQXR0cmlidXRlIiwidmFsdWUiLCJzZXRBdHRyaWJ1dGVOb2RlIiwiYWNjb3VudHNOb2RlIiwiYnV0dG9uTm9kZSIsImNvbXBpbGVCdXR0b24iLCJ0YWJOb2RlIiwiZXJyb3JOb2RlIiwiaGFuZGxlTW91c2VNb3ZlIiwiaGFuZGxlTW91c2VVcCIsImRpc3Bvc2UiLCJnZXRFbGVtZW50IiwiZGVzdHJveSIsImUiLCJzdWJzY3JpcHRpb25zIiwibW91c2VVcEhhbmRsZXIiLCJtb3VzZU1vdmVIYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwid2lkdGgiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJyaWdodCIsInBhZ2VYIiwidndpZHRoIiwid2luZG93IiwiaW5uZXJXaWR0aCIsInZ3Iiwic3R5bGUiLCJyZW1vdmUiLCJXZWIzSGVscGVycyIsIndlYjMiLCJzb3VyY2VzIiwiZW5hYmxlZCIsInJ1bnMiLCJsYW5ndWFnZSIsInNldHRpbmdzIiwiU29sYyIsImNvbXBpbGVTdGFuZGFyZFdyYXBwZXIiLCJKU09OIiwic3RyaW5naWZ5IiwiaW5wdXQiLCJwYXJzZSIsIm91dHB1dCIsImNvaW5iYXNlIiwiYnl0ZWNvZGUiLCJFcnJvciIsImVycm9yIiwiZXRoIiwiZGVmYXVsdEFjY291bnQiLCJlc3RpbWF0ZUdhcyIsImdhc0VzdGltYXRlIiwiZ2V0QmFsYW5jZSIsInV0aWxzIiwiZnJvbVdlaSIsIndlaUJhbGFuY2UiLCJldGhCYWxhbmNlIiwiaXNTeW5jaW5nIiwiYXJncyIsImxvZyIsInBhc3N3b3JkIiwiYWJpIiwiY29udHJhY3ROYW1lIiwiZ2FzU3VwcGx5IiwiZ2FzIiwicGVyc29uYWwiLCJ1bmxvY2tBY2NvdW50IiwiZ2V0R2FzUHJpY2UiLCJDb250cmFjdCIsImNvZGUiLCJ0b0hleCIsImdhc1ByaWNlIiwiY29udHJhY3QiLCJwYXJhbXMiLCJFdmVudEVtaXR0ZXIiLCJjb250cmFjdEluc3RhbmNlIiwiQ29udHJhY3RJbnN0YW5jZSIsIm1hcCIsInBhcmFtIiwidHlwZSIsImVuZHNXaXRoIiwic2VhcmNoIiwic3BsaXQiLCJkZXBsb3kiLCJzZW5kIiwib24iLCJlbWl0IiwidHJhbnNhY3Rpb25IYXNoIiwidHhSZWNlaXB0IiwiY29uZmlybWF0aW9uTnVtYmVyIiwidGhlbiIsImluc3RhbmNlIiwib3B0aW9ucyIsImFkZHJlc3MiLCJhYmlJdGVtIiwiaW5kZXhPZiIsIkJOIiwic2VuZFRyYW5zYWN0aW9uIiwicGF5YWJsZVZhbHVlIiwicmVzdWx0IiwiY29uc3RhbnQiLCJwYXlhYmxlIiwibGVuZ3RoIiwibWV0aG9kcyIsIm5hbWUiLCJmcm9tIiwiY2FsbCIsImNvbnRyYWN0RnVuY3Rpb24iLCJpbnB1dHMiLCJQcm9taXNlIiwiYWxsIiwiaW5wdXRFbGVtZW50cyIsInBhcmFtT2JqZWN0IiwidmFsIiwidHJpbSIsImVycl9tZXNzYWdlIiwibWVzc2FnZXMiLCJNZXNzYWdlUGFuZWxWaWV3IiwidGl0bGUiLCJhdHRhY2giLCJQbGFpbk1lc3NhZ2VWaWV3IiwiY2xhc3NOYW1lIiwiZGF0YSIsIk9iamVjdCIsInJhd01lc3NhZ2UiLCJ0eEhhc2giLCJnZXRUcmFuc2FjdGlvbiIsImdldFRyYW5zYWN0aW9uUmVjZWlwdCIsInRyYW5zYWN0aW9uIiwidHJhbnNhY3Rpb25SZWNpcHQiLCJnZXRCbG9jayIsImJsb2NrIiwiZ2FzTGltaXQiLCJnZXRBY2NvdW50cyIsImlzTWluaW5nIiwiZ2V0SGFzaHJhdGUiLCJmdWxscGF0aCIsInJlcG9QYXRoIiwicGF0aCIsImZpbGVuYW1lIiwiZmlsZVJvb3QiLCJheGlvcyIsInJlc3BvbnNlIiwiYnVmIiwiQnVmZmVyIiwiY29udGVudCIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwicmVzcCIsInRvU3RyaW5nIiwiaGFuZGxlR2l0aHViQ2FsbCIsInBhdGhTdHJpbmciLCJlbmNvZGluZyIsImZzIiwicmVhZEZpbGVTeW5jIiwicmVzb2x2ZSIsIm8iLCJoYW5kbGVMb2NhbEltcG9ydCIsIm1hdGNoIiwiZ2V0SGFuZGxlcnMiLCJzb3VyY2VQYXRoIiwiaGFuZGxlcnMiLCJoYW5kbGVyIiwiZXhlYyIsImhhbmRsZSIsInJlc29sdmVJbXBvcnRzIiwiaWxpbmUiLCJpciIsImtleXMiLCJmaWxlTmFtZSIsInNvdXJjZSIsInB1c2giLCJtYXRjaGVzIiwidmFsaWRVcmwiLCJpc1VyaSIsInVybCIsImZuIiwicmVwbGFjZSIsImNvbWJpbmVTb3VyY2UiLCJzdWJTb3JjZSIsImFzc2lnbiIsIkNsaWVudFNlbGVjdG9yIiwicHJvcHMiLCJzdGF0ZSIsImF0b20iLCJjb25maWciLCJnZXQiLCJfaGFuZGxlQ2hhbmdlIiwiZXZlbnQiLCJzZXQiLCJ0YXJnZXQiLCJzZXRTdGF0ZSIsInNlbGVjdGVkRW52IiwiY2xpZW50cyIsImNsaWVudCIsInByb3ZpZGVyIiwiZGVzYyIsIlJlYWN0IiwiQ29tcG9uZW50IiwibWFwU3RhdGVUb1Byb3BzIiwiY2xpZW50UmVkdWNlciIsImNvbm5lY3QiLCJHYXNJbnB1dCIsIm5leHRQcm9wcyIsIm9uQ2hhbmdlIiwiY29tcGlsZWQiLCJTRVRfQ09NUElMSU5HIiwiU0VUX0NPTVBJTEVEIiwiU0VUX1BBUkFNUyIsIkFERF9JTlRFUkZBQ0UiLCJTRVRfSU5TVEFOQ0UiLCJTRVRfREVQTE9ZRUQiLCJTRVRfR0FTX0xJTUlUIiwiU0VUX0NPSU5CQVNFIiwiU0VUX1BBU1NXT1JEIiwiU0VUX0FDQ09VTlRTIiwiU0VUX0VSUk9SUyIsIkFERF9QRU5ESU5HX1RSQU5TQUNUSU9OIiwiQUREX0VWRU5UUyIsIlNFVF9FVkVOVFMiLCJTRVRfU1lOQ19TVEFUVVMiLCJTRVRfU1lOQ0lORyIsIlNFVF9NSU5JTkciLCJTRVRfSEFTSF9SQVRFIiwic2V0UGFyYW1zSW5wdXQiLCJkaXNwYXRjaCIsInBheWxvYWQiLCJhZGRJbnRlcmZhY2UiLCJDb250cmFjdEFCSSIsImludGVyZmFjZSIsInNldEluc3RhbmNlIiwic2V0RGVwbG95ZWQiLCJkZXBsb3llZCIsInNldENvaW5iYXNlIiwic2V0UGFzc3dvcmQiLCJzZXRBY2NvdW50cyIsImFjY291bnRzIiwiYWRkTmV3RXZlbnRzIiwic2V0U3luY1N0YXR1cyIsInN0YXR1cyIsInNldE1pbmluZyIsIm1pbmluZyIsInNldEhhc2hyYXRlIiwiaGFzaHJhdGUiLCJJbnB1dHNGb3JtIiwiaSIsIm9uU3VibWl0IiwiQ3JlYXRlQnV0dG9uIiwiaGVscGVycyIsInVuZGVmaW5lZCIsIl9oYW5kbGVBdEFkZHJlc3NDaGFuZ2UiLCJfaGFuZGxlU3VibWl0IiwiYWJpT2JqIiwiY29uc3RydWN0b3JQYXJhbXMiLCJhdEFkZHJlc3MiLCJpbnRlcmZhY2VzIiwiY29udHJhY3RJbnRlcmZhY2UiLCJmaW5kIiwiaW50ZXJmYWNlSXRlbSIsImNvbnN0cnVjdG9yIiwiY3JlYXRlIiwic2hvd1BhbmVsRXJyb3IiLCJldmVudHMiLCJhbGxFdmVudHMiLCJmcm9tQmxvY2siLCJsb2dzIiwiY2hhbmdlZCIsImFjY291bnQiLCJDb250cmFjdENvbXBpbGVkIiwiX2hhbmRsZUdhc0NoYW5nZSIsIl9oYW5kbGVJbnB1dCIsImdldEdhc0VzdGltYXRlIiwiZXN0aW1hdGVkR2FzIiwiaW5kZXgiLCJGdW5jdGlvbkFCSSIsIl9oYW5kbGVQYXlhYmxlVmFsdWUiLCJfaGFuZGxlRmFsbGJhY2siLCJpbnN0YW5jZXMiLCJzaG93T3V0cHV0IiwibWV0aG9kSXRlbSIsImoiLCJDb250cmFjdEV4ZWN1dGlvbiIsIkVycm9yVmlldyIsImVycm9ybXNnIiwic2V2ZXJpdHkiLCJmb3JtYXR0ZWRNZXNzYWdlIiwibXNnIiwiZXJyb3JzIiwiQ29sbGFwc2VkRmlsZSIsIl90b2dnbGVDb2xsYXBzZSIsImlzT3BlbmVkIiwidG9nZ2xlQnRuU3R5bGUiLCJ0b2dnbGVCdG5UeHQiLCJjb21waWxpbmciLCJjb250cmFjdHMiLCJldm0iLCJvYmplY3QiLCJDb250cmFjdHMiLCJzdG9yZSIsIlR4QW5hbHl6ZXIiLCJfaGFuZGxlVHhIYXNoQ2hhbmdlIiwiX2hhbmRsZVR4SGFzaFN1Ym1pdCIsInBlbmRpbmdUcmFuc2FjdGlvbnMiLCJnZXRUeEFuYWx5c2lzIiwidHhBbmFseXNpcyIsInRyYW5zYWN0aW9ucyIsInNsaWNlIiwicmV2ZXJzZSIsImV2ZW50UmVkdWNlciIsIkV2ZW50SXRlbSIsImlkIiwiRXZlbnRzIiwiZXZlbnRzXyIsIk5vZGVDb250cm9sIiwiX3JlZnJlc2hTeW5jIiwiZ2V0Tm9kZUluZm8iLCJnZXRTeW5jU3RhdCIsInN5bmNTdGF0IiwiZ2V0TWluaW5nIiwiaGFzaFJhdGUiLCJzeW5jaW5nIiwiY3VycmVudEJsb2NrIiwiaGlnaGVzdEJsb2NrIiwidG9GaXhlZCIsImtub3duU3RhdGVzIiwicHVsbGVkU3RhdGVzIiwic3RhcnRpbmdCbG9jayIsIm5vZGUiLCJTdGF0aWNBbmFseXNpcyIsImFubHNSdW5uZXIiLCJDb2RlQW5hbHlzaXMiLCJtb2R1bGVzIiwiX2dldE5vZGVzIiwiX3J1bkFuYWx5c2lzIiwibm9kZXMiLCJjaGVja2VkIiwibW9kdWxlIiwibGFiZWwiLCJkZXNjcmlwdGlvbiIsImdldEFuYWx5c2lzIiwiYW5hbHlzaXMiLCJyZWplY3QiLCJydW4iLCJleHBhbmRlZCIsImEiLCJyZXBvcnQiLCJsb2NhdGlvbiIsIndhcm5pbmciLCJfX2h0bWwiLCJtb3JlIiwiVGFiVmlldyIsIl9oYW5kbGVUYWJTZWxlY3QiLCJuZXdUeENvdW50ZXIiLCJ0eEJ0blN0eWxlIiwibmV3RXZlbnRDb3VudGVyIiwiZXZlbnRCdG5TdHlsZSIsIkNvaW5iYXNlVmlldyIsIl9oYW5kbGVBY2NDaGFuZ2UiLCJfaGFuZGxlUGFzc3dvcmRDaGFuZ2UiLCJfaGFuZGxlVW5sb2NrIiwiX2xpbmtDbGljayIsImJhbGFuY2UiLCJjbGlwYm9hcmQiLCJ3cml0ZSIsInVubG9ja19zdHlsZSIsInByZXZlbnREZWZhdWx0IiwiQ29tcGlsZUJ0biIsInZpZXdzIiwiZ2V0VmlldyIsIndvcmtzcGFjZSIsImNvbW1hbmRzIiwid29ya3NwYWNlRWxlbWVudCIsIlZpZXciLCJBY2NvdW50cyIsInJlbmRlciIsImdldEVsZW1lbnRCeUlkIiwidGV4dCIsInRleHROb2RlIiwiY2FsbGJhY2siLCJlcnIiLCJXZWIzRW52Iiwid2ViM1N1YnNjcmlwdGlvbnMiLCJzYXZlU3Vic2NyaXB0aW9ucyIsImNvbXBpbGVTdWJzY3JpcHRpb25zIiwib2JzZXJ2ZUNvbmZpZyIsIm9ic2VydmUiLCJleGVjdXRpb25FbnYiLCJzdWJzY3JpYmVUb1dlYjNDb21tYW5kcyIsInN1YnNjcmliZVRvV2ViM0V2ZW50cyIsIm9uRGlkQ2hhbmdlIiwiZW52Q2hhbmdlIiwibmV3VmFsdWUiLCJzdWJzY3JpYmVUb0NvbXBpbGVFdmVudHMiLCJycGNBZGRyZXNzIiwid2Vic29ja2V0QWRkcmVzcyIsIldlYjMiLCJjdXJyZW50UHJvdmlkZXIiLCJnaXZlblByb3ZpZGVyIiwicHJvdmlkZXJzIiwiSHR0cFByb3ZpZGVyIiwic2V0UHJvdmlkZXIiLCJXZWJzb2NrZXRQcm92aWRlciIsInZpZXciLCJpcyIsInN1YnNjcmliZSIsImJsb2NrcyIsInN5bmMiLCJDdXJyZW50QmxvY2siLCJIaWdoZXN0QmxvY2siLCJLbm93blN0YXRlcyIsIlB1bGxlZFN0YXRlcyIsIlN0YXJ0aW5nQmxvY2siLCJjaGVja0Nvbm5lY3Rpb24iLCJjb25uZWN0aW9uIiwiY3JlYXRlQ29tcGlsZXJPcHRpb25zVmlldyIsImNyZWF0ZUNvaW5iYXNlVmlldyIsImNyZWF0ZUJ1dHRvbnNWaWV3IiwiY3JlYXRlVGFiVmlldyIsIm9ic2VydmVUZXh0RWRpdG9ycyIsImVkaXRvciIsImdldEJ1ZmZlciIsImNvbXBpbGVPblNhdmUiLCJzdWJzY3JpYmVUb1NhdmVFdmVudHMiLCJidWZmZXJTdWJzY3JpcHRpb25zIiwib25EaWRTYXZlIiwiZmlsZVBhdGgiLCJjb21waWxlIiwib25EaWREZXN0cm95IiwiaGF2ZUNvbm4iLCJnZXRQYXRoIiwicG9wIiwiZGlybmFtZSIsImdldFRleHQiLCJkaXIiLCJjb21waWxlV2ViMyIsImVudHJpZXMiLCJnZXRHYXNMaW1pdCIsIklOSVRJQUxfU1RBVEUiLCJhY3Rpb24iLCJjb21iaW5lUmVkdWNlcnMiLCJDb250cmFjdFJlZHVjZXIiLCJBY2NvdW50UmVkdWNlciIsIkVycm9yUmVkdWNlciIsIkV2ZW50UmVkdWNlciIsIkNsaWVudFJlZHVjZXIiLCJOb2RlUmVkdWNlciIsImNvbmZpZ3VyZVN0b3JlIiwiaW5pdGlhbFN0YXRlIiwibWlkZGxlV2FyZXMiLCJSZWR1eFRodW5rIiwiaW5EZXZNb2RlIiwibG9nZ2VyIiwiY3JlYXRlU3RvcmUiLCJldGhlcmF0b21SZWR1Y2VycyIsImFwcGx5TWlkZGxld2FyZSIsIkV0aGVyYXRvbSIsImF0b21Tb2xpZGl0eVZpZXciLCJtb2RhbFBhbmVsIiwibG9hZGVkIiwiaW5zdGFsbCIsIl90aGlzIiwidG9nZ2xlVmlldyIsImFkZFJpZ2h0UGFuZWwiLCJsb2FkIiwic2VyaWFsaXplIiwibG9hZFdlYjMiLCJXZWIzSW50ZXJmYWNlIiwiaXNWaXNpYmxlIiwiaGlkZSIsInNob3ciLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV4QixPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFdkMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXBDLElBQUksTUFBTSxDQUFDLGNBQWMsRUFBRTtFQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7Q0FDbkU7QUFDRCxNQUFNLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQzs7QUFFN0IsSUFBSSxlQUFlLEdBQUcsZ0JBQWdCLENBQUM7QUFDdkMsU0FBUyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7RUFDN0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFFBQVEsRUFBRSxJQUFJO0lBQ2QsWUFBWSxFQUFFLElBQUk7SUFDbEIsS0FBSyxFQUFFLEtBQUs7R0FDYixDQUFDLENBQUM7Q0FDSjs7QUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pELE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWhELCtMQUErTCxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUU7RUFDaE8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENB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
