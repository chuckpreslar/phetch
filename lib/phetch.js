'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

require('whatwg-fetch');

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('es6-promise').polyfill();

// Properties to provide values for to a Request's init parameter.
var inits = ['method', 'mode', 'credentials', 'cache', 'redirect', 'referrer', 'integrity', 'headers', 'body'];
// Common HTTP request methods.
var methods = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'];

/**
 * Serializes a javascript object into a HTTP querystring.
 *
 * @private
 * @param {String} o - The object to serialize into a querystring.
 * @returns {String}
 */
function serialize(o) {
  if ('object' !== (typeof o === 'undefined' ? 'undefined' : _typeof(o))) return o;

  var p = [];

  for (var k in o) {
    generate(p, k, o[k]);
  }

  return p.join('&');
}

/**
 * Method to assist in generate querystrings from javascript objects.
 *
 * @private
 * @param {Array} p - Array used to store paired key values.
 * @param {String} k - Current key being iterated over via serialize.
 * @param {*} v - Current value being iterated over via serialize.
 */
function generate(p, k, v) {
  if (Array.isArray(v)) {
    for (var i = 0, il = v.length; i < il; i++) {
      generate(p, k, v[i]);
    }

    return;
  } else if ('object' === (typeof v === 'undefined' ? 'undefined' : _typeof(v))) {
    for (var s in v) {
      generate(p, k + ('[' + s + ']'), v[s]);
    }

    return;
  }

  p.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
}

