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
    mapService,
    uiGmapGoogleMapApi
  ) {
    const vm = this;

    const defaultMarkerIcons = mapService.defaultMarkerIcons;
    const selectedMarkerIcons = mapService.selectedMarkerIcons;

    // Flag to tell us whether the right-click menu is open
    let contextMenuIsOpen = false;
    // ID of the currently selected marker
    let selectedMarkerID;

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

      // Initialize markers as an empty array so that it's never undefined
      // (and angular-google-maps doesn't complain)
      vm.mapMarkers = [];

      // Retrieve stored map settings
      vm.map = mapService.get();

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

      // If there's a query param in the URL when the controller
      // is activated, then try and summon an information card
      if ($location.$$search.divesite) {
        summonCard($location.$$search.divesite, 'divesite');
      } else if ($location.$$search.slipway) {
        summonCard($location.$$search.slipway, 'slipway');
      } else if ($location.$$search.compressor) {
        summonCard($location.$$search.compressor, 'compressor');
      }

      console.info($location.$$search);

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
      const getDivesites = dsapi.getDivesites()
      .then((response) => {
        vm.sites = response.data; // Allow us to use the sites in other controllers
        vm.mapMarkers = vm.mapMarkers.concat(response.data.map(transformSiteToMarker));
        updateMarkerVisibility(filterPreferences.preferences);
      });

      // Retrieve compressors and create markers
      const getCompressors = dsapi.getCompressors()
      .then((response) => {
        const compressorMarkers = response.data.map(m => transformAmenityToMarker(m, defaultMarkerIcons.compressor, 'compressor'));
        vm.mapMarkers = vm.mapMarkers.concat(compressorMarkers);
        updateMarkerVisibility(filterPreferences.preferences);
      });

      // Retrieve slipways and createMarkers
      const getSlipways = dsapi.getSlipways()
      .then((response) => {
        const slipwayMarkers = response.data.map(m => transformAmenityToMarker(m, defaultMarkerIcons.slipway, 'slipway'));
        vm.mapMarkers = vm.mapMarkers.concat(slipwayMarkers);
        updateMarkerVisibility(filterPreferences.preferences);
      });

      // When all of the map markers have been retrieved, try to find the selected marker
      // so we can tag it visually
      Promise.all([getDivesites, getCompressors, getSlipways])
      .then(() => {
        if ($location.$$search) {
          const type = Object.keys($location.$$search)[0]; // only pay attention to the first key
          const id = $location.$$search[type];
          const selectedMarker = vm.mapMarkers.filter((m) => m.id === id)[0];
          // Set the marker icon
          $timeout(() => {
            setSelectedMarker(selectedMarker);
          });
        }
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

      console.info('handleRouteUpdate');
      console.info(c.params);

      if (c.params) {
        console.info('doing something');
        const type = Object.keys(c.params)[0]; // only pay attention to the first key
        const id = c.params[type];
        const selectedMarker = vm.mapMarkers.filter((m) => m.id === id)[0];
        // Set the marker icon
        $timeout(() => {
          setSelectedMarker(selectedMarker);
        });
      }

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
      // then any existing information cards should be removed, and all icons
      // should be set to the default marker
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
      mapService.set({
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

    function setSelectedMarker(marker) {
      if (selectedMarkerID) {
        const oldSelectedMarker = vm.mapMarkers.filter((x) => x.id === selectedMarkerID)[0];
        if (oldSelectedMarker) { // Just in case it's been deleted or removed from the markers
          oldSelectedMarker.icon = defaultMarkerIcons[oldSelectedMarker.type];
        }
      }

      if (marker) {
        // marker may be undefined if we're dismissing an information card
        marker.icon = selectedMarkerIcons[marker.type];
        selectedMarkerID = marker.id;
      }
    }

    /* Return a listener that will set the location path */
    function markerClick(marker, event, model, args) {
      console.log('click on model');
      console.log(model);
      // Set a type for this marker
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
      // ID is a uuid for an object, but that doesn't tell us what the
      // type is, so we pass that into this bit here
      const { apiCall, directiveString } = informationCardService.apiCalls[type] || informationCardService.apiCalls['default'];

      // Remove any existing DOM elements
      $('information-card').remove();
      $('slipway-information-card').remove();
      $('compressor-information-card').remove();
      apiCall(id)
      .then((response) => {
        //vm.site = response.data;
        //$scope.site = response.data;
        $scope.id = id;
        $scope.type = type;
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
        icon: defaultMarkerIcons.divesite,
        id: s.id,
        loc: {
          latitude: s.latitude,
          longitude: s.longitude,
        },
        options: {
          visible: false,
        },
        title: s.name,
        type: 'divesite',
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
    'mapService',
    'uiGmapGoogleMapApi',
  ];
  angular.module('divesites.map').controller('MapController', MapController);

})();
