(function() {
  'use strict';
  beforeEach(module('divesites'));
  describe('durationFilter', () => {
    let durationFilter;
    beforeEach(inject((_durationFilter_) => {
      durationFilter = _durationFilter_;
    }));
    it('should convert times of less than one hour to a number of minutes', () => {
      for (let i = 0; i < 60; i++) {
        expect(durationFilter(`00:${i}:00`)).toBe(i);
      }
    });
    it('should convert times of one hour or more to a number of minutes', () => {
      expect(durationFilter('00:60:00')).toBe(60);
      expect(durationFilter('01:00:00')).toBe(60);
    });
  });
})();
