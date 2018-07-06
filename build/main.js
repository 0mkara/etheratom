'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var atom$1 = require('atom');
var Solc = _interopDefault(require('solc'));
var EventEmitter = _interopDefault(require('events'));
var atomMessagePanel = require('atom-message-panel');
var axios = _interopDefault(require('axios'));
var path = _interopDefault(require('path'));
var url = _interopDefault(require('url'));
var validUrl = _interopDefault(require('valid-url'));
var fs = _interopDefault(require('fs'));
var React = _interopDefault(require('react'));
var reactRedux = require('react-redux');
var PropTypes = _interopDefault(require('prop-types'));
var ReactJson = _interopDefault(require('react-json-view'));
var reactTabs = require('react-tabs');
var reactCollapse = require('react-collapse');
var VirtualList = _interopDefault(require('react-tiny-virtual-list'));
var RemixTests = _interopDefault(require('remix-tests'));
var remixSolidity = require('remix-solidity');
var CheckboxTree = _interopDefault(require('react-checkbox-tree'));
var ReactDOM = _interopDefault(require('react-dom'));
var Web3 = _interopDefault(require('web3'));
var redux = require('redux');
var logger = _interopDefault(require('redux-logger'));
var ReduxThunk = _interopDefault(require('redux-thunk'));
require('idempotent-babel-polyfill');

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
		message.textContent = 'Etheratom IDE';
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
									'*': {
										'': ['legacyAST'],
										'*': ['abi', 'evm.bytecode.object', 'devdoc', 'userdoc', 'evm.gasEstimates']
									}
								};
								settings = {
									optimizer: { enabled: true, runs: 500 },
									evmVersion: 'byzantium',
									outputSelection: outputSelection
								};
								input = { language: 'Solidity', sources: sources, settings: settings };
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
								return this.web3.utils.fromWei(weiBalance, 'ether');

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
				var coinbase, password, abi, code, gasSupply, error, gasPrice, contract;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								console.log('%c Creating contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
								coinbase = args.coinbase;
								password = args.password;
								abi = args.abi;
								code = args.bytecode;
								gasSupply = args.gas;

								if (coinbase) {
									_context5.next = 9;
									break;
								}

								error = new Error('No coinbase selected!');
								throw error;

							case 9:
								this.web3.eth.defaultAccount = coinbase;
								_context5.prev = 10;

								if (!password) {
									_context5.next = 14;
									break;
								}

								_context5.next = 14;
								return this.web3.eth.personal.unlockAccount(coinbase, password);

							case 14:
								_context5.prev = 14;
								_context5.next = 17;
								return this.web3.eth.getGasPrice();

							case 17:
								gasPrice = _context5.sent;
								_context5.next = 20;
								return new this.web3.eth.Contract(abi, {
									from: this.web3.eth.defaultAccount,
									data: '0x' + code,
									gas: this.web3.utils.toHex(gasSupply),
									gasPrice: this.web3.utils.toHex(gasPrice)
								});

							case 20:
								contract = _context5.sent;
								return _context5.abrupt('return', contract);

							case 24:
								_context5.prev = 24;
								_context5.t0 = _context5['catch'](14);

								console.log(_context5.t0);
								throw _context5.t0;

							case 28:
								_context5.next = 34;
								break;

							case 30:
								_context5.prev = 30;
								_context5.t1 = _context5['catch'](10);

								console.log(_context5.t1);
								throw _context5.t1;

							case 34:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this, [[10, 30], [14, 24]]);
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
				var ContractInstance, contractInstance;
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								console.log('%c Deploying contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');

								ContractInstance = function (_EventEmitter) {
									inherits(ContractInstance, _EventEmitter);

									function ContractInstance() {
										classCallCheck(this, ContractInstance);
										return possibleConstructorReturn(this, (ContractInstance.__proto__ || Object.getPrototypeOf(ContractInstance)).apply(this, arguments));
									}

									return ContractInstance;
								}(EventEmitter);

								contractInstance = new ContractInstance();
								_context6.prev = 3;

								params = params.map(function (param) {
									return param.type.endsWith('[]') ? param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',') : param.value;
								});
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

							case 9:
								_context6.prev = 9;
								_context6.t0 = _context6['catch'](3);

								console.log(_context6.t0);
								throw _context6.t0;

							case 13:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this, [[3, 9]]);
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
								console.log('%c Web3 calling functions... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
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

/*eslint no-useless-escape: "warn"*/

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
                                fileRoot = fullpath.substring(0, fullpath.lastIndexOf('/'));
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
var UPDATE_INTERFACE = 'update_interface';
var SET_INSTANCE = 'set_instance';
var SET_DEPLOYED = 'set_deployed';
var SET_GAS_LIMIT = 'set_gas_limit';
var SET_SOURCES = 'set_sources';

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

var updateInterface = function updateInterface(_ref3) {
    var contractName = _ref3.contractName,
        ContractABI = _ref3.ContractABI;

    return function (dispatch) {
        dispatch({ type: ADD_INTERFACE, payload: { contractName: contractName, interface: ContractABI } });
    };
};

var setInstance = function setInstance(_ref4) {
    var contractName = _ref4.contractName,
        instance = _ref4.instance;

    return function (dispatch) {
        dispatch({ type: SET_INSTANCE, payload: { contractName: contractName, instance: instance } });
    };
};

var setDeployed = function setDeployed(_ref5) {
    var contractName = _ref5.contractName,
        deployed = _ref5.deployed;

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

GasInput.propTypes = {
    contractName: PropTypes.string,
    interfaces: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    gasLimit: PropTypes.number,
    gas: PropTypes.numebr
};

var mapStateToProps = function mapStateToProps(_ref) {
    var contract = _ref.contract;
    var compiled = contract.compiled,
        gasLimit = contract.gasLimit;

    return { compiled: compiled, gasLimit: gasLimit };
};

var GasInput$1 = reactRedux.connect(mapStateToProps, {})(GasInput);

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

InputsForm.propTypes = {
    onSubmit: PropTypes.func,
    contractName: PropTypes.string,
    abi: PropTypes.object
};

var mapStateToProps$1 = function mapStateToProps(_ref) {
    var contract = _ref.contract;
    var compiled = contract.compiled;

    return { compiled: compiled };
};

var InputsForm$1 = reactRedux.connect(mapStateToProps$1, { setParamsInput: setParamsInput })(InputsForm);

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

CreateButton.propTypes = {
    helpers: PropTypes.any.isRequired,
    coinbase: PropTypes.string,
    password: PropTypes.string,
    interfaces: PropTypes.object,
    setInstance: PropTypes.func,
    setDeployed: PropTypes.func,
    addNewEvents: PropTypes.func,
    contractName: PropTypes.string
};

var mapStateToProps$2 = function mapStateToProps(_ref4) {
    var contract = _ref4.contract,
        account = _ref4.account;
    var compiled = contract.compiled,
        interfaces = contract.interfaces;
    var coinbase = account.coinbase,
        password = account.password;

    return { compiled: compiled, interfaces: interfaces, coinbase: coinbase, password: password };
};

var CreateButton$1 = reactRedux.connect(mapStateToProps$2, { setDeployed: setDeployed, setInstance: setInstance, addNewEvents: addNewEvents })(CreateButton);

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
                { className: 'contract-content', key: index },
                React.createElement(
                    'span',
                    { className: 'contract-name inline-block highlight-success' },
                    contractName
                ),
                React.createElement(
                    'div',
                    { className: 'byte-code' },
                    React.createElement(
                        'pre',
                        { className: 'large-code' },
                        JSON.stringify(bytecode)
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'abi-definition' },
                    React.createElement(
                        reactTabs.Tabs,
                        null,
                        React.createElement(
                            reactTabs.TabList,
                            null,
                            React.createElement(
                                'div',
                                { className: 'tab_btns' },
                                React.createElement(
                                    reactTabs.Tab,
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'btn' },
                                        'Interface'
                                    )
                                ),
                                React.createElement(
                                    reactTabs.Tab,
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'btn' },
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
                                { className: 'large-code' },
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

ContractCompiled.propTypes = {
    helpers: PropTypes.any.isRequired,
    interfaces: PropTypes.object,
    contractName: PropTypes.string,
    addInterface: PropTypes.func,
    bytecode: PropTypes.string,
    index: PropTypes.number

};
var mapStateToProps$3 = function mapStateToProps(_ref2) {
    var account = _ref2.account,
        contract = _ref2.contract;
    var compiled = contract.compiled,
        interfaces = contract.interfaces;
    var coinbase = account.coinbase;

    return { compiled: compiled, interfaces: interfaces, coinbase: coinbase };
};

var ContractCompiled$1 = reactRedux.connect(mapStateToProps$3, { addInterface: addInterface })(ContractCompiled);

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
        value: function _handleChange(i, j, event) {
            var _props = this.props,
                contractName = _props.contractName,
                interfaces = _props.interfaces;

            var ContractABI = interfaces[contractName].interface;
            var input = ContractABI[i].inputs[j];
            input.value = event.target.value;
            ContractABI[i].inputs[j] = Object.assign({}, input);
            this.props.updateInterface({ contractName: contractName, ContractABI: ContractABI });
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
                var _props2, contractName, coinbase, password, instances, contract, result;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _props2 = this.props, contractName = _props2.contractName, coinbase = _props2.coinbase, password = _props2.password, instances = _props2.instances;
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
                var _props3, contractName, coinbase, password, instances, contract, params, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, input, result;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                _props3 = this.props, contractName = _props3.contractName, coinbase = _props3.coinbase, password = _props3.password, instances = _props3.instances;
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

            var _props4 = this.props,
                contractName = _props4.contractName,
                interfaces = _props4.interfaces;

            var ContractABI = interfaces[contractName].interface;
            return React.createElement(
                'div',
                { className: 'abi-container' },
                ContractABI.map(function (abi, i) {
                    if (abi.type === 'function') {
                        return React.createElement(
                            'div',
                            { key: i, className: 'function-container' },
                            React.createElement(
                                'form',
                                { key: i, onSubmit: function onSubmit() {
                                        return _this2._handleSubmit(abi);
                                    } },
                                React.createElement('input', { key: i, type: 'submit', value: abi.name, className: 'text-subtle call-button' }),
                                abi.inputs.map(function (input, j) {
                                    return React.createElement('input', {
                                        type: 'text',
                                        className: 'call-button-values',
                                        placeholder: input.name + ' ' + input.type,
                                        value: input.value,
                                        onChange: function onChange(event) {
                                            return _this2._handleChange(i, j, event);
                                        },
                                        key: j
                                    });
                                }),
                                abi.payable === true && React.createElement('input', {
                                    className: 'call-button-values',
                                    type: 'number',
                                    placeholder: 'payable value in wei',
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
                                    placeholder: 'send wei to contract',
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

FunctionABI.propTypes = {
    helpers: PropTypes.any.isRequired,
    contractName: PropTypes.string,
    interfaces: PropTypes.object,
    updateInterface: PropTypes.func
};

var mapStateToProps$4 = function mapStateToProps(_ref3) {
    var contract = _ref3.contract,
        account = _ref3.account;
    var compiled = contract.compiled,
        interfaces = contract.interfaces,
        instances = contract.instances;
    var coinbase = account.coinbase,
        password = account.password;

    return { compiled: compiled, interfaces: interfaces, instances: instances, coinbase: coinbase, password: password };
};

var FunctionABI$1 = reactRedux.connect(mapStateToProps$4, { updateInterface: updateInterface })(FunctionABI);

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
                { className: 'contract-content', key: index },
                React.createElement(
                    'span',
                    { className: 'contract-name inline-block highlight-success' },
                    contractName
                ),
                React.createElement(
                    'div',
                    { className: 'byte-code' },
                    React.createElement(
                        'pre',
                        { className: 'large-code' },
                        JSON.stringify(bytecode)
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'abi-definition' },
                    React.createElement(
                        reactTabs.Tabs,
                        null,
                        React.createElement(
                            reactTabs.TabList,
                            null,
                            React.createElement(
                                'div',
                                { className: 'tab_btns' },
                                React.createElement(
                                    reactTabs.Tab,
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'btn' },
                                        'Interface'
                                    )
                                ),
                                React.createElement(
                                    reactTabs.Tab,
                                    null,
                                    React.createElement(
                                        'div',
                                        { className: 'btn' },
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
                                { className: 'large-code' },
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
                        { className: 'inline-block highlight' },
                        'Transaction hash:'
                    ),
                    React.createElement(
                        'pre',
                        { className: 'large-code' },
                        contract.transactionHash
                    )
                ),
                !contract.options.address && React.createElement(
                    'div',
                    { id: contractName + '_stat' },
                    React.createElement(
                        'span',
                        { className: 'stat-mining stat-mining-align' },
                        'waiting to be mined'
                    ),
                    React.createElement('span', { className: 'loading loading-spinner-tiny inline-block stat-mining-align' })
                ),
                contract.options.address && React.createElement(
                    'div',
                    { id: contractName + '_stat' },
                    React.createElement(
                        'span',
                        { className: 'inline-block highlight' },
                        'Mined at:'
                    ),
                    React.createElement(
                        'pre',
                        { className: 'large-code' },
                        contract.options.address
                    )
                ),
                ContractABI.map(function (abi, i) {
                    return React.createElement(InputsForm$1, { contractName: contractName, abi: abi, key: i });
                }),
                React.createElement(FunctionABI$1, { contractName: contractName, helpers: this.helpers })
            );
        }
    }]);
    return ContractExecution;
}(React.Component);

ContractExecution.propTypes = {
    helpers: PropTypes.any.isRequired,
    contractName: PropTypes.string,
    bytecode: PropTypes.string,
    index: PropTypes.number,
    instances: PropTypes.any,
    interfaces: PropTypes.object
};

var mapStateToProps$5 = function mapStateToProps(_ref) {
    var contract = _ref.contract;
    var interfaces = contract.interfaces,
        instances = contract.instances;

    return { interfaces: interfaces, instances: instances };
};

var ContractExecution$1 = reactRedux.connect(mapStateToProps$5, {})(ContractExecution);

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

ErrorView.propTypes = {
    errormsg: PropTypes.any
};

var mapStateToProps$6 = function mapStateToProps(_ref) {
    var errors = _ref.errors;
    var errormsg = errors.errormsg;

    return { errormsg: errormsg };
};

var ErrorView$1 = reactRedux.connect(mapStateToProps$6, {})(ErrorView);

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
                    { className: 'label file-collapse-label' },
                    React.createElement(
                        'h4',
                        { className: 'text-success' },
                        fileName
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
                    Object.keys(compiled.contracts[fileName]).map(function (contractName, index) {
                        var bytecode = compiled.contracts[fileName][contractName].evm.bytecode.object;
                        return React.createElement(
                            'div',
                            { id: contractName, className: 'contract-container', key: index },
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
                    { id: 'compiled-code', className: 'compiled-code' },
                    compiled && Object.keys(compiled.contracts).map(function (fileName, index) {
                        return React.createElement(CollapsedFile, {
                            fileName: fileName,
                            compiled: compiled,
                            deployed: deployed,
                            compiling: compiling,
                            interfaces: interfaces,
                            helpers: _this4.helpers,
                            key: index
                        });
                    }),
                    !compiled && React.createElement(
                        'h2',
                        { className: 'text-warning no-header' },
                        'No compiled contract!'
                    ),
                    React.createElement(
                        'div',
                        { id: 'compiled-error', className: 'error-container' },
                        React.createElement(ErrorView$1, null)
                    )
                )
            );
        }
    }]);
    return Contracts;
}(React.Component);

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
    helpers: PropTypes.any.isRequired,
    store: PropTypes.any.isRequired,
    compiled: PropTypes.object,
    deployed: PropTypes.any,
    compiling: PropTypes.bool,
    interfaces: PropTypes.object
};

var mapStateToProps$7 = function mapStateToProps(_ref) {
    var contract = _ref.contract;
    var compiled = contract.compiled,
        deployed = contract.deployed,
        compiling = contract.compiling,
        interfaces = contract.interfaces;

    return { compiled: compiled, deployed: deployed, compiling: compiling, interfaces: interfaces };
};

var Contracts$1 = reactRedux.connect(mapStateToProps$7, { addInterface: addInterface })(Contracts);

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
                            React.createElement('input', { type: 'text', name: 'txhash', value: this.state.txHash, onChange: this._handleTxHashChange, placeholder: 'Transaction hash', className: 'input-search' })
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
                                { className: 'tx-list-item' },
                                React.createElement(
                                    'span',
                                    { className: 'padded text-warning' },
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

TxAnalyzer.propTypes = {
    helpers: PropTypes.any.isRequired,
    pendingTransactions: PropTypes.array
};

var mapStateToProps$8 = function mapStateToProps(_ref3) {
    var eventReducer = _ref3.eventReducer;
    var pendingTransactions = eventReducer.pendingTransactions;

    return { pendingTransactions: pendingTransactions };
};

var TxAnalyzer$1 = reactRedux.connect(mapStateToProps$8, {})(TxAnalyzer);

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

EventItem.propTypes = {
    event: PropTypes.object
};

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

Events.propTypes = {
    helpers: PropTypes.any.isRequired,
    events: PropTypes.arrayOf(PropTypes.object)
};

var mapStateToProps$9 = function mapStateToProps(_ref) {
    var eventReducer = _ref.eventReducer;
    var events = eventReducer.events;

    return { events: events };
};

var Events$1 = reactRedux.connect(mapStateToProps$9, {})(Events);

var RemixTest = function (_React$Component) {
    inherits(RemixTest, _React$Component);

    function RemixTest(props) {
        classCallCheck(this, RemixTest);

        var _this = possibleConstructorReturn(this, (RemixTest.__proto__ || Object.getPrototypeOf(RemixTest)).call(this, props));

        _this.state = {
            testResults: [],
            running: false
        };
        _this._runRemixTests = _this._runRemixTests.bind(_this);
        _this._testCallback = _this._testCallback.bind(_this);
        _this._finalCallback = _this._finalCallback.bind(_this);
        return _this;
    }

    createClass(RemixTest, [{
        key: '_testCallback',
        value: function _testCallback(result) {
            try {
                var testResults = this.state.testResults;

                var t = testResults.slice();
                t.push(result);
                this.setState({ testResults: t });
            } catch (e) {
                throw e;
            }
        }
    }, {
        key: '_resultsCallback',
        value: function _resultsCallback(result) {
            console.log(result);
        }
    }, {
        key: '_finalCallback',
        value: function _finalCallback(err, result) {
            if (err) {
                throw err;
            }
            this.setState({ testResult: result, running: false });
        }
    }, {
        key: '_importFileCb',
        value: function _importFileCb(err, result) {
            console.log(err);
            console.log(result);
        }
    }, {
        key: '_runRemixTests',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _this2 = this;

                var sources, promises, filename;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                sources = this.props.sources;

                                this.setState({ testResults: [], running: true });
                                promises = [];
                                _context.t0 = regeneratorRuntime.keys(sources);

                            case 4:
                                if ((_context.t1 = _context.t0()).done) {
                                    _context.next = 14;
                                    break;
                                }

                                filename = _context.t1.value;

                                if (!(filename === 'remix_tests.sol')) {
                                    _context.next = 8;
                                    break;
                                }

                                return _context.abrupt('continue', 4);

                            case 8:
                                _context.next = 10;
                                return this.injectTests(sources[filename]);

                            case 10:
                                sources[filename].content = _context.sent;

                                promises.push(filename);
                                _context.next = 4;
                                break;

                            case 14:
                                Promise.all(promises).then(function (testSources) {
                                    console.log(sources);
                                    RemixTests.runTestSources(sources, _this2._testCallback, _this2._resultsCallback, _this2._finalCallback, _this2._importFileCb);
                                }).catch(function (e) {
                                    console.log(e);
                                });

                            case 15:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _runRemixTests() {
                return _ref.apply(this, arguments);
            }

            return _runRemixTests;
        }()
    }, {
        key: 'injectTests',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(source) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.abrupt('return', source.content.replace(/(pragma solidity \^\d+\.\d+\.\d+;)/, '$1\nimport \'remix_tests.sol\';'));

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function injectTests(_x) {
                return _ref2.apply(this, arguments);
            }

            return injectTests;
        }()
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                testResults = _state.testResults,
                testResult = _state.testResult,
                running = _state.running;

            return React.createElement(
                'div',
                { id: 'remix-tests' },
                React.createElement(
                    'h2',
                    { className: 'block test-header' },
                    'Naming conventions'
                ),
                React.createElement(
                    'h3',
                    { className: 'block test-header' },
                    'File names should end with _test, as in foo_test.sol'
                ),
                React.createElement(
                    'div',
                    { className: 'test-selector' },
                    React.createElement(
                        'button',
                        { className: 'btn btn-primary inline-block-tight', onClick: this._runRemixTests },
                        'Run tests'
                    ),
                    running && React.createElement('span', { className: 'loading loading-spinner-tiny inline-block' }),
                    testResult && React.createElement(
                        'div',
                        { className: 'test-result' },
                        React.createElement(
                            'span',
                            { className: 'text-error' },
                            'Total failing: ',
                            testResult.totalFailing,
                            ' '
                        ),
                        React.createElement(
                            'span',
                            { className: 'text-success' },
                            'Total passing: ',
                            testResult.totalPassing,
                            ' '
                        ),
                        React.createElement(
                            'span',
                            { className: 'text-info' },
                            'Time: ',
                            testResult.totalTime
                        )
                    )
                ),
                React.createElement(VirtualList, {
                    height: '100vh',
                    itemCount: testResults.length,
                    itemSize: 30,
                    className: 'test-result-list-container',
                    overscanCount: 10,
                    renderItem: function renderItem(_ref3) {
                        var index = _ref3.index;
                        return React.createElement(
                            'div',
                            { key: index, className: 'test-result-list-item' },
                            testResults[index].type === 'contract' && React.createElement('span', { className: 'status-renamed icon icon-checklist' }),
                            testResults[index].type === 'testPass' && React.createElement('span', { className: 'status-added icon icon-check' }),
                            testResults[index].type === 'testFailure' && React.createElement('span', { className: 'status-removed icon icon-x' }),
                            React.createElement(
                                'span',
                                { className: 'padded text-warning' },
                                testResults[index].value
                            )
                        );
                    }
                })
            );
        }
    }]);
    return RemixTest;
}(React.Component);

RemixTest.propTypes = {
    helpers: PropTypes.any.isRequired,
    sources: PropTypes.object,
    compiled: PropTypes.object
};
var mapStateToProps$a = function mapStateToProps(_ref4) {
    var contract = _ref4.contract;
    var sources = contract.sources;

    return { sources: sources };
};
var RemixTest$1 = reactRedux.connect(mapStateToProps$a, {})(RemixTest);

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
    setAccounts: PropTypes.func
};

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
                                    _context.next = 13;
                                    break;
                                }

                                _context.prev = 3;
                                _context.next = 6;
                                return this.getAnalysis(compiled, checked);

                            case 6:
                                analysis = _context.sent;

                                this.setState({ analysis: analysis });
                                _context.next = 13;
                                break;

                            case 10:
                                _context.prev = 10;
                                _context.t0 = _context['catch'](3);
                                throw _context.t0;

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 10]]);
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

