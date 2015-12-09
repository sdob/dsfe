(function () {
  'use strict';
  describe('MapController', () => {
    beforeEach(module('divesites'));
    describe('#activate()', () => {
      let $rootScope;
      let $scope;
      let $controller;
      let ctrl;
      let dsapi;
      let store = {};
      let filterPreferences;
      let mapSettings;
      beforeEach(inject((_$controller_, _$rootScope_, _dsapi_, _filterPreferences_, _mapSettings_) => {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new(); // Ugh
        dsapi = _dsapi_;
        filterPreferences = _filterPreferences_;
        mapSettings = _mapSettings_;

        ctrl = $controller('MapController', { $rootScope, $scope, dsapi, filterPreferences, mapSettings });
      }));

      it('should have unit tests', () => {
      });

      describe('with stored settings', () => {
        beforeEach(() => {
          spyOn(mapSettings, 'get').and.returnValue({
            center: {
              latitude: 20,
              longitude: 20,
            },
            zoom: 8,
          });
          ctrl = $controller('MapController', { $rootScope, $scope, dsapi, filterPreferences, mapSettings });
        });
        it('should controller settings correctly', () => {
          expect(mapSettings.get).toHaveBeenCalled();
          expect(ctrl.map.center.latitude).toBe(20);
          expect(ctrl.map.center.longitude).toBe(20);
          expect(ctrl.map.zoom).toBe(8);
        });
      });

    });


    describe('localStorage', () => {
    });


  });
})();
