(function () {
  'use strict';

  function MapSettings(ls) {
    const self = this;
    const DEFAULT_LATITUDE = 53;
    const DEFAULT_LONGITUDE = -8;
    const DEFAULT_ZOOM = 8;

    // Initially, set sane defaults
    const mapObj = {
      center: {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
      },
      zoom: DEFAULT_ZOOM,
    };

    // Validate
    const validators = {
      latitude: (value) => {
        return value >= -90 && value <= -90;
      },
      longitude: (value) => {
        return value >= -180 && value <= 180;
      },
      // TODO: validate zoom level
      zoom: () => true,
    };

    // Retrieve and validate the map object
    if (ls.keys().indexOf('map') > -1) {
      const storedMap = ls.get('map');
      // Look for a stored 'zoom' property
      if (storedMap.hasOwnProperty('zoom')) {
        const storedZoom = storedMap.zoom;
        // Validate it
        if (validators.zoom(storedZoom)) {
          mapObj.zoom = storedZoom;
        }
      }
      if (storedMap.hasOwnProperty('center')) {
        // Look for latitude and longitude properties
        ['latitude', 'longitude'].forEach((k) => {
          if (storedMap.center.hasOwnProperty(k)) {
            const storedValue = storedMap.center[k];
            // Validate each of them
            if (validators[k](storedValue)) {
              mapObj.center[k] = storedValue;
            }
          }
        });
      }
      // Either way, make sure that localStorage gets a valid object
      ls.set('map', mapObj);
    }

    self.map = mapObj;

    return {
      get,
      set,
    };

    function get() {
      return self.map;
    }

    function set(mapObj) {
      // TODO: validate first
      ls.set('map', mapObj);
    }
  }

  MapSettings.$inject = ['localStorageService'];
  angular.module('divesites').factory('mapSettings', MapSettings);
})();
