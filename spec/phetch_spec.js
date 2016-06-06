import chai from 'chai';
import promised from 'chai-as-promised';
import nock from 'nock';

import phetch from '../src/phetch';

chai.use(promised);

const expect = chai.expect;

describe('phetch', function () {
  describe('#via()', function () {
    let instance;

    before(() => {
      instance = phetch('http://www.example.com');
    });

    it('sets method correctly', function () {
      instance.via('get');
      expect(instance.__method).to.eq('GET');
    });
  });

  describe('#mode()', function () {
    let instance;

    before(() => {
      instance = phetch.get('http://www.example.com');
    });

    it('sets mode correctly', function () {
      instance.mode('cors');

      expect(instance.__mode).to.eq('cors');
    });
  });

  describe('#credentials()', function () {
    let instance;

    before(() => {
      instance = phetch.get('http://www.example.com');
    });

    it('sets credentials correctly', function () {
      instance.credentials('omit');

      expect(instance.__credentials).to.eq('omit');
    });
  });

  describe('#cache()', function () {
    let instance;

    before(() => {
      instance = phetch.get('http://www.example.com');
    });

    it('sets cache correctly', function () {
      instance.cache('default');

      expect(instance.__cache).to.eq('default');
    });
  });

  describe('#redirect()', function () {
    let instance;

    before(() => {
      instance = phetch.get('http://www.example.com');
    });

    it('sets redirect correctly', function () {
      instance.redirect('follow');

      expect(instance.__redirect).to.eq('follow');
    });
  });

  describe('#referrer()', function () {
    let instance;

    before(() => {
      instance = phetch.get('http://www.example.com');
    });

    it('sets referrer correctly', function () {
      instance.referrer('no-referrer');

      expect(instance.__referrer).to.eq('no-referrer');
    });
  });

  describe('#integrity()', function () {
    let instance;

    before(() => {
      instance = phetch.get('http://www.example.com');
    });

    it('sets integrity correctly', function () {
      instance.integrity('sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=');

      expect(instance.__integrity).to.eq('sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=');
    });
  });


  describe('#set()', function () {
    let instance, headers;

    before(() => {
      instance = phetch.get('http://www.example.com');
      headers  = new Headers();
      instance.__headers = headers;

      instance.set('content-type', 'application/json');
    });

    it('sets single header correctly', function () {
      expect(headers.has('content-type')).to.be.true;
    });
  });

  describe('#set()', function () {
    let instance, headers;

    before(() => {
      instance = phetch.get('http://www.example.com');
      headers  = new Headers();
      instance.__headers = headers;

      instance.set({ 'content-type': 'application/json', 'authentication': 'bearer' });
    });

    it('sets multiple headers correctly', function () {
      expect(headers.has('content-type')).to.be.true;
      expect(headers.has('authentication')).to.be.true;
    });
  });

  describe('#json()', function() {
    let instance, json;

    before(() => {
      instance = phetch.get('http.example.com');
      json     = { hello: 'world' };
    });

    it('sets body correctly', function () {
      instance.json(json);

      expect(instance.__body).to.eq(JSON.stringify(json));
    });
  });

  describe('#then()', function (done) {
    before(() => {
      const reqheaders = { 'content-type': 'application/json' };
      nock('http://www.example.com', { reqheaders: reqheaders })
        .get('/')
        .reply(200);
    });

    it('executes request', function (done) {
      expect(phetch.get('http://www.example.com')
        .set('content-type', 'application/json')
        .promise()).to.eventually.notify(done);
    });
  });

  describe('#__querystring()', function () {
    let instance;

    before(() => {
      instance = phetch.get('http.example.com');
    });

    it('properly encodes querystring', function () {
      const result = instance.query('foo', 'bar').__querystring;
      expect(result).to.eq('?foo=bar');
    });
  });
});
