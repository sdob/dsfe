(function() {
  'use strict';
  describe('ProfileController', () => {
    beforeEach(module('divesites.profile'));
    describe('activate()', () => {
      let $controller;
      let $scope;
      let dsapi;
      beforeEach(inject((_$controller_, _$rootScope_, _dsapi_) => {
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
        dsapi = _dsapi_;
      }));
      it('should pass a sanity check', () => {
        let ctrl = $controller('ProfileController', { $controller, $scope, dsapi });
      });
    });
  });
})();
