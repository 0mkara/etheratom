'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('idempotent-babel-polyfill');
var md5 = _interopDefault(require('md5'));
var atomMessagePanel = require('atom-message-panel');
var ReactDOM = _interopDefault(require('react-dom'));
var reactTabs = require('react-tabs');
var ReactJson = _interopDefault(require('react-json-view'));
var reactCollapse = require('react-collapse');
var VirtualList = _interopDefault(require('react-tiny-virtual-list'));
var child_process = require('child_process');
var Web3 = _interopDefault(require('web3'));
var remixAnalyzer = require('remix-analyzer');
var CheckboxTree = _interopDefault(require('react-checkbox-tree'));
var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));
var reactRedux = require('react-redux');
var logger = _interopDefault(require('redux-logger'));
var ReduxThunk = _interopDefault(require('redux-thunk'));
var redux = require('redux');
var atom$1 = require('atom');

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

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}

// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active && !(this instanceof domain.Domain)) ;
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
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
const SET_INSTANCE = 'set_instance';
const SET_DEPLOYED = 'set_deployed';
const SET_GAS_LIMIT = 'set_gas_limit'; // Files action types

const RESET_SOURCES = 'reset_sources';
const SET_SOURCES = 'set_sources';
const SET_COINBASE = 'set_coinbase';
const SET_PASSWORD = 'set_password';
const SET_ACCOUNTS = 'set_accounts';
const SET_ERRORS = 'set_errors';
const RESET_ERRORS = 'reset_errors'; // Ethereum client events

const ADD_PENDING_TRANSACTION = 'add_pending_transaction';
const ADD_EVENTS = 'add_logs';
const SET_EVENTS = 'set_events'; // Node variables
const SET_SYNC_STATUS = 'set_sync_status';
const SET_SYNCING = 'set_syncing';
const SET_MINING = 'set_mining';
const SET_HASH_RATE = 'set_hash_rate';

