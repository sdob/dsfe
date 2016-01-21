(function() {
  'use strict';
  function MapController(
    $auth,
    $compile,
    $location,
    $rootScope,
    $scope,
    contextMenuService,
    dsapi,
    filterPreferences,
    informationCardService,
    mapSettings,
    uiGmapGoogleMapApi
  ) {
    // Default marker icons
    const defaultCompressorMarkerIcon = '/img/gauge_28px.png';
    const defaultMapMarkerIcon = '/img/place_48px.svg';
    const defaultSlipwayMarkerIcon = '/img/boatlaunch_28px.svg';

    // Flag to tell us whether the right-click menu is open
    let contextMenuIsOpen = false;

    const vm = this;
    activate();

    /* Run whatever's necessary when the controller is initialized. */
    function activate() {

      // Clean up contextMenuService
      closeContextMenu();

      // Wire up function
      vm.isAuthenticated = $auth.isAuthenticated;

      // When the maps API is ready, store a reference to it
      uiGmapGoogleMapApi.then((maps) => {
        vm.maps = maps;
      });

      // If there's a query param in the URL when the controller
      // is activated, then try and summon an information card
      if ($location.$$search.divesite) {
        summonCard($location.$$search.divesite, 'divesite');
      } else if ($location.$$search.slipway) {
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
        click: mapClick,
        dragstart: mapDragStart,
        idle: mapIdle,
        rightclick: mapRightClick,
      };

      // Set map marker event listeners
      vm.markerEvents = {
        click: markerClick('divesite'),
      };
      vm.slipwayMarkerEvents = {
        click: markerClick('slipway'),
      };
      vm.options = {
        streetViewControl: false,
        minZoom: 3,
      };

      // Listen for filter menu changes
      $scope.$on('filter-preferences', listenForPreferenceChanges);

      // Listen for an information card declaring that it wants to be removed.
      // In this case, we remove the element *and* clear the search path.
      $scope.$on('please-kill-me', handlePleaseKillMe);

      // Listen for $routeUpdate events
      $scope.$on('$routeUpdate', handleRouteUpdate);

      /* Make AJAX requests to DSAPI for site details */

      // Retrieve divesites and create markers
      dsapi.getDivesites()
      .then((response) => {
        vm.sites = response.data; // Allow us to use the sites in other controllers
        vm.mapMarkers = response.data.map(transformSiteToMarker);
        updateMarkerVisibility(filterPreferences.preferences);
      });

      // Retrieve compressors and create markers
      dsapi.getCompressors()
      .then((response) => {
        vm.compressorMarkers = response.data.map(m => transformAmenityToMarker(m, defaultCompressorMarkerIcon));
        updateCompressorMarkerVisibility(filterPreferences.preferences);
      });

      // Retrieve slipways and createMarkers
      dsapi.getSlipways()
      .then((response) => {
        vm.slipwayMarkers = response.data.map(m => transformAmenityToMarker(m, defaultSlipwayMarkerIcon));
        updateSlipwayMarkerVisibility(filterPreferences.preferences);
      });
    }

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

    function handlePleaseKillMe(evt, element) {
      element.remove();
      clearSearchPath();
    }

    // Here's where we handle the search path changes caused by
    // marker clicks
    function handleRouteUpdate(e, c) {
      // When the route updates (i.e., search params changes),
      // try to summon an information card.
      if (c.params.divesite) {
        return summonCard(c.params.divesite, 'divesite');
      }
      if (c.params.slipway) {
        return summonCard(c.params.slipway, 'slipway');
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

      if (vm.slipwayMarkers) {
        updateSlipwayMarkerVisibility(preferences);
      }

      if (vm.compressorMarkers) {
        updateCompressorMarkerVisibility(preferences);
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
    function markerClick(type) {
      return (marker, event, model, args) => {
        $location.search(`${type}=${model.id}`);
      };
    }

    /*
     * Check site data against filter preferences to see if it should be
     * visible on the map
     */
    function shouldBeVisible(marker, preferences) {
      if (!marker) return false;
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
      const {apiCall, directiveString} = informationCardService.apiCalls[type] || informationCardService.apiCalls['default'];

      // Remove any existing DOM elements
      $('information-card').remove();
      $('slipway-information-card').remove();
      apiCall(id)
      .then((response) => {
        //vm.site = response.data;
        $scope.site = response.data;
        $('map').append($compile(directiveString)($scope));
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
    'contextMenuService',
    'dsapi',
    'filterPreferences',
    'informationCardService',
    'mapSettings',
    'uiGmapGoogleMapApi',
  ];
  angular.module('divesites').controller('MapController', MapController);

})();
