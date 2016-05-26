phetch
======

__phetch__ is a light wrapper around [isomorphic fetch](https://github.com/matthew-andrews/isomorphic-fetch) ([fetch](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch)) that allows request generation via the chaining of methods calls instead of bloating methods with crafting initialization or configuration objects.

```javascript
  phetch
    .post('/api/accounts')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authentication', 'Bearer QWxhZGRpbjpPcGVuU2VzYW1l')
    .json({ email: 'john.doe@example.com', password: '********' })
    .then((res) => res.json())
    .then((json) => console.log(json));
```

### Basics

A request is initiated by providing the HTTP method and URL to the exported `phetch` function.

```javascript
  const req = phetch('GET', '/api/accounts');
```

Or by calling one of the decorated methods (`get`, `put`, `post`, `patch`, `delete`, `head`)
on the exported `phetch` function with a URL.

```javascript
  const req = phetch.get('/api/accounts');
```

And executed by providing a callback function to the chainable `#then()` method.

```javascript
  req
    .then((res) => /* ... */ );
```

### Headers

Setting headers on a request can be achieved in three ways, firstly via a call to `#header()`.

```javascript
  req
    .header('Content-Type', 'application/json');
```

Next, multiple headers can be set by providing an object of mapped header names to their values
to a call to `#headers()`

```javascript
  req
    .headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authentication': 'Bearer QWxhZGRpbjpPcGVuU2VzYW1l'
    });
```

Lastly, either format of the previous two calls can be provided to the `#set()` method.

```javascript
  req
    .set('Content-Type', 'application/json');
    .set({
      'Accept': 'application/json',
      'Authentication': 'Bearer QWxhZGRpbjpPcGVuU2VzYW1l'
    })
```

### Querystring

Querystrings can be passed along with `GET` requests two ways, firstly via a call to `#query()`
with key an value.

```javascript
  req
    .query('email', 'john.doe@example.com'); // api/accounts?email=john.doe%40xample.com
```

Or by providing an object of mapped parameters to values.

```javascript
  req
    .query({
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe'
    });
```

### Body

A body can be provided to send along with the request via the `#form()` (accepted a DOM node
pointing to a HTML form), or a javascript object via the `#json()` method.

```javascript
  req
    .form(document.querySelector('.create-account-form'));

  // OR ...

  req.
    .json({ email: 'john.doe@example.com', password: '********' });
```

### Additional Methods

###### `#mode()`

Sets the mode you want to use for the request, e.g., `cors`, `no-cors`, or `same-origin`.

###### `#credentials()`

Sets the request credentials you want to use for the request, e.g., `omit`, `same-origin`, or
`include`.

###### `#cache()`

Sets the cache mode you want to use for the request, e.g., `default`, `no-store`,
`reload`, `no-cache`, `force-cache`, or `only-if-cached`.

###### `#redirect()`

Sets the redirect mode to use, e.g., `follow`, `error`, or `manual`.

###### `#referrer()`

Sets the referrer to send with the request, specifying `no-referrer`, `client`, or a URL.

###### `#integrity()`

Sets the subresource integrity value of the request, e.g.,
`sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=`.

### License

> The MIT License (MIT)

> Copyright (c) 2016 Chuck Preslar

> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
