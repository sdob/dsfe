(function () {
  'use strict';
  describe('MapController', () => {
    beforeEach(module('divesites'));
    describe('#activate()', () => {
      let $rootScope;
      let $scope;
      let $controller;
      let $q;
      let ctrl;
      let dsapi;
      let store = {};
      let filterPreferences;
      let mapSettings;
      let uiGmapGoogleMapApi;

      beforeEach(inject((_$controller_, _$rootScope_, _$q_, _dsapi_, _filterPreferences_, _mapSettings_, _uiGmapGoogleMapApi_) => {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        $scope = $rootScope.$new(); // Ugh
        // Mock dsapi
        dsapi = {
          getDivesites: retrieveDivesitesSuccessfully,
          getDivesite: retrieveDivesiteSuccessfully,
          getCompressors: retrieveSlipwaysSuccessfully,
          getSlipways: retrieveSlipwaysSuccessfully,
        };
        filterPreferences = _filterPreferences_;
        mapSettings = _mapSettings_;
        uiGmapGoogleMapApi = _uiGmapGoogleMapApi_;

        ctrl = $controller('MapController', { $rootScope, $scope, dsapi, filterPreferences, mapSettings, uiGmapGoogleMapApi });
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
          ctrl = $controller('MapController', { $rootScope, $scope, dsapi, filterPreferences, mapSettings, uiGmapGoogleMapApi });
        });
        it('should controller settings correctly', () => {
          expect(mapSettings.get).toHaveBeenCalled();
          expect(ctrl.map.center.latitude).toBe(20);
          expect(ctrl.map.center.longitude).toBe(20);
          expect(ctrl.map.zoom).toBe(8);
        });
      });

      // Mock API
      function retrieveDivesitesSuccessfully() {
        return $q((resolve, reject) => {
          resolve([{}]);
        });
      }

      function retrieveDivesiteSuccessfully(id) {
        return $q((resolve, reject) => {
          resolve({});
        });
      }
      function retrieveSlipwaysSuccessfully() {
        return $q((resolve, reject) => {
          resolve({});
        });
      }
    });


  });
})();
