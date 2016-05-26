import fetch from 'isomorphic-fetch';

// Properties to provide values for to a Request's init parameter.
const inits   = ['method', 'mode', 'credentials', 'cache', 'redirect',
                 'referrer', 'integrity', 'headers', 'body'];
// Common HTTP request methods.
const methods = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'];

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
   * Sets a single header to send along with request.
   *
   * @public
   * @param {String} name - Name of the header to set.
   * @param {*} value - Value to pair with header name.
   * @returns {Phetch}
   */
  header(name, value) {
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
  headers(headers) {
    for (const header in headers) {
      this.header(header, headers[header]);
    }

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
   * Sets the body of the request to an instance of FormData based on the Node provided.
   *
   * @public
   * @param {Node} form - The DOM Node which form data can be collected from.
   * @returns {Phetch}
   */
  form(form) {
    this.__body = new FormData(form);
    return this;
  }

  /**
   * Sets the body of the request to a JSON string.
   *
   * @public
   * @param {*} json - The value to stringify.
   * @returns {Phetch}
   */
  json(json) {
    this.__body = JSON.stringify(json);
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
  then(fn) {
    return fetch(new Request(this.__url, this.__inits)).then(fn);
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
