(function () {
  'use strict';
  describe('MapController', () => {
    //let $controller;
    beforeEach(module('divesites'));
    describe('Blah blah blah', () => {
      let ctrl;
      let $scope;
      beforeEach(inject(($controller, $rootScope) => {
        ctrl = $controller('MapController', {
          $scope: $rootScope
        });
      }));
      it('should have unit tests', () => {
      });
    });
  });
})();
