(function () {
  'use strict';
  function MapController() {
    const vm = this;

    activate();

    function activate() {
      /*
      console.log(localStorageService);
      const storedSettings = localStorageService.get('map');

      vm.mapEvents =  {
          idle: mapIdle
      };

      vm.map = {};

      if (storedSettings && storedSettings.center) {
        vm.map.center = storedSettings.center;
      } else {
        vm.map.center = {
          latitude: 53,
          longitude: -8
        };
      }

      if (storedSettings && storedSettings.zoom) {
        vm.map.zoom = storedSettings.zoom;
      } else {
        vm.map.zoom = 8;
      }
      */
    }

    function mapIdle(map) {
      // Store current map position
      localStorageService.set('map', {
        center: {
          latitude: map.center.lat(),
          longitude: map.center.lng()
        },
        zoom: map.zoom
      });
    }
  }

  //MapController.$inject = ['localStorageService'];
  angular.module('divesites').controller('MapController', MapController);

})();
