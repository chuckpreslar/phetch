import Phetch from '../phetch';

describe('Phetch', () => {
  let instance;

  beforeEach(() => {
    instance = new Phetch();
  });

  describe('#via', () => {
    it('sets `_method` property on an instance', () => {
      expect(instance.via('GET')._method).toBe('GET');
    });
  });

  describe('#set', () => {
    it('sets property within `_headers` object on an instance', () => {
      expect(Object.keys(instance.set('Content-Type', 'application/json')._headers).length).toBe(1);
    });
  })

  describe('#mode', () => {
    it('sets `_mode` property on an instance', () => {
      expect(instance.mode('cors')._mode).toBe('cors');
    });
  });

  describe('#cache', () => {
    it('sets `_cache` property on an instance', () => {
      expect(instance.cache('default')._cache).toBe('default');
    });
  });

  describe('#redirect', () => {
    it('sets `_redirect` property on an instance', () => {
      expect(instance.redirect('follow')._redirect).toBe('follow');
    });
  });

  describe('#referrer', () => {
    it('sets `_referrer` property on an instance', () => {
      expect(instance.referrer('client')._referrer).toBe('client');
    });
  });

  describe('#integrity', () => {
    it('sets `_integrity` property on an instance', () => {
      expect(instance.integrity('sha256')._integrity).toBe('sha256');
    });
  });

  describe('#body', () => {
    it('sets `_body` property on an instance', () => {
      expect(instance.body('some=value')._body).toBe('some=value');
    });
  });

  describe('#init', () => {
    it('returns fetch initialization object', () => {
      const init = instance.body('some=value').init;
      expect(Object.keys(init).length).toBe(1);
      expect(Object.keys(init)).toContain('body');
    });
  });

  describe('#async', async () => {
    it('works with async/await', async () => {
      const res  = await (new Phetch('GET', 'https://www.google.com')).async();
      expect(res.ok).toBe(true);
    })
  });
});
