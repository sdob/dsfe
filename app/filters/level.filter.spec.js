(function() {
  'use strict';
  beforeEach(module('divesites'));
  describe('levelFilter', () => {
    let levelFilter;
    beforeEach(inject((_levelFilter_) => {
      levelFilter = _levelFilter_;
    }));
    it(`should convert 0 to 'Beginner'`, () => {
      expect(levelFilter(0)).toBe('Beginner');
    });
    it(`should convert 1 to 'Intermediate'`, () => {
      expect(levelFilter(1)).toBe('Intermediate');
    });
    it(`should convert 2 to 'Advanced'`, () => {
      expect(levelFilter(2)).toBe('Advanced');
    });
    it(`should convert '0' to 'Beginner'`, () => {
      expect(levelFilter('0')).toBe('Beginner');
    });
    it(`should convert '1' to 'Intermediate'`, () => {
      expect(levelFilter('1')).toBe('Intermediate');
    });
    it(`should convert '2' to 'Advanced'`, () => {
      expect(levelFilter('2')).toBe('Advanced');
    });
  });
})();
