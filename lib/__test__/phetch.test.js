import phetch from '../phetch';
import Phetch from '../phetch/phetch';

describe('phetch', () => {
  it('is exported as a function', () => {
    expect(typeof phetch).toBe('function');
  });

  it('returns an instance of `Phetch` class when invoked', () => {
    expect(phetch() instanceof Phetch).toBe(true);
  });

  describe('phetch.METHODS', () => {
    it('is an array', () => {
      expect(Array.isArray(phetch.METHODS)).toBe(true);
    });

    it('decorates phetch with lowercase assistance function for each entry', () => {
      phetch.METHODS.forEach(m => {
        expect(typeof phetch[m.toLowerCase()]).toBe('function');
      });
    });
  });
});
