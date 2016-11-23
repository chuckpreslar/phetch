require("babel-core/register");
require("babel-polyfill");
require('isomorphic-fetch');

export default class Phetch {
  /**
   * @param {String} method - the HTTP method for the request.
   * @param {String} url - the URL for the request.
   *
   * @constructor
   */
  constructor(method, url) {
    this._method    = method;
    this._url       = url;
    this._query     = {};
    this._headers   = {};
    this._body      = null;
    this._mode      = null;
    this._cache     = null;
    this._redirect  = null;
    this._referrer  = null;
    this._integrity = null;
  }

  /**
   * @param {String} method - the HTTP method for the request.
   * @return {Phetch}
   *
   * @public
   */
  via(method) {
    this._method = method;
    return this;
  }

  /**
   * @param {String} name - the name of the header to set.
   * @param {String} value - the value of the header to set.
   * @return {Phetch}
   *
   * @public
   */
  set(name, value) {
    this._headers[name] = value;
    return this;
  }

  /**
   * @param {String} mode - the mode to use with the request.
   * @return {Phetch}
   *
   * @public
   */
  mode(mode) {
    this._mode = mode;
    return this;
  }

  /**
   * @param {String} cache - the cache strategy to use with request.
   * @return {Phetch}
   *
   * @public
   */
  cache(cache) {
    this._cache = cache;
    return this;
  }

  /**
   * @param {String} redirect - the redirect strategy to use with request.
   * @return {Phetch}
   *
   * @public
   */
  redirect(redirect) {
    this._redirect = redirect;
    return this;
  }

  /**
   * @param {String} referrer - the referrer to send with request.
   * @return {Phetch}
   *
   * @public
   */
  referrer(referrer) {
    this._referrer = referrer;
    return this;
  }

  /**
   * @param {String} integrity - the subresource integrity value.
   * @return {Phetch}
   *
   * @public
   */
  integrity(integrity) {
    this._integrity = integrity;
    return this;
  }

  /**
   * @param {String} body - the raw body to send with the request.
   * @return {Phetch}
   *
   * @public
   */
  body(body) {
    this._body = body;
    return this;
  }

  async async() {
    return fetch(this._url, this.init);
  }

  /**
   *
   */
  get init() {
    return ['method', 'query', 'headers', 'body', 'mode',
      'cache', 'redirect', 'referrer', 'integrity'].reduce((object, property) => {
        const value = this[`_${property}`];
        if (typeof value !== 'undefined' && value !== null ) {
          if (typeof value === 'object' && Object.keys(value).length === 0) return object;

          const factory = Phetch.factories[property] || Phetch.factories.identity;
          object[property] = factory(value);
        }
        return object;
      }, {});
  }
}

Phetch.factories = {
  identity: (v) => {
    return v;
  },
  query: () => {
    return this.identity.apply(this, Array.from(arguments));
  },
  headers: (headers) => {
    return new Headers(headers);
  }
};