StaticAnalysis.propTypes = {
    helpers: PropTypes.any.isRequired
};

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
                                'Tests'
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
                    React.createElement(RemixTest$1, { store: this.props.store, helpers: this.helpers })
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

TabView.propTypes = {
    helpers: PropTypes.any.isRequired,
    store: PropTypes.any.isRequired,
    pendingTransactions: PropTypes.array,
    events: PropTypes.array
};

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
                { className: 'content' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement('div', { className: 'icon icon-link btn copy-btn btn-success', onClick: this._linkClick }),
                    React.createElement(
                        'select',
                        { onChange: this._handleAccChange, value: this.state.coinbase },
                        accounts.map(function (account, i) {
                            return React.createElement(
                                'option',
                                { key: i, value: account },
                                account
                            );
                        })
                    ),
                    React.createElement(
                        'button',
                        { className: 'btn' },
                        balance,
                        ' ETH'
                    )
                ),
                React.createElement(
                    'form',
                    { className: 'row', onSubmit: this._handleUnlock },
                    React.createElement('div', { className: 'icon icon-lock' }),
                    React.createElement('input', {
                        type: 'password', placeholder: 'Password',
                        value: password,
                        onChange: this._handlePasswordChange
                    }),
                    React.createElement('input', {
                        type: 'submit',
                        className: this.state.unlock_style,
                        value: 'Unlock'
                    })
                )
            );
        }
    }]);
    return CoinbaseView;
}(React.Component);