class Web3Helpers {
  constructor(web3, store) {
    this.web3 = web3;
    this.store = store;
    this.jobs = {// fileName: { solcWorker, hash }
    };
  }

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
        console.log(hashId);
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
      solcWorker.send({
        command: 'compile',
        payload: input
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

  async getGasEstimate(coinbase, bytecode) {
    if (!coinbase) {
      const error = new Error('No coinbase selected!');
      throw error;
    }

    try {
      this.web3.eth.defaultAccount = coinbase;
      const gasEstimate = await this.web3.eth.estimateGas({
        from: this.web3.eth.defaultAccount,
        data: '0x' + bytecode
      });
      return gasEstimate;
    } catch (e) {
      throw e;
    }
  }

  async setCoinbase(coinbase) {
    try {
      this.web3.eth.defaultAccount = coinbase;
    } catch (e) {
      throw e;
    }
  }

  async getBalance(coinbase) {
    if (!coinbase) {
      const error = new Error('No coinbase selected!');
      throw error;
    }

    try {
      const weiBalance = await this.web3.eth.getBalance(coinbase);
      const ethBalance = await this.web3.utils.fromWei(weiBalance, 'ether');
      return ethBalance;
    } catch (e) {
      throw e;
    }
  }

  async getSyncStat() {
    try {
      return this.web3.eth.isSyncing();
    } catch (e) {
      throw e;
    }
  }

  async create(_ref) {
    let args = _extends({}, _ref);

    console.log('%c Creating contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
    const coinbase = args.coinbase;
    const password = args.password;
    const abi = args.abi;
    const code = args.bytecode;
    const gasSupply = args.gas;

    if (!coinbase) {
      const error = new Error('No coinbase selected!');
      throw error;
    }

    this.web3.eth.defaultAccount = coinbase;

    try {
      if (password) {
        await this.web3.eth.personal.unlockAccount(coinbase, password);
      }

      try {
        const gasPrice = await this.web3.eth.getGasPrice();
        const contract = await new this.web3.eth.Contract(abi, {
          from: this.web3.eth.defaultAccount,
          data: '0x' + code,
          gas: this.web3.utils.toHex(gasSupply),
          gasPrice: this.web3.utils.toHex(gasPrice)
        });
        return contract;
      } catch (e) {
        console.log(e);
        throw e;
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deploy(contract, params) {
    console.log('%c Deploying contract... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');

    class ContractInstance extends EventEmitter {}

    const contractInstance = new ContractInstance();

    try {
      params = params.map(param => {
        return param.type.endsWith('[]') ? param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',') : param.value;
      });
      contract.deploy({
        arguments: params
      }).send({
        from: this.web3.eth.defaultAccount
      }).on('transactionHash', transactionHash => {
        contractInstance.emit('transactionHash', transactionHash);
      }).on('receipt', txReceipt => {
        contractInstance.emit('receipt', txReceipt);
      }).on('confirmation', confirmationNumber => {
        contractInstance.emit('confirmation', confirmationNumber);
      }).on('error', error => {
        contractInstance.emit('error', error);
      }).then(instance => {
        contractInstance.emit('address', instance.options.address);
        contractInstance.emit('instance', instance);
      });
      return contractInstance;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async call(_ref2) {
    let args = _extends({}, _ref2);

    console.log('%c Web3 calling functions... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
    const coinbase = args.coinbase;
    const password = args.password;
    const contract = args.contract;
    const abiItem = args.abiItem;
    var params = args.params || [];
    this.web3.eth.defaultAccount = coinbase;

    try {
      // Prepare params for call
      params = params.map(param => {
        if (param.type.endsWith('[]')) {
          return param.value.search(', ') > 0 ? param.value.split(', ') : param.value.split(',');
        }

        if (param.type.indexOf('int') > -1) {
          return new this.web3.utils.BN(param.value);
        }

        return param.value;
      }); // Handle fallback

      if (abiItem.type === 'fallback') {
        if (password) {
          await this.web3.eth.personal.unlockAccount(coinbase, password);
        }

        const result = await this.web3.eth.sendTransaction({
          from: coinbase,
          to: contract.options.address,
          value: abiItem.payableValue || 0
        });
        return result;
      }

      if (abiItem.constant === false || abiItem.payable === true) {
        if (password) {
          await this.web3.eth.personal.unlockAccount(coinbase, password);
        }

        if (params.length > 0) {
          const result = await contract.methods[abiItem.name](...params).send({
            from: coinbase,
            value: abiItem.payableValue
          });
          return result;
        }

        const result = await contract.methods[abiItem.name]().send({
          from: coinbase,
          value: abiItem.payableValue
        });
        return result;
      }

      if (params.length > 0) {
        const result = await contract.methods[abiItem.name](...params).call({
          from: coinbase
        });
        return result;
      }

      const result = await contract.methods[abiItem.name]().call({
        from: coinbase
      });
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async send(to, amount, password) {
    return new Promise((resolve, reject) => {
      try {
        const coinbase = this.web3.eth.defaultAccount;

        if (password) {
          this.web3.eth.personal.unlockAccount(coinbase, password);
        }

        this.web3.eth.sendTransaction({
          from: coinbase,
          to: to,
          value: amount
        }).on('transactionHash', txHash => {
          this.showTransaction({
            head: 'Transaction hash:',
            data: txHash
          });
        }).then(txRecipt => {
          resolve(txRecipt);
        }).catch(e => {
          reject(e);
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
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
    if (paramObject.type.endsWith('[]')) {
      return paramObject.value.split(',').map(val => this.web3.utils.toHex(val.trim()));
    }

    return this.web3.utils.toHex(paramObject.value);
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

  showOutput(_ref3) {
    let args = _extends({}, _ref3);

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

  showTransaction(_ref4) {
    let args = _extends({}, _ref4);

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
    try {
      const transaction = await this.web3.eth.getTransaction(txHash);
      const transactionRecipt = await this.web3.eth.getTransactionReceipt(txHash);
      return {
        transaction,
        transactionRecipt
      };
    } catch (e) {
      throw e;
    }
  } // Gas Limit


  async getGasLimit() {
    try {
      const block = await this.web3.eth.getBlock('latest');
      return block.gasLimit;
    } catch (e) {
      throw e;
    }
  }

  async getAccounts() {
    try {
      return await this.web3.eth.getAccounts();
    } catch (e) {
      throw e;
    }
  }

  async getMining() {
    try {
      return await this.web3.eth.isMining();
    } catch (e) {
      throw e;
    }
  }

  async getHashrate() {
    try {
      return await this.web3.eth.getHashrate();
    } catch (e) {
      throw e;
    }
  }

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
const setAccounts = ({
  accounts
}) => {
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

      const contract = await this.helpers.create({
        coinbase,
        password,
        atAddress,
        abi,
        bytecode,
        contractName,
        gas
      });
      this.props.setInstance({
        contractName,
        instance: Object.assign({}, contract)
      });

      if (!atAddress) {
        const contractInstance = await this.helpers.deploy(contract, params);
        this.props.setDeployed({
          contractName,
          deployed: true
        });
        contractInstance.on('address', address => {
          contract.options.address = address;
          this.props.setInstance({
            contractName,
            instance: Object.assign({}, contract)
          });
        });
        contractInstance.on('transactionHash', transactionHash => {
          contract.transactionHash = transactionHash;
          this.props.setInstance({
            contractName,
            instance: Object.assign({}, contract)
          });
        });
        contractInstance.on('error', error => {
          this.helpers.showPanelError(error);
        });
        contractInstance.on('instance', instance => {
          instance.events.allEvents({
            fromBlock: 'latest'
          }).on('logs', logs => {
            this.props.addNewEvents({
              payload: logs
            });
          }).on('data', data => {
            this.props.addNewEvents({
              payload: data
            });
          }).on('changed', changed => {
            this.props.addNewEvents({
              payload: changed
            });
          }).on('error', error => {
            console.log(error);
          });
        });
        contractInstance.on('error', error => {
          this.helpers.showPanelError(error);
        });
      } else {
        contract.options.address = atAddress;
        this.props.setDeployed({
          contractName,
          deployed: true
        });
        this.props.setInstance({
          contractName,
          instance: Object.assign({}, contract)
        });
        contract.events.allEvents({
          fromBlock: 'latest'
        }).on('logs', logs => {
          this.props.addNewEvents({
            payload: logs
          });
        }).on('data', data => {
          this.props.addNewEvents({
            payload: data
          });
        }).on('changed', changed => {
          this.props.addNewEvents({
            payload: changed
          });
        }).on('error', error => {
          console.log(error);
        });
      }
    } catch (e) {
      console.log(e);
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
  contractName: PropTypes.string
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

class ContractCompiled extends React.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.state = {
      estimatedGas: 9000000,
      ContractABI: props.interfaces[props.contractName].interface
    };
    this._handleGasChange = this._handleGasChange.bind(this);
    this._handleInput = this._handleInput.bind(this);
  }

  async componentDidMount() {
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
      console.log(e);
      this.helpers.showPanelError(e);
    }
  }

  _handleGasChange(event) {
    this.setState({
      estimatedGas: event.target.value
    });
  }

  _handleInput() {
    const {
      contractName
    } = this.props;
    const {
      ContractABI
    } = this.state;
    this.props.addInterface({
      contractName,
      ContractABI
    });
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
  contractName: PropTypes.string,
  addInterface: PropTypes.func,
  bytecode: PropTypes.string,
  index: PropTypes.number
};

const mapStateToProps$3 = ({
  account,
  contract
}) => {
  const {
    compiled,
    interfaces
  } = contract;
  const {
    coinbase
  } = account;
  return {
    compiled,
    interfaces,
    coinbase
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
      interfaces
    } = this.props;
    const ContractABI = interfaces[contractName].interface;
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
      instances
    } = this.props;
    const contract = instances[contractName];

    try {
      const result = await this.helpers.call({
        coinbase,
        password,
        contract,
        abiItem
      });
      this.helpers.showOutput({
        address: contract.options.address,
        data: result
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
        instances
      } = this.props;
      const contract = instances[contractName];
      let params = [];

      for (let input of methodItem.inputs) {
        if (input.value) {
          params.push(input);
        }
      }

      const result = await this.helpers.call({
        coinbase,
        password,
        contract,
        abiItem: methodItem,
        params
      });
      this.helpers.showOutput({
        address: contract.options.address,
        data: result
      });
    } catch (e) {
      console.log(e);
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
  updateInterface: PropTypes.func
};

const mapStateToProps$4 = ({
  contract,
  account
}) => {
  const {
    compiled,
    interfaces,
    instances
  } = contract;
  const {
    coinbase,
    password
  } = account;
  return {
    compiled,
    interfaces,
    instances,
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
      instances,
      interfaces
    } = this.props;
    const contract = instances[contractName];
    const ContractABI = interfaces[contractName].interface;
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
    })))), contract.transactionHash && React.createElement("div", {
      id: contractName + '_txHash'
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Transaction hash:"), React.createElement("pre", {
      className: "large-code"
    }, contract.transactionHash)), !contract.options.address && React.createElement("div", {
      id: contractName + '_stat'
    }, React.createElement("span", {
      className: "stat-mining stat-mining-align"
    }, "waiting to be mined"), React.createElement("span", {
      className: "loading loading-spinner-tiny inline-block stat-mining-align"
    })), contract.options.address && React.createElement("div", {
      id: contractName + '_stat'
    }, React.createElement("span", {
      className: "inline-block highlight"
    }, "Mined at:"), React.createElement("pre", {
      className: "large-code"
    }, contract.options.address)), ContractABI.map((abi, i) => {
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
  interfaces: PropTypes.object
};

const mapStateToProps$5 = ({
  contract
}) => {
  const {
    interfaces,
    instances
  } = contract;
  return {
    interfaces,
    instances
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
      txAnalysis: undefined,
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
      pendingTransactions
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
    })), this.state.txAnalysis && this.state.txAnalysis.transaction && React.createElement("div", {
      className: "block"
    }, React.createElement("h2", {
      className: "block highlight-info tx-header"
    }, "Transaction"), React.createElement(ReactJson, {
      src: this.state.txAnalysis.transaction,
      theme: "chalk",
      displayDataTypes: false,
      name: false,
      collapseStringsAfterLength: 64,
      iconStyle: "triangle"
    })), this.state.txAnalysis && this.state.txAnalysis.transactionRecipt && React.createElement("div", {
      className: "block"
    }, React.createElement("h2", {
      className: "block highlight-info tx-header"
    }, "Transaction receipt"), React.createElement(ReactJson, {
      src: this.state.txAnalysis.transactionRecipt,
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
  pendingTransactions: PropTypes.array
};

const mapStateToProps$8 = ({
  eventReducer
}) => {
  const {
    pendingTransactions
  } = eventReducer;
  return {
    pendingTransactions
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
        console.log(e);
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

class NodeControl extends React.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.state = {
      wsProvider: Object.is(props.web3.currentProvider.constructor, Web3.providers.WebsocketProvider),
      httpProvider: Object.is(props.web3.currentProvider.constructor, Web3.providers.HttpProvider),
      connected: props.web3.currentProvider.connected,
      toAddress: '',
      amount: 0,
      rpcAddress: atom.config.get('etheratom.rpcAddress'),
      websocketAddress: atom.config.get('etheratom.websocketAddress')
    };
    this._refreshSync = this._refreshSync.bind(this);
    this.getNodeInfo = this.getNodeInfo.bind(this);
    this._handleToAddrrChange = this._handleToAddrrChange.bind(this);
    this._handleSend = this._handleSend.bind(this);
    this._handleAmountChange = this._handleAmountChange.bind(this);
    this._handleWsChange = this._handleWsChange.bind(this);
    this._reconnect = this._reconnect.bind(this);
  }

  async componentDidMount() {
    this.getNodeInfo();
  }

  async _refreshSync() {
    const accounts = await this.helpers.getAccounts();
    this.props.setAccounts({
      accounts
    });
    this.getNodeInfo();
  }

  async getNodeInfo() {
    // get sync status
    const syncStat = await this.helpers.getSyncStat();
    this.props.setSyncStatus(syncStat); // get mining status

    const mining = await this.helpers.getMining();
    this.props.setMining(mining); // get hashrate

    const hashRate = await this.helpers.getHashrate();
    this.props.setHashrate(hashRate);
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
    this.setState({
      websocketAddress: event.target.value
    });
  }

  _reconnect() {// TODO: set addresses & reconnect web3

    /* const { websocketAddress, rpcAddress } = this.state;
    atom.config.set('etheratom.rpcAddress', rpcAddress);
    atom.config.set('etheratom.websocketAddress', websocketAddress); */
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
      const txRecipt = await this.helpers.send(toAddress, amount, password);
      this.helpers.showTransaction({
        head: 'Transaction recipt:',
        data: txRecipt
      });
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
    }, React.createElement("button", {
      className: wsProvider && connected ? 'btn btn-success' : 'btn btn-error'
    }, "WS"), React.createElement("input", {
      type: "string",
      placeholder: "Address",
      className: "input-text",
      value: websocketAddress,
      disabled: true,
      onChange: this._handleWsChange
    })), React.createElement("li", {
      className: "list-item"
    }, React.createElement("button", {
      className: httpProvider && connected ? 'btn btn-success' : 'btn btn-error'
    }, "RPC"), React.createElement("input", {
      type: "string",
      placeholder: "Address",
      className: "input-text",
      disabled: true,
      value: rpcAddress
    })), React.createElement("li", {
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
  web3: PropTypes.any.isRequired,
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

const mapStateToProps$b = ({
  account,
  node
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
  return {
    coinbase,
    password,
    status,
    syncing,
    mining,
    hashRate
  };
};

var NodeControl$1 = reactRedux.connect(mapStateToProps$b, {
  setAccounts,
  setSyncStatus,
  setMining,
  setHashrate
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
    }), analysis.length > 0 && analysis.map(a => {
      if (a.report.length > 0) {
        return React.createElement("div", {
          className: "padded"
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
  helpers: PropTypes.any.isRequired
};

const mapStateToProps$c = ({
  contract
}) => {
  const {
    compiled
  } = contract;
  return {
    compiled
  };
};

var StaticAnalysis$1 = reactRedux.connect(mapStateToProps$c, {})(StaticAnalysis);

class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.web3 = props.web3;
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
    })), React.createElement(reactTabs.TabPanel, null, React.createElement(Events$1, {
      store: this.props.store,
      helpers: this.helpers
    })), React.createElement(reactTabs.TabPanel, null, React.createElement(NodeControl$1, {
      store: this.props.store,
      helpers: this.helpers,
      web3: this.web3
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
  web3: PropTypes.any.isRequired,
  helpers: PropTypes.any.isRequired,
  store: PropTypes.any.isRequired,
  pendingTransactions: PropTypes.array,
  events: PropTypes.array
};

const mapStateToProps$d = ({
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

var TabView$1 = reactRedux.connect(mapStateToProps$d, {})(TabView);

class CoinbaseView extends React.Component {
  constructor(props) {
    super(props);
    this.helpers = props.helpers;
    this.web3 = props.web3;
    this.state = {
      coinbase: props.accounts[0],
      balance: 0.00,
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
    this.web3.eth.defaultAccount = coinbase;
    const balance = await this.helpers.getBalance(coinbase);
    this.setState({
      balance
    });
  }

  _linkClick(event) {
    const {
      coinbase
    } = this.state;
    atom.clipboard.write(coinbase);
  }

  async _handleAccChange(event) {
    const coinbase = event.target.value;
    this.web3.eth.defaultAccount = coinbase;
    const balance = await this.helpers.getBalance(coinbase);
    this.props.setCoinbase(coinbase);
    this.setState({
      coinbase,
      balance
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

    if (password.length > 0) {
      this.props.setPassword({
        password
      });
      this.props.setCoinbase(coinbase); // TODO: Set web3.eth.defaultAccount on unlock

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
    const balance = await this.helpers.getBalance(coinbase);
    this.setState({
      balance
    });
  }

  render() {
    const {
      balance,
      password
    } = this.state;
    const {
      accounts
    } = this.props;
    return React.createElement("div", {
      className: "content"
    }, React.createElement("div", {
      className: "row"
    }, React.createElement("div", {
      className: "icon icon-link btn copy-btn btn-success",
      onClick: this._linkClick
    }), React.createElement("select", {
      onChange: this._handleAccChange,
      value: this.state.coinbase
    }, accounts.map((account, i) => {
      return React.createElement("option", {
        key: i,
        value: account
      }, account);
    })), React.createElement("button", {
      onClick: this._refreshBal,
      className: "btn"
    }, balance, " ETH")), React.createElement("form", {
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
      className: this.state.unlock_style,
      value: "Unlock"
    })));
  }

}

CoinbaseView.propTypes = {
  web3: PropTypes.any.isRequired,
  helpers: PropTypes.any.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.string),
  setCoinbase: PropTypes.any,
  setPassword: PropTypes.any
};

const mapStateToProps$e = ({
  account
}) => {
  const {
    coinbase,
    password,
    accounts
  } = account;
  return {
    coinbase,
    password,
    accounts
  };
};

var CoinbaseView$1 = reactRedux.connect(mapStateToProps$e, {
  setCoinbase,
  setPassword
})(CoinbaseView);

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

const mapStateToProps$f = ({
  contract
}) => {
  const {
    compiling
  } = contract;
  return {
    compiling
  };
};

var CompileBtn$1 = reactRedux.connect(mapStateToProps$f, {})(CompileBtn);

class View {
  constructor(store, web3) {
    this.Accounts = [];
    this.coinbase = null;
    this.web3 = web3;
    this.store = store;
    this.helpers = new Web3Helpers(this.web3);
  }

  async createCoinbaseView() {
    try {
      const accounts = await this.web3.eth.getAccounts();
      this.store.dispatch({
        type: SET_ACCOUNTS,
        payload: accounts
      });
      this.store.dispatch({
        type: SET_COINBASE,
        payload: accounts[0]
      });
      ReactDOM.render(React.createElement(CoinbaseView$1, {
        store: this.store,
        helpers: this.helpers,
        web3: this.web3
      }), document.getElementById('accounts-list'));
    } catch (e) {
      console.log(e);
      this.helpers.showPanelError('No account exists! Please create one.');
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
      helpers: this.helpers,
      web3: this.web3
    }), document.getElementById('tab_view'));
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
    this.compileSubscriptions = new atom$1.CompositeDisposable();
    this.store = store;
    this.subscribeToWeb3Commands();
    this.subscribeToWeb3Events();
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

    const rpcAddress = atom.config.get('etheratom.rpcAddress');
    const websocketAddress = atom.config.get('etheratom.websocketAddress');

    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      this.web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(rpcAddress));

      if (websocketAddress) {
        this.web3.setProvider(new Web3.providers.WebsocketProvider(websocketAddress));
      }

      this.helpers = new Web3Helpers(this.web3, this.store);
    }

    this.view = new View(this.store, this.web3);

    if (Object.is(this.web3.currentProvider.constructor, Web3.providers.WebsocketProvider)) {
      console.log('%c Provider is websocket. Creating subscriptions... ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B'); // newBlockHeaders subscriber

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

      this.web3.eth.subscribe('pendingTransactions').on('data', transaction => {
        /*console.log("%c pendingTransactions:data ", 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        console.log(transaction);*/
        this.store.dispatch({
          type: ADD_PENDING_TRANSACTION,
          payload: transaction
        });
      }).on('error', e => {
        console.log('%c pendingTransactions:error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        console.log(e);
      }); // syncing subscription

      this.web3.eth.subscribe('syncing').on('data', sync => {
        console.log('%c syncing:data ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        console.log(sync);

        if (typeof sync === 'boolean') {
          this.store.dispatch({
            type: SET_SYNCING,
            payload: sync
          });
        }

        if (typeof sync === 'object') {
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
        }
      }).on('changed', isSyncing => {
        console.log('%c syncing:changed ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        console.log(isSyncing);
      }).on('error', e => {
        console.log('%c syncing:error ', 'background: rgba(36, 194, 203, 0.3); color: #EF525B');
        console.log(e);
      });
    }

    this.checkConnection((error, connection) => {
      if (error) {
        this.helpers.showPanelError(error);
      } else if (connection) {
        this.view.createCoinbaseView();
        this.view.createButtonsView();
        this.view.createTabView();
      }
    });
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


  checkConnection(callback) {
    let haveConn;
    haveConn = this.web3.currentProvider;

    if (!haveConn) {
      return callback(new Error('Error could not connect to local geth instance!'), null);
    } else {
      return callback(null, true);
    }
  }

  async setSources(editor) {
    const filePath = editor.getPath();
    const filename = filePath.replace(/^.*[\\/]/, '');

    if (filePath.split('.').pop() == 'sol') {
      const dir = path.dirname(filePath);
      var sources = {};
      sources[filename] = {
        content: editor.getText()
      };
      const pkgPath = atom.packages.resolvePackagePath('etheratom');
      const task = atom$1.Task.once(`${pkgPath}/lib/helpers/import-task.js`, dir, sources);
      task.on('error', error => {
        atom.notifications.addError(error);
      });
      task.on('combinedSources', combinedSources => {
        sources = combinedSources;
        this.store.dispatch({
          type: SET_SOURCES,
          payload: sources
        });
      });
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
        const gasLimit = await this.helpers.getGasLimit();
        this.store.dispatch({
          type: SET_GAS_LIMIT,
          payload: gasLimit
        });
      } catch (e) {
        console.log(e);
        this.helpers.showPanelError(e);
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
  instances: null,
  gasLimit: 0
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

    case SET_GAS_LIMIT:
      return _objectSpread({}, state, {
        gasLimit: action.payload
      });

    default:
      return state;
  }
});

const INITIAL_STATE$2 = {
  coinbase: null,
  password: false,
  accounts: []
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
  events: []
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

    default:
      return state;
  }
});

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

const INITIAL_STATE$5 = {
  clients: [{
    provider: 'web3',
    desc: 'Backend ethereum node'
  }]
};
var ClientReducer = ((state = INITIAL_STATE$5, action) => {
  switch (action.type) {
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
