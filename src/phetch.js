require('es6-promise').polyfill();
require('isomorphic-fetch');

// Properties to provide values for to a Request's init parameter.
const inits   = ['method', 'mode', 'credentials', 'cache', 'redirect',
                 'referrer', 'integrity', 'headers', 'body'];
// Common HTTP request methods.
const methods = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'];

/**
 * Serializes a javascript object into a HTTP querystring.
 *
 * @private
 * @param {String} o - The object to serialize into a querystring.
 * @returns {String}
 */
function serialize (o) {
  if ('object' !== typeof o) return o;

  const p = [];

  for (const k in o) {
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
    for (let i = 0, il = v.length; i < il; i++) {
      generate(p, k, v[i]);
    }

    return;
  } else if ('object' === typeof v) {
    for (const s in v) {
      generate(p, k + `[${s}]`, v[s]);
    }

    return;
  }

  p.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
}

class Phetch {
  /**
   * Called when Phetch class is instantiated.
   *
   * @constructor
   * @private
   * @param {String} method - HTTP method to issue request on.
   * @param {String} url - URL to issue request to.
   */
  constructor(method, url) {
    inits.forEach((i) => { this['__' + i] = null; });

    this.__method  = method;
    this.__url     = url;
    this.__query   = new Object();
    this.__headers = new Headers();
  }

  /**
   * Sets the HTTP method to issue request on.
   *
   * @public
   * @param {String} method - HTTP method to issue request on.
   * @returns {Phetch}
   */
  via(method) {
    this.__method = method.toUpperCase();
    return this;
  }

  /**
   * If a single argument is provided and is typeof `object`, the argument
   * will be iterated over as a hash of key/values representing headers.
   * If two or more arguments are provided, the first argument will be
   * used as the header name, while remaining arguments joined and supplied
   * as its value.
   *
   * @public
   * @param {*} - Investigated to determine how method set header(s).
   * @returns {Phetch}
   */
  set() {
    if (1 === arguments.length) {
      return this.__mapped(this.set, arguments[0]);
    }

    const header = arguments[0];
    const value  = Array.prototype.slice.call(arguments, 0).splice(1).join(',');

    this.__headers.set(header, value);
    return this;
  }

  /**
   * Sets a single querystring parameter to send along with request.
   *
   * @public
   * @param {String} name - Name of the querystring parameter to set.
   * @param {*} value - Value of the querystring parameter to set.
   */
  query(name, value) {
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
  mode(mode) {
    this.__mode = mode;
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
  credentials(credentials) {
    this.__credentials = credentials;
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
  cache(cache) {
    this.__cache = cache;
    return this;
  }

  /**
   * Sets the redirect mode to use, e.g., follow, error, or manual.
   *
   * @public
   * @param {String} redirect - The redirect mode to use.
   * @returns {Phetch}
   */
  redirect(redirect) {
    this.__redirect = redirect;
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
  referrer(referrer) {
    this.__referrer = referrer;
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
  integrity(integrity) {
    this.__integrity = integrity;
    return this;
  }

  /**
   * Sets the body of the request to an instance of FormData based on the DOM Node provided.
   *
   * @public
   * @param {Node} form - The DOM Node which form data can be collected from.
   * @returns {Phetch}
   */
  form(form) {
    if (form instanceof FormData) {
      this.__body = form;
    } else {
      this.__body = new FormData(form);
    }

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
  json(json) {
    if ('undefined' !== typeof Node && json instanceof Node) {
      const node = json;
      const form = new FormData(node);
      const obj  = new Object();

      if ('function' === typeof form.keys) {
        for (const input of form.keys()) {
          obj[input] = form.get(input);
        }
      } else {
        this.__json(obj, node.querySelectorAll('input'));
      }
    }

    this.__body = JSON.stringify(json);
    return this;
  }

  /**
   * Crafts a Request instance to provide to fetch, returning its Promise
   *
   * @public
   * @returns {Promise}
   */
  promise() {
    return fetch(new Request(this.__url + this.__querystring, this.__inits));
  }

  /**
   * Creates the `fetch` Promise, supplying the `fn` argument to its `then` method.
   *
   * @public
   * @param {Function} fn - The function to provide as the first `#then()` callback.
   * @returns {Promise}
   */
  then(fn) {
    return this.promise().then(fn);
  }

  /**
   * Loops over an object, calling the `fn` argument with each properties name and value.
   *
   * @private
   * @param {Function} fn - The function to provided mapped object data.
   * @param {Object} obj - The object to loop over.
   * @returns {Phetch}
   */
  __mapped(fn, obj) {
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
  __json(obj, inputs) {
    for (let i = 0, il = inputs.length; i < il; i++) {
      obj[inputs[i].name] = inputs[i].value;
    }
  }

  /**
   * Private getter used to format the querystring for the fetch request.
   *
   * @private
   * @returns {String}
   */
  get __querystring() {
    if ('GET' !== this.__method) return '';
    const s = serialize(this.__query);
    if (0 < s.length) return `?${s}`;
    return '';
  }

  /**
   * Private getter used to collect initialized `init` data to provide to the
   * fetch request.
   *
   * @private
   * @returns {Object}
   */
  get __inits() {
    return inits.reduce((o, i) => {
      const v = this['__' + i];

      if (null === v) return o;
      if ('undefined' === typeof v) return o;

      o[i] = v;
      return o;
    }, {});
  }
}

/**
 * Creates an instance of the Phetch class, providing the url and method arguments
 * as parameters to its constructor.
 *
 * @public
 * @param {String} [method=GET] - HTTP method to issue request on.
 * @param {String} url - URL to issue request to.
 * @returns {Phetch}
 */
function phetch (method, url) {
  if (1 === arguments.length) {
    url    = method;
    method = 'GET';
  }

  return new Phetch(method, url);
}

// Decorate phetch with helpers for generating requests based on common
// HTTP request methods.
methods.forEach((method) => {
  phetch[method.toLowerCase()] = (url) => { return phetch(method, url); };
});

export default phetch;
