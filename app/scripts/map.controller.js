(function() {
  'use strict';
  function MapController($auth, $compile, $location, $rootScope, $scope, dsapi, filterPreferences, informationCardService, mapSettings, uiGmapGoogleMapApi) {
    const defaultCompressorMarkerIcon = '/img/compressor_24px.png';
    const defaultMapMarkerIcon = '/img/place_48px.svg';
    const defaultSlipwayMarkerIcon = '/img/boatlaunch_24px.png';
    const vm = this;
    activate();

    /* Run whatever's necessary when the controller is initialized. */
    function activate() {
      vm.isAuthenticated = $auth.isAuthenticated;

      uiGmapGoogleMapApi
      .then((maps) => {
        vm.maps = maps;
      });

      // If there's a 'divesite' query param in the URL,
      // then try and summon the information card
      console.log('looking for $location.$$search');
      console.log($location.$$search);
      if ($location.$$search.divesite) {
        summonCard($location.$$search.divesite, 'divesite');
      }

      // If there's a 'slipway' query param in the URL,
      // try and summon the slipway information card
      if ($location.$$search.slipway) {
        summonCard($location.$$search.slipway, 'slipway');
      }

      // Initialize markers as empty arrays so that angular-google-maps
      // doesn't throw a wobbly if it initializes before the API data
      // are retrieved
      vm.mapMarkers = [];
      vm.slipwayMarkers  = [];
      vm.compressorMarkers = [];

      // Retrieve stored map settings
      vm.map = mapSettings.get();

      // Set map event listeners
      vm.mapEvents =  {
        idle: mapIdle,
      };

      // Set map marker event listeners
      vm.markerEvents = {
        click: markerClick,
      };
      vm.slipwayMarkerEvents = {
        click: slipwayMarkerClick,
      };
      vm.options = {
        //disableDefaultUI: true,
        streetViewControl: false,
        minZoom: 3,
      };

      // Listen for filter menu changes
      $scope.$on('filter-preferences', listenForPreferenceChanges);

      $scope.$on('$routeUpdate', (e, c) => {
        console.log('$routeUpdate');
        $('information-card').remove();
        $('slipway-information-card').remove();
        // When the route updates (i.e., search params changes),
        // try to summon an information card. These are chained
        // with else statements so that a malformed search string
        // won't try to repeatedly create information cards
        if (c.params.divesite) {
          return summonCard(c.params.divesite, 'divesite');
        } else if (c.params.slipway) {
          return summonCard(c.params.slipway, 'slipway');
        } 
      });

      // Retrieve divesites
      dsapi.getDivesites()
      .then((response) => {
        vm.sites = response.data; // Allow us to use the sites in other controllers
        vm.mapMarkers = response.data.map(transformSiteToMarker);
        updateMarkerVisibility(filterPreferences.preferences);
      });

      dsapi.getCompressors()
      .then((response) => {
        vm.compressorMarkers = response.data.map(m => transformAmenityToMarker(m, defaultCompressorMarkerIcon));
        updateCompressorMarkerVisibility(filterPreferences.preferences);
      });

      // Retrieve slipways
      dsapi.getSlipways()
      .then((response) => {
        vm.slipwayMarkers = response.data.map(m => transformAmenityToMarker(m, defaultSlipwayMarkerIcon));
        updateSlipwayMarkerVisibility(filterPreferences.preferences);
      });
    }

    function getMarkerScreenPosition(map, marker) {
      const overlay = new google.maps.OverlayView();
      overlay.draw = function() {};

      overlay.setMap(map);
      const proj = overlay.getProjection();
      if (proj) {
        console.log(proj);
        const pos = marker.getPosition();
        const p = proj.fromLatLngToContainerPixel(pos);
        return p;
      }
    }

    /*
     * Update marker visibility when new filter preference data
     * arrive
     */
    function listenForPreferenceChanges(e, preferences) {
      if (vm.mapMarkers) {
        updateMarkerVisibility(preferences);
      }

      if (vm.slipwayMarkers) {
        updateSlipwayMarkerVisibility(preferences);
      }

      if (vm.compressorMarkers) {
        updateCompressorMarkerVisibility(preferences);
      }
    }

    /*
     * When the map idles, have the map settings service store the
     * current position
     */
    function mapIdle(map) {
      // Store current map position
      mapSettings.set({
        center: {
          latitude: map.center.lat(),
          longitude: map.center.lng(),
        },
        zoom: map.zoom,
      });
    }

    /*
     * When the user clicks on a site marker, retrieve detailed info
     * and bring up the information card
     */
    function markerClick(marker, event, model, args) {
      $location.search(`divesite=${model.id}`);
    }

    function slipwayMarkerClick(marker, event, model, args) {
      $location.search(`slipway=${model.id}`);
    }

    /*
     * Check site data against filter preferences to see if it should be
     * visible on the map
     */
    function shouldBeVisible(marker, preferences) {
      if (!marker) return false;
      const depth = marker.depth <= preferences.maximumDepth;
      const level = marker.level <= preferences.maximumLevel;
      const entries = (marker.boatEntry && preferences.boatEntry) || (marker.shoreEntry && preferences.shoreEntry);
      return depth && level && entries;
    }

    function summonInformationCard(divesite) {
      // look for 'divesite' in params
      dsapi.getDivesite(divesite)
      .then((response) => {
        // remove any existing information cards and add one to the DOM
        $('information-card').remove();
        $('slipway-information-card').remove();
        const scope = $rootScope.$new();
        scope.site = response.data;
        console.log(scope);
        $('map').append($compile(`<information-card></information-card>`)(scope));
      });
    }

    function summonCard(id, type) {
      const {apiCall, directiveString} = informationCardService.apiCalls[type] || informationCardService.apiCalls['default'];

      // Remove any existing DOM elements
      $('information-card').remove();
      $('slipway-information-card').remove();
      apiCall(id)
      .then((response) => {
        const scope = $rootScope.$new();
        scope.site = response.data;
        $('map').append($compile(directiveString)(scope));
      });
    }

    function summonSlipwayInformationCard(slipway) {
      dsapi.getSlipway(slipway)
      .then((response) => {
        $('information-card').remove();
        $('slipway-information-card').remove();
        const scope = $rootScope.$new();
        scope.site = response.data;
        $('map').append($compile('<slipway-information-card></slipway-information-card>')(scope));
      });
    }

    /*
     * Transform site data from the Divesites API to a marker that
     * angular-google-maps understands.
     */
    function transformSiteToMarker(s) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
      return {
        boatEntry: s.boat_entry,
        depth: s.depth,
        level: s.level,
        icon: defaultMapMarkerIcon,
        id: s.id,
        loc: {
          latitude: s.latitude,
          longitude: s.longitude,
        },
        options: {
          visible: false,
        },
        title: s.name,
        shoreEntry: s.shore_entry,
      };
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function transformAmenityToMarker(s, icon) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
      return {
        icon,
        id: s.id,
        loc: {
          latitude: s.latitude,
          longitude: s.longitude,
        },
        options: {
          visible: false,
        },
        title: s.name,
      };
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function updateMarkerVisibility(preferences) {
      vm.mapMarkers.forEach((m) => {
        m.options.visible = shouldBeVisible(m, preferences);
      });
    }

    function updateCompressorMarkerVisibility(preferences) {
      vm.compressorMarkers.forEach((m) => {
        m.options.visible = preferences.compressors;
      });
    }

    function updateSlipwayMarkerVisibility(preferences) {
      vm.slipwayMarkers.forEach((m) => {
        m.options.visible = preferences.slipways;
      });
    }
  }

  MapController.$inject = ['$auth',
    '$compile',
    '$location',
    '$rootScope',
    '$scope',
    'dsapi',
    'filterPreferences',
    'informationCardService',
    'mapSettings',
    'uiGmapGoogleMapApi',
  ];
  angular.module('divesites').controller('MapController', MapController);

})();
