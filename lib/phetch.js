require("babel-core/register");
require("babel-polyfill");
require('isomorphic-fetch');

import Phetch from './phetch/phetch';

function phetch(method, url) {
  return new Phetch(method, url);
}

phetch.METHODS = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
phetch.METHODS.forEach(m => { phetch[m.toLowerCase()] = (url) => { phetch(m, url); }});

export default phetch;
