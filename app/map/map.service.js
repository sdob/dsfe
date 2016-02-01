(function() {
  'use strict';

  function mapService(ls) {
    // jshint validthis:true
    // jscs: disable safeContextKeyword
    const self = this;
    const DEFAULT_LATITUDE = 53;
    const DEFAULT_LONGITUDE = -8;
    const DEFAULT_ZOOM = 8;

    // Default marker icons
    const defaultCompressorMarkerIcon = '/img/gauge_28px.svg';
    const defaultMapMarkerIcon = '/img/place_48px.svg';
    const defaultSlipwayMarkerIcon = '/img/boatlaunch_28px.svg';
    const selectedMapMarkerIcon = '/img/place_selected_48px.svg';
    const selectedCompressorMarkerIcon = '/img/gauge_selected_28px.svg';
    const selectedSlipwayMarkerIcon = '/img/boatlaunch_selected_28px.svg';

    const defaultMarkerIcons = {
      compressor: defaultCompressorMarkerIcon,
      divesite: defaultMapMarkerIcon,
      slipway: defaultSlipwayMarkerIcon,
    };
    const selectedMarkerIcons = {
      compressor: selectedCompressorMarkerIcon,
      divesite: selectedMapMarkerIcon,
      slipway: selectedSlipwayMarkerIcon,
    };

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
        return value >= -90 && value <= 90;
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
      defaultMarker,
      defaultMarkerIcons,
      defaultSite,
      get,
      maintainCoordinateMaxLength,
      selectedMarkerIcons,
      set,
    };

    function defaultMarker(map) {
      return {
        id: 0,
        coords: {
          latitude: map.center.latitude,
          longitude: map.center.longitude,
        },
        options: {
          draggable: true,
        },
      };
    }

    function defaultSite(map) {
      return {
        boatEntry: false,
        shoreEntry: false,
        coords: {
          latitude: map.center.latitude,
          longitude: map.center.longitude,
        },
      };
    }

    function get() {
      return self.map;
    }

    function maintainCoordinateMaxLength(site) {
      // Truncate coordinate lengths (quick and dirty way to avoid
      // floating-point errors that break ng-maxlength)
      const coords = {
        latitude: truncateCoordinate(site.coords.latitude),
        longitude: truncateCoordinate(site.coords.longitude),
      };
      return coords;
    }

    function set(k, v=undefined) {
      // If passed an object, then set the internal object to it
      if (typeof k === 'object') {
        // TODO: validate
        self.map = k;
        ls.set('map', self.map);
      }

      // If called with a pair of strings, set the prop
      if (typeof k === 'string') {
        self.map[k] = v;
        ls.set('map', self.map);
        return;
      }

      return; // We were called with invalid params
    }

    function truncateCoordinate(n) {
      return Math.round(n * 10e6) / 10e6;
    }
  }

  mapService.$inject = ['localStorageService'];
  angular.module('divesites.map').factory('mapService', mapService);
})();