CoinbaseView.propTypes = {
    helpers: PropTypes.any.isRequired,
    accounts: PropTypes.arrayOf(PropTypes.string),
    setCoinbase: PropTypes.any,
    setPassword: PropTypes.any
};

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
                { className: 'row', onSubmit: this._handleSubmit },
                compiling && React.createElement('input', { type: 'submit', value: 'Compiling...', className: 'btn copy-btn btn-success', disabled: true }),
                !compiling && React.createElement('input', { type: 'submit', value: 'Compile', className: 'btn copy-btn btn-success' })
            );
        }
    }]);
    return CompileBtn;
}(React.Component);

CompileBtn.propTypes = {
    compiling: PropTypes.bool
};

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
								this.helpers.showPanelError('No account exists! Please create one.');
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
        this.subscribeToWeb3Commands();
        this.subscribeToWeb3Events();
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

        // Subscriptions

    }, {
        key: 'subscribeToWeb3Commands',
        value: function subscribeToWeb3Commands() {
            var _this = this;

            if (!this.web3Subscriptions) {
                return;
            }
            this.web3Subscriptions.add(atom.commands.add('atom-workspace', 'eth-interface:compile', function () {
                if (_this.compileSubscriptions) {
                    _this.compileSubscriptions.dispose();
                }
                _this.compileSubscriptions = new atom$1.CompositeDisposable();
                _this.subscribeToCompileEvents();
            }));
        }
    }, {
        key: 'subscribeToWeb3Events',
        value: function () {
            var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _this2 = this;

                var rpcAddress, websocketAddress;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (this.web3Subscriptions) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt('return');

                            case 2:
                                rpcAddress = atom.config.get('etheratom.rpcAddress');
                                websocketAddress = atom.config.get('etheratom.websocketAddress');

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
                                    console.log('%c Provider is websocket. Creating subscriptions... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                                    // newBlockHeaders subscriber
                                    /*this.web3.eth.subscribe('newBlockHeaders')
                                        .on('data', (blocks) => {
                                            console.log('%c newBlockHeaders:data ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                                            console.log(blocks);
                                        })
                                        .on('error', (e) => {
                                            console.log('%c newBlockHeaders:error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                                            console.log(e);
                                        });*/
                                    // pendingTransactions subscriber
                                    this.web3.eth.subscribe('pendingTransactions').on('data', function (transaction) {
                                        /*console.log("%c pendingTransactions:data ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                                        console.log(transaction);*/
                                        _this2.store.dispatch({ type: ADD_PENDING_TRANSACTION, payload: transaction });
                                    }).on('error', function (e) {
                                        console.log('%c pendingTransactions:error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                                        console.log(e);
                                    });
                                    // syncing subscription
                                    this.web3.eth.subscribe('syncing').on('data', function (sync) {
                                        console.log('%c syncing:data ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                                        console.log(sync);
                                        if (typeof sync === 'boolean') {
                                            _this2.store.dispatch({ type: SET_SYNCING, payload: sync });
                                        }
                                        if ((typeof sync === 'undefined' ? 'undefined' : _typeof(sync)) === 'object') {
                                            _this2.store.dispatch({ type: SET_SYNCING, payload: sync.syncing });
                                            var status = {
                                                currentBlock: sync.status.CurrentBlock,
                                                highestBlock: sync.status.HighestBlock,
                                                knownStates: sync.status.KnownStates,
                                                pulledStates: sync.status.PulledStates,
                                                startingBlock: sync.status.StartingBlock
                                            };
                                            _this2.store.dispatch({ type: SET_SYNC_STATUS, payload: status });
                                        }
                                    }).on('changed', function (isSyncing) {
                                        console.log('%c syncing:changed ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                                        console.log(isSyncing);
                                    }).on('error', function (e) {
                                        console.log('%c syncing:error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                                        console.log(e);
                                    });
                                }
                                this.checkConnection(function (error, connection) {
                                    if (error) {
                                        _this2.helpers.showPanelError(error);
                                    } else if (connection) {
                                        _this2.view.createCoinbaseView();
                                        _this2.view.createButtonsView();
                                        _this2.view.createTabView();
                                    }
                                });
                                this.web3Subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
                                    if (!editor || !editor.getBuffer()) {
                                        return;
                                    }

                                    _this2.web3Subscriptions.add(atom.config.observe('etheratom.compileOnSave', function (compileOnSave) {
                                        if (_this2.saveSubscriptions) {
                                            _this2.saveSubscriptions.dispose();
                                        }
                                        _this2.saveSubscriptions = new atom$1.CompositeDisposable();
                                        if (compileOnSave) {
                                            _this2.subscribeToSaveEvents();
                                        }
                                    }));
                                }));

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function subscribeToWeb3Events() {
                return _ref.apply(this, arguments);
            }

            return subscribeToWeb3Events;
        }()

        // Event subscriptions

    }, {
        key: 'subscribeToSaveEvents',
        value: function subscribeToSaveEvents() {
            var _this3 = this;

            if (!this.web3Subscriptions) {
                return;
            }
            this.saveSubscriptions.add(atom.workspace.observeTextEditors(function (editor) {
                if (!editor || !editor.getBuffer()) {
                    return;
                }

                var bufferSubscriptions = new atom$1.CompositeDisposable();
                bufferSubscriptions.add(editor.getBuffer().onDidSave(function (filePath) {
                    _this3.compile(editor);
                }));
                bufferSubscriptions.add(editor.getBuffer().onDidDestroy(function () {
                    bufferSubscriptions.dispose();
                }));
                _this3.saveSubscriptions.add(bufferSubscriptions);
            }));
        }
    }, {
        key: 'subscribeToCompileEvents',
        value: function subscribeToCompileEvents() {
            var _this4 = this;

            if (!this.web3Subscriptions) {
                return;
            }
            this.compileSubscriptions.add(atom.workspace.observeTextEditors(function (editor) {
                if (!editor || !editor.getBuffer()) {
                    return;
                }
                _this4.compile(editor);
            }));
        }

        // common functions

    }, {
        key: 'checkConnection',
        value: function checkConnection(callback) {
            var haveConn = void 0;
            haveConn = this.web3.currentProvider;
            if (!haveConn) {
                return callback(new Error('Error could not connect to local geth instance!'), null);
            } else {
                return callback(null, true);
            }
        }
    }, {
        key: 'compile',
        value: function () {
            var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(editor) {
                var filePath, filename, dir, sources, compiled, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _ref3, _ref4, contractName, contract, gasLimit;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                filePath = editor.getPath();
                                filename = filePath.replace(/^.*[\\\/]/, '');

                                if (!(filePath.split('.').pop() == 'sol')) {
                                    _context2.next = 78;
                                    break;
                                }

                                console.log('%c Compiling contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
                                this.store.dispatch({ type: SET_COMPILING, payload: true });
                                dir = path.dirname(filePath);
                                sources = {};

                                sources[filename] = { content: editor.getText() };
                                _context2.prev = 8;
                                _context2.next = 11;
                                return combineSource(dir, sources);

                            case 11:
                                sources = _context2.sent;


                                // Reset redux store
                                this.store.dispatch({ type: SET_COMPILED, payload: null });
                                this.store.dispatch({ type: SET_ERRORS, payload: [] });
                                this.store.dispatch({ type: SET_EVENTS, payload: [] });
                                _context2.next = 17;
                                return this.helpers.compileWeb3(sources);

                            case 17:
                                compiled = _context2.sent;

                                this.store.dispatch({ type: SET_COMPILED, payload: compiled });
                                this.store.dispatch({ type: SET_SOURCES, payload: sources });

                                if (!compiled.contracts) {
                                    _context2.next = 64;
                                    break;
                                }

                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context2.prev = 24;
                                _iterator = Object.entries(compiled.contracts)[Symbol.iterator]();

                            case 26:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context2.next = 50;
                                    break;
                                }

                                file = _step.value;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context2.prev = 31;

                                for (_iterator2 = Object.entries(file[1])[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    _ref3 = _step2.value;
                                    _ref4 = slicedToArray(_ref3, 2);
                                    contractName = _ref4[0];
                                    contract = _ref4[1];

                                    // Add interface to redux
                                    this.store.dispatch({ type: ADD_INTERFACE, payload: { contractName: contractName, interface: contract.abi } });
                                }
                                _context2.next = 39;
                                break;

                            case 35:
                                _context2.prev = 35;
                                _context2.t0 = _context2['catch'](31);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context2.t0;

                            case 39:
                                _context2.prev = 39;
                                _context2.prev = 40;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 42:
                                _context2.prev = 42;

                                if (!_didIteratorError2) {
                                    _context2.next = 45;
                                    break;
                                }

                                throw _iteratorError2;

                            case 45:
                                return _context2.finish(42);

                            case 46:
                                return _context2.finish(39);

                            case 47:
                                _iteratorNormalCompletion = true;
                                _context2.next = 26;
                                break;

                            case 50:
                                _context2.next = 56;
                                break;

                            case 52:
                                _context2.prev = 52;
                                _context2.t1 = _context2['catch'](24);
                                _didIteratorError = true;
                                _iteratorError = _context2.t1;

                            case 56:
                                _context2.prev = 56;
                                _context2.prev = 57;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 59:
                                _context2.prev = 59;

                                if (!_didIteratorError) {
                                    _context2.next = 62;
                                    break;
                                }

                                throw _iteratorError;

                            case 62:
                                return _context2.finish(59);

                            case 63:
                                return _context2.finish(56);

                            case 64:
                                if (compiled.errors) {
                                    this.store.dispatch({ type: SET_ERRORS, payload: compiled.errors });
                                }
                                _context2.next = 67;
                                return this.helpers.getGasLimit();

                            case 67:
                                gasLimit = _context2.sent;

                                this.store.dispatch({ type: SET_GAS_LIMIT, payload: gasLimit });
                                this.store.dispatch({ type: SET_COMPILING, payload: false });
                                _context2.next = 76;
                                break;

                            case 72:
                                _context2.prev = 72;
                                _context2.t2 = _context2['catch'](8);

                                console.log(_context2.t2);
                                this.helpers.showPanelError(_context2.t2);

                            case 76:
                                _context2.next = 79;
                                break;

                            case 78:
                                return _context2.abrupt('return');

                            case 79:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[8, 72], [24, 52, 56, 64], [31, 35, 39, 47], [40,, 42, 46], [57,, 59, 63]]);
            }));

            function compile(_x) {
                return _ref2.apply(this, arguments);
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
    gasLimit: 0,
    sources: {}
};
var ContractReducer = (function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
        case SET_SOURCES:
            return _extends({}, state, { sources: action.payload });
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
        case UPDATE_INTERFACE:
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
    clients: [{
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