var Phetch = function () {
  /**
   * Called when Phetch class is instantiated.
   *
   * @constructor
   * @private
   * @param {String} method - HTTP method to issue request on.
   * @param {String} url - URL to issue request to.
   */

  function Phetch(method, url) {
    var _this = this;

    _classCallCheck(this, Phetch);

    inits.forEach(function (i) {
      _this['__' + i] = null;
    });

    this.__method = method;
    this.__url = url;
    this.__query = new Object();
    this.__headers = new Headers();
  }

  /**
   * Sets the HTTP method to issue request on.
   *
   * @public
   * @param {String} method - HTTP method to issue request on.
   * @returns {Phetch}
   */


  _createClass(Phetch, [{
    key: 'via',
    value: function via(method) {
      this.__method = method.toUpperCase();
      return this;
    }

    /**
     * Sets a single header to send along with request.
     *
     * @public
     * @param {String} name - Name of the header to set.
     * @param {*} value - Value to pair with header name.
     * @returns {Phetch}
     */

  }, {
    key: 'header',
    value: function header(name, value) {
      this.__headers.set(name, value);
      return this;
    }

    /**
     * Sets multiple headers to send along with request.
     *
     * @public
     * @param {Object} headers - Map of header names to their values.
     * @returns {Phetch}
     */

  }, {
    key: 'headers',
    value: function headers(_headers) {
      return this.__mapped(this.header, _headers);
    }

    /**
     * Alias method to set headers, calling `#headers()` if a single argument is provided
     * and is an object, or `#header()` if a pair of arguments are provided.
     *
     * @public
     * @param {*} - Investigated to determine which method to call.
     * @returns {Phetch}
     */

  }, {
    key: 'set',
    value: function set() {
      if (1 === arguments.length) {
        return this.headers(arguments[0]);
      }

      return this.header(arguments[0], arguments[1]);
    }

    /**
     * Sets a single querystring parameter to send along with request.
     *
     * @public
     * @param {String} name - Name of the querystring parameter to set.
     * @param {*} value - Value of the querystring parameter to set.
     */

  }, {
    key: 'query',
    value: function query(name, value) {
      if (1 === arguments.length) {
        return this.__mapped(this.query, arguments[0]);
      }

      this.__query[name] = value;
      return this;
    }

    /**
     * Sets the mode you want to use for the request, e.g., cors, no-cors, or same-origin.
     *
     * @public
     * @param {String} mode - The mode you want to use for the request.
     * @returns {Phetch}
     */

  }, {
    key: 'mode',
    value: function mode(_mode) {
      this.__mode = _mode;
      return this;
    }

    /**
     * Sets the request credentials you want to use for the request, e.g., omit,
     * same-origin, or include.
     *
     * @public
     * @param {String} credentials - The request credentials you want to use for the request.
     * @returns {Phetch}
     */

  }, {
    key: 'credentials',
    value: function credentials(_credentials) {
      this.__credentials = _credentials;
      return this;
    }

    /**
     * Sets the cache mode you want to use for the request, e.g., default, no-store,
     * reload, no-cache, force-cache, or only-if-cached.
     *
     * @public
     * @param {String} cache - The cache mode you want to use for the request.
     * @returns {Phetch}
     */

  }, {
    key: 'cache',
    value: function cache(_cache) {
      this.__cache = _cache;
      return this;
    }

    /**
     * Sets the redirect mode to use, e.g., follow, error, or manual.
     *
     * @public
     * @param {String} redirect - The redirect mode to use.
     * @returns {Phetch}
     */

  }, {
    key: 'redirect',
    value: function redirect(_redirect) {
      this.__redirect = _redirect;
      return this;
    }

    /**
     * Sets the referrer to send with the request, specifying no-referrer, client,
     * or a URL. The default is client.
     *
     * @public
     * @param {String} referrer - The referrer to send along with the request.
     * @returns {Phetch}
     */

  }, {
    key: 'referrer',
    value: function referrer(_referrer) {
      this.__referrer = _referrer;
      return this;
    }

    /**
     * Sets the subresource integrity value of the request,
     * e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=.
     *
     * @public
     * @param {String} integrity - The subresource integrity value.
     * @returns {Phetch}
     */

  }, {
    key: 'integrity',
    value: function integrity(_integrity) {
      this.__integrity = _integrity;
      return this;
    }

    /**
     * Sets the body of the request to an instance of FormData based on the DOM Node provided.
     *
     * @public
     * @param {Node} form - The DOM Node which form data can be collected from.
     * @returns {Phetch}
     */

  }, {
    key: 'form',
    value: function form(_form) {
      this.__body = new FormData(_form);
      return this;
    }

    /**
     * Sets the body of the request to a JSON string. If a DOM Node node is provided, a JSON
     * object will be created from its inputs.
     *
     * @public
     * @param {*} json - The value to stringify.
     * @returns {Phetch}
     */

  }, {
    key: 'json',
    value: function json(_json) {
      if ('undefined' !== typeof Node && _json instanceof Node) {
        var form = new FormData(_json);
        var obj = new Object();

        if ('function' === typeof form.keys) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = form.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var input = _step.value;

              obj[input] = form.get(input);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          this.__json(obj, _json.querySelectorAll('input'));
        }
      }

      this.__body = JSON.stringify(_json);
      return this;
    }

    /**
     * Crafts a Request instance to provide to fetch, returning its Promise
     * after supplying the `fn` function argument to `#then()`.
     *
     * @public
     * @param {Function} fn - The function to provide as the first `#then()` callback.
     * @returns {Promise}
     */

  }, {
    key: 'then',
    value: function then(fn) {
      return (0, _isomorphicFetch2.default)(new Request(this.__url + this.__querystring, this.__inits)).then(fn);
    }

    /**
     * Loops over an object, calling the `fn` argument with each properties name and value.
     *
     * @private
     * @param {Function} fn - The function to provided mapped object data.
     * @param {Object} obj - The object to loop over.
     * @returns {Phetch}
     */

  }, {
    key: '__mapped',
    value: function __mapped(fn, obj) {
      for (var property in obj) {
        fn.call(this, property, obj[property]);
      }

      return this;
    }

    /**
     * Attempt to polyfil FormData.keys().
     *
     * @private
     * @param {Object} obj - The object to store name/value pairs within.
     * @param {[]Node} inputs - Form inputs to pull name/value pairs from.
     */

  }, {
    key: '__json',
    value: function __json(obj, inputs) {
      for (var i = 0, il = inputs.length; i < il; i++) {
        obj[inputs[i].name] = inputs[i].value;
      }
    }

    /**
     * Private getter used to format the querystring for the fetch request.
     *
     * @private
     * @returns {String}
     */

  }, {
    key: '__querystring',
    get: function get() {
      if ('GET' !== this.__method) return '';
      var s = serialize(this.__query);
      if (0 < s.length) return '?' + s;
      return '';
    }

    /**
     * Private getter used to collect initialized `init` data to provide to the
     * fetch request.
     *
     * @private
     * @returns {Object}
     */

  }, {
    key: '__inits',
    get: function get() {
      var _this2 = this;

      return inits.reduce(function (o, i) {
        var v = _this2['__' + i];

        if (null === v) return o;
        if ('undefined' === typeof v) return o;

        o[i] = v;
        return o;
      }, {});
    }
  }]);

  return Phetch;
}();

/**
 * Creates an instance of the Phetch class, providing the url and method arguments
 * as parameters to its constructor.
 *
 * @public
 * @param {String} [method=GET] - HTTP method to issue request on.
 * @param {String} url - URL to issue request to.
 * @returns {Phetch}
 */


function phetch(method, url) {
  if (1 === arguments.length) {
    url = method;
    method = 'GET';
  }

  return new Phetch(method, url);
}

// Decorate phetch with helpers for generating requests based on common
// HTTP request methods.
methods.forEach(function (method) {
  phetch[method.toLowerCase()] = function (url) {
    return phetch(method, url);
  };
});

exports.default = phetch;