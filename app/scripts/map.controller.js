(function() {
  'use strict';
  function MapController(
    $auth,
    $compile,
    $location,
    $rootScope,
    $scope,
    $timeout,
    contextMenuService,
    dsapi,
    filterPreferences,
    informationCardService,
    mapSettings,
    uiGmapGoogleMapApi
  ) {
    const vm = this;

    // Default marker icons
    const defaultCompressorMarkerIcon = '/img/gauge_28px.svg';
    const defaultMapMarkerIcon = '/img/place_48px.svg';
    const defaultSlipwayMarkerIcon = '/img/boatlaunch_28px.svg';

    // Flag to tell us whether the right-click menu is open
    let contextMenuIsOpen = false;

    activate();

    /* Run whatever's necessary when the controller is initialized. */
    function activate() {

      // Clean up contextMenuService
      closeContextMenu();

      // Wire up functions
      vm.isAuthenticated = $auth.isAuthenticated;

      // Wait for the maps API to be ready, then store a ref to it
      uiGmapGoogleMapApi.then((maps) => {
        vm.maps = maps;
      });

      // If there's a query param in the URL when the controller
      // is activated, then try and summon an information card
      if ($location.$$search.divesite) {
        summonCard($location.$$search.divesite, 'divesite');
      } else if ($location.$$search.slipway) {
        summonCard($location.$$search.slipway, 'slipway');
      } else if ($location.$$search.compressor) {
        summonCard($location.$$search.compressor, 'compressor');
      }

      // Initialize markers as an empty array so that it's never undefined
      // (and angular-google-maps doesn't complain)
      vm.mapMarkers = [];

      // Retrieve stored map settings
      vm.map = mapSettings.get();

      // Set map event listeners
      vm.mapEvents =  {
        click: mapClick,
        dragstart: mapDragStart,
        idle: mapIdle,
        rightclick: mapRightClick,
      };

      // Set map marker event listeners
      vm.markerEvents = {
        click: markerClick,
      };

      // Set map options
      vm.options = {
        streetViewControl: false,
        minZoom: 3,
      };

      vm.typeOptions = {
        keepSpiderfied: true, // keep markers spiderfied when clicked
        nearbyDistance: 48, // Increase pixel radius
      };

      // Set cluster/spiderfy events
      vm.typeEvents = {
        // TODO: handle cluster/spiderfy events in a lovelier way
      };

      /* Listen for events */

      // Listen for filter menu changes
      $scope.$on('filter-preferences', listenForPreferenceChanges);

      // Listen for an information card declaring that it wants to be removed.
      // In this case, we remove the element *and* clear the search path.
      $scope.$on('please-kill-me', handlePleaseKillMe);

      // Listen for $routeUpdate events
      $scope.$on('$routeUpdate', handleRouteUpdate);

      /* Make AJAX requests to DSAPI for site details. These can return in
       * any order, and we don't want to wait for them all to return, so we'll
       * concatenate results to the mapMarkers array as they arrive.
       */

      // Retrieve divesites and create markers
      dsapi.getDivesites()
      .then((response) => {
        vm.sites = response.data; // Allow us to use the sites in other controllers
        vm.mapMarkers = vm.mapMarkers.concat(response.data.map(transformSiteToMarker));
        updateMarkerVisibility(filterPreferences.preferences);
      });

      // Retrieve compressors and create markers
      dsapi.getCompressors()
      .then((response) => {
        const compressorMarkers = response.data.map(m => transformAmenityToMarker(m, defaultCompressorMarkerIcon, 'compressor'));
        vm.mapMarkers = vm.mapMarkers.concat(compressorMarkers);
        updateMarkerVisibility(filterPreferences.preferences);
      });

      // Retrieve slipways and createMarkers
      dsapi.getSlipways()
      .then((response) => {
        // vm.slipwayMarkers = response.data.map(m => transformAmenityToMarker(m, defaultSlipwayMarkerIcon));
        const slipwayMarkers = response.data.map(m => transformAmenityToMarker(m, defaultSlipwayMarkerIcon, 'slipway'));
        vm.mapMarkers = vm.mapMarkers.concat(slipwayMarkers);
        updateMarkerVisibility(filterPreferences.preferences);
      });
    }

    /* Clear the search path */
    function clearSearchPath() {
      // Wrapping this in $apply forces it to happen immediately
      $scope.$apply(() => {
        $location.search('');
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

    /* Handle requests by information cards to be removed from the DOM */
    function handlePleaseKillMe(evt, element) {
      element.remove();
      clearSearchPath();
    }

    /* Handle changes in the search path caused by marker clicks */
    function handleRouteUpdate(e, c) {
      // When the route updates (i.e., search params changes),
      // try to summon an information card. In a well-formed search query,
      // only one of these three will be true, but we'll return early from
      // each case to avoid malformed queries like '?divesite=foo&compressor=bar'
      if (c.params.divesite) {
        return summonCard(c.params.divesite, 'divesite');
      }
      if (c.params.slipway) {
        return summonCard(c.params.slipway, 'slipway');
      } 
      if (c.params.compressor) {
        console.log('handling compressor');
        return summonCard(c.params.compressor, 'compressor');
      }
      // If there are no search params (e.g. if the user hit the back button)
      // then any existing information cards should be removed
      $('.information-card').remove();
    }

    // Update marker visibility when new filter preference information arrives
    function listenForPreferenceChanges(e, preferences) {
      if (vm.mapMarkers) {
        updateMarkerVisibility(preferences);
      }
    }

    function closeContextMenu() {
      contextMenuService.clear();
      if (contextMenuIsOpen) {
        $('map-context-menu').remove();
        contextMenuIsOpen = false;
      }
    }

    // handle map click events
    function mapClick(map, evt, args) {
      closeContextMenu();
    }

    function mapDragStart(map, evt, args) {
      closeContextMenu();
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

    /* When an authenticated user right-clicks on the map, show a context menu
     * allowing them to create sites.
     */
    function mapRightClick(map, evt, args) {
      // Only show the context menu if the user is authenticated
      if ($auth.isAuthenticated()) {
        contextMenuService.latLng([args[0].latLng.lat(), args[0].latLng.lng()]);
        contextMenuService.pixel(args[0].pixel);
        if (contextMenuIsOpen) {
          $('map-context-menu').remove();
        }
        $('map').append($compile('<map-context-menu></map-context-menu>')($scope));
        contextMenuIsOpen = true;
      } 
    }

    /* Return a listener that will set the location path */
    function markerClick(marker, event, model, args) {
      console.log('click on model');
      console.log(model);
      const type = model.type === undefined ? 'divesite' : model.type;
      $location.search(`${type}=${model.id}`);
    }

    /*
     * Check site data against filter preferences to see if it should be
     * visible on the map
     */
    function shouldBeVisible(marker, preferences) {
      // Bail out early
      if (!marker) return false;

      // If this marker is a slipway, handle visibility preferences for it
      if (marker.type === 'slipway') {
        return preferences.slipways;
      }

      // If this marker is a compressor, handle visibility preferences for it
      if (marker.type === 'compressor') {
        return preferences.compressors;
      }

      // Default case: this is a divesite marker
      // Site depth should be less than or equal to preferred maximum depth
      const depth = marker.depth <= preferences.maximumDepth;

      // Site level should be less than or equal to preferred maximum level
      const level = marker.level <= preferences.maximumLevel;

      // A site with boat entry should be visible if preferences want it to be
      const boatEntry = (marker.boatEntry && preferences.boatEntry);

      // A site with shore entry should be visible if preferences want it to be
      const shoreEntry = (marker.shoreEntry && preferences.shoreEntry);

      // A site has to meet all of these criteria in order to be visible
      return depth && level && (boatEntry || shoreEntry);
    }

    /* Summon an information card for a site */
    function summonCard(id, type) {
      console.log('summoning card');
      // ID is a uuid for an object, but that doesn't tell us what the
      // type is, so we pass that into this bit here
      const {apiCall, directiveString} = informationCardService.apiCalls[type] || informationCardService.apiCalls['default'];

      // Remove any existing DOM elements
      $('information-card').remove();
      $('slipway-information-card').remove();
      $('compressor-information-card').remove();
      apiCall(id)
      .then((response) => {
        //vm.site = response.data;
        $scope.site = response.data;
        console.log(`trying to compile ${directiveString}`);
        $('map').append($compile(directiveString)($scope));
      });
    }

    /*
     * Transform divesite data from dsapi to a marker object
     * that angular-google-maps understands. While we're at it, we'll
     * convert snake_cased fields to camelCased properties.
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

    /*
     * Transform non-divesite (amenity) data from dsapi to a marker object
     * that angular-google-maps understands. While we're at it, we'll
     * convert snake_cased fields to camelCased properties.
     */
    function transformAmenityToMarker(s, icon, type) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
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
        type: type,
      };
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    /*
     * When we receive an event indicating that filter preferences have
     * changed, iterate over the map markers and set each one's visibility.
     */
    function updateMarkerVisibility(preferences) {
      vm.mapMarkers.forEach((m) => {
        m.options.visible = shouldBeVisible(m, preferences);
      });
    }
  }

  MapController.$inject = ['$auth',
    '$compile',
    '$location',
    '$rootScope',
    '$scope',
    '$timeout',
    'contextMenuService',
    'dsapi',
    'filterPreferences',
    'informationCardService',
    'mapSettings',
    'uiGmapGoogleMapApi',
  ];
  angular.module('divesites').controller('MapController', MapController);

})();
