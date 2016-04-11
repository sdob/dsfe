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
    markerService,
    mapService,
    uiGmapGoogleMapApi
  ) {
    const vm = this;
    // Scope-independent constants relating to markers
    const { defaultMarkerIcons, selectedMarkerIcons } = markerService;
    // Scope-independent functions relating to markers
    const { shouldBeVisible } = markerService;
    const { DEFAULT_DIVESITE_Z_INDEX, DEFAULT_SITE_Z_INDEX, SELECTED_SITE_Z_INDEX, transformAmenityToMarker, transformSiteToMarker } = markerService;

    // Wait time between mousedown and mouseup to trigger a longpress event
    // (in milliseconds)
    const LONG_PRESS_WAIT_TIME_MS = 750;

    // Minimum number of nearby markers before we cluster them
    const MINIMUM_CLUSTER_SIZE = 4;

    // Flag to tell us whether the right-click menu is open, which is subject
    // to change during the controller's lifetime
    let contextMenuIsOpen = false;
    // ID of the currently selected marker, which is subject to change
    // during the controller's lifetime
    let selectedMarkerID;

    // angular-google-maps doesn't seem to be happy if these are attached to
    // $scope.vm, so they have to stay in $scope
    $scope.control = {};
    // Initialize markers as an empty array so that it's never undefined
    // (and angular-google-maps doesn't complain). This lives in
    // $scope so that nested controllers can access it.
    $scope.mapMarkers = [];
    $scope.markerControl = {};
    // 'Loading' state, initially true (so the user knows that something
    // is happening)
    vm.isLoading = true;
    // Authentication check
    vm.isAuthenticated = $auth.isAuthenticated;
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
    // Marker options
    vm.markerOptions = {
    };
    // Map options
    vm.options = {
      minZoom: 3,
      streetViewControl: false,
    };
    // Cluster/spiderfy options
    vm.typeOptions = {
      keepSpiderfied: true, // keep markers spiderfied when clicked
      minimumClusterSize: MINIMUM_CLUSTER_SIZE, // prefer larger clusters
      nearbyDistance: 48, // Increase pixel radius
      imagePath: '/img/m', // Prefix for cluster-marker images
    };
    // Cluster/spiderfy events
    vm.typeEvents = {
    };

    // Run activate block
    activate();

    /* Run whatever's necessary when the controller is initialized. */
    function activate() {
      // Wait for Google API to load and then do whatever depends on it
      awaitGoogleApi();
      // Clean up contextMenuService
      closeContextMenu();
      // Handle search path parameters
      checkSearchPath();
      // Set up event listeners
      registerEventListeners();
      // Retrieve site information
      retrieveSites();
    }

    // Wait for the maps API to be ready, then store a ref to it
    // and use the built-in constants to configure the map
    function awaitGoogleApi() {
      uiGmapGoogleMapApi.then((maps) => {
        vm.maps = maps;

        // Set some of our options that use Google-defined constants
        vm.options.mapTypeControlOptions = {
          position: maps.ControlPosition.BOTTOM_CENTER,
        };
      });
    }

    function checkSearchPath() {
      // If there's a query param in the URL when the controller
      // is activated, then try and summon an information card,
      // and (because we're activating the controller, thus arriving
      // here for the first time from elsewhere) get the site's
      // coordinates and put the map's centre there
      if ($location.$$search.divesite) {
        setMapCentre($location.$$search.divesite, 'divesite');
        summonCard($location.$$search.divesite, 'divesite');
      } else if ($location.$$search.slipway) {
        setMapCentre($location.$$search.slipway, 'slipway');
        summonCard($location.$$search.slipway, 'slipway');
      } else if ($location.$$search.compressor) {
        setMapCentre($location.$$search.compressor, 'compressor');
        summonCard($location.$$search.compressor, 'compressor');
      }
    }

    /* Clear the search path */
    function clearSearchPath() {
      // Wrapping this in $apply forces it to happen immediately
      $scope.$apply(() => {
        $location.search('');
      });
    }

    /* Handle requests by information cards to be removed from the DOM */
    function handlePleaseKillMe(evt, element) {
      $('.information-card').remove();
      //element.remove();
      clearSearchPath();
    }

    /* Handle changes in the search path caused by marker clicks */
    function handleRouteUpdate(e, c) {
      console.log('MapController.handleRouteUpdate()');
      // When the route updates (i.e., search params changes),
      // try to summon an information card. In a well-formed search query,
      // only one of these three will be true, but we'll return early from
      // each case to avoid malformed queries like '?divesite=foo&compressor=bar'
      if (c.params) {
        // The site type is given by the first search parameter key
        const type = Object.keys(c.params)[0];
        // The site UUID is given by this key's value
        const id = c.params[type];
        // Find the site marker by ID
        const selectedMarker = $scope.mapMarkers.filter((m) => m.id === id)[0];
        // Set the marker icon in the next digest cycle
        $timeout(() => {
          setSelectedMarker(selectedMarker);
        });
      }

      // We need to tell summonCard() what type of site this is
      if (c.params.divesite) {
        return summonCard(c.params.divesite, 'divesite');
      }

      if (c.params.slipway) {
        return summonCard(c.params.slipway, 'slipway');
      }

      if (c.params.compressor) {
        return summonCard(c.params.compressor, 'compressor');
      }

      // If there are no search params (e.g. if the user hit the back button)
      // then any existing information cards should be removed, and all icons
      // should be set to the default marker
      $('.information-card').remove();
    }

    // Update marker visibility when new filter preference information arrives
    function listenForPreferenceChanges(e, preferences) {
      if ($scope.mapMarkers) {
        updateMarkerVisibility(preferences);
      }

      // If there's a selected marker, we may want to deselect it, make it
      // invisible, and change the route
      if (selectedMarkerID) {
        const selectedMarker = $scope.mapMarkers.filter((m) => m.id === selectedMarkerID)[0];
        if (!shouldBeVisible(selectedMarker, preferences)) {
          // Treat this as a please-kill-me event
          $timeout(() => {
            selectedMarker.icon = defaultMarkerIcons[selectedMarker.type];
            selectedMarkerID = undefined;
            handlePleaseKillMe(undefined, $('.information-card'));
          });
        }
      }
    }

    function listenForSearchSelection(e, item) {
      // Set map center
      vm.map.center = {
        latitude: item.loc.latitude,
        longitude: item.loc.longitude,
      };
      // Do a routeUpdate
      $location.search(`${item.type}=${item.id}`);
    }

    // Close the right-click context menu, remove it from the DOM if present,
    // and let the controller know that the context menu is closed
    function closeContextMenu() {
      contextMenuService.clear();
      if (contextMenuIsOpen) {
        $('map-context-menu').remove();
        contextMenuIsOpen = false;
      }
    }

    function listenForLongClick(map) {
      // TODO: this code works fine on desktop browsers, but
      // something about how Android Chrome handles long presses
      // is causing the context menu to be removed when the press
      // event ends. When I feel like looking into it, I'll fix it.
      if (!vm.tilesHaveLoaded) {
        vm.tilesHaveLoaded = true;
        new LongPress(map, LONG_PRESS_WAIT_TIME_MS);
        vm.maps.event.addListener(map, 'longpress', (event) => {
          const { x, y } = event.pixel;
          const args = [event];
          if ($auth.isAuthenticated()) {
            contextMenuService.latLng([args[0].latLng.lat(), args[0].latLng.lng()]);
            contextMenuService.pixel(args[0].pixel);
            if (contextMenuIsOpen) {
              $('map-context-menu').remove();
            }

            $('map').append($compile('<map-context-menu></map-context-menu>')($scope));
            contextMenuIsOpen = true;
          }
        });
      }
    }

    // handle map click events
    function mapClick(map, evt, args) {
      // When the user clicks on the map, we should do two things:
      // (1) close the right-click context menu (which this controller can do), and
      // (2) close any open filter/search/add menus.
      // To achieve (2), we'll broadcast a scope event.
      closeContextMenu();
      $scope.$broadcast('map-click');
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

    /*
     * Make AJAX requests to DSAPI for site details. These can return in
     * any order, and we don't want to wait for them all to return, so we'll
     * concatenate results to the mapMarkers array as they arrive.
     */
    function retrieveSites() {
      // Retrieve divesites and create markers
      const getDivesites = dsapi.getDivesites()
      .then((response) => {
        vm.sites = response.data; // Allow us to use the sites in other controllers
        $scope.mapMarkers = $scope.mapMarkers.concat(response.data.map(transformSiteToMarker));
        updateMarkerVisibility(filterPreferences.preferences);
      });

      // Retrieve compressors and create markers
      const getCompressors = dsapi.getCompressors()
      .then((response) => {
        const compressorMarkers = response.data.map(m => transformAmenityToMarker(m, defaultMarkerIcons.compressor, 'compressor'));
        $scope.mapMarkers = $scope.mapMarkers.concat(compressorMarkers);
        updateMarkerVisibility(filterPreferences.preferences);
      });

      // Retrieve slipways and create markers
      const getSlipways = dsapi.getSlipways()
      .then((response) => {
        const slipwayMarkers = response.data.map(m => transformAmenityToMarker(m, defaultMarkerIcons.slipway, 'slipway'));
        $scope.mapMarkers = $scope.mapMarkers.concat(slipwayMarkers);
        updateMarkerVisibility(filterPreferences.preferences);
      });

      // When all of the map markers have been retrieved, try to find the selected marker
      // so we can tag it visually
      Promise.all([getDivesites, getCompressors, getSlipways])
      .then(() => {
        // If the search path is asking us for a particular site, then
        // summon its information card
        if ($location.$$search) {
          const type = Object.keys($location.$$search)[0]; // only pay attention to the first key
          const id = $location.$$search[type];
          const selectedMarker = $scope.mapMarkers.filter((m) => m.id === id)[0];
          // Set the marker icon and remove the 'loading' indicator
          $timeout(() => {
            vm.isLoading = false;
            setSelectedMarker(selectedMarker);
          }, 200);
        }
      });
    }

    function setSelectedMarker(marker) {
      // If we're holding a reference to a previously-selected marker,
      // find and deselect it
      if (selectedMarkerID) {
        const oldSelectedMarker = $scope.mapMarkers.filter((x) => x.id === selectedMarkerID)[0];
        // The previously-selected marker may have been deleted or removed
        // from the markers, so we need to check that it still exists
        if (oldSelectedMarker) {
          // Set the previously-selected marker's icon to 'default'
          oldSelectedMarker.icon = defaultMarkerIcons[oldSelectedMarker.type];
          // Set the previously-selected marker's z-index to its default
          oldSelectedMarker.options.zIndex = oldSelectedMarker.type === 'divesite' ? DEFAULT_DIVESITE_Z_INDEX : DEFAULT_SITE_Z_INDEX;
        }
      }

      // 'marker' may be undefined if we're dismissing an information card
      if (marker) {
        // Set the marker's icon to 'selected'
        marker.icon = selectedMarkerIcons[marker.type];
        // Set z-index to maximum (so that it appears in front of any
        // overlapping markers)
        marker.options.zIndex = SELECTED_SITE_Z_INDEX;
        // Remember that this is now the selected marker
        selectedMarkerID = marker.id;
      }
    }

    /* Return a listener that will set the location path */
    function markerClick(marker, event, model, args) {
      // model.type should always be defined, but if it isn't, we'll assume
      // that it's a divesite (for backwards-compatibility)
      const type = model.type === undefined ? 'divesite' : model.type;
      // Set the search path to point to this site. This controller will handle
      // everything from there
      $location.search(`${type}=${model.id}`);
    }

    /*
     * Register listeners for events bubbling up (from child controllers)
     * and down (from $rootScope)
     */
    function registerEventListeners() {
      // Listen for filter menu changes
      $scope.$on('filter-preferences', listenForPreferenceChanges);
      // Listen for item selections in the search menu
      $scope.$on('search-selection', listenForSearchSelection);
      // Listen for an information card declaring that it wants to be removed.
      // In this case, we remove the element *and* clear the search path.
      $scope.$on('please-kill-me', handlePleaseKillMe);
      // Listen for $routeUpdate events
      $scope.$on('$routeUpdate', handleRouteUpdate);
    }

    /* Given an ID and a type, retrieve the site info and set the map centre */
    function setMapCentre(id, type) {
      mapService.getSiteCoordinates(id, type)
      .then((latLng) => {
        vm.map.center = {
          latitude: latLng.latitude,
          longitude: latLng.longitude,
        };
      });
    }

    /*
    * Summon an information card for a site. This does the heavy lifting.
    */
    function summonCard(id, type) {
      // Remove any existing information-card DOM elements
      $('information-card').remove();

      // The directive we're bringing in is an informationCard, whatever the
      // type of the site we're looking for information on
      const directiveString = '<information-card></information-card>';

      // Create a new scope for the card directive; doing this means
      // that we'll need to destroy it manually too
      const scope = $scope.$new();

      // Pre-warn the information card of the site's ID and type (so that
      // it can update itself with some basic information before making
      // the API request to get the details)
      scope.site = {
        id,
        type,
      };

      // If we already have the site list in memory (which we should
      // in most circumstances), then pre-load the information card scope
      // with details, allowing the controller to populate its template
      // while we're waiting for an API response
      if ($scope.mapMarkers) {
        const marker = $scope.mapMarkers.filter((m) => m.id === scope.site.id)[0];
        if (marker) {
          scope.site.geocoding_data = marker.geocoding_data;
          scope.site.name = marker.title;
          scope.site.owner = marker.owner;
        }
      }

      // Compile the directive and add it to the DOM. Everything from here on
      // will be taken care of by InformationCardController
      $('map').append($compile(directiveString)(scope));
    }

    /*
     * When we receive an event indicating that filter preferences have
     * changed, iterate over the map markers and set each one's visibility.
     */
    function updateMarkerVisibility(preferences) {
      $scope.mapMarkers.forEach((m) => {
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
    'markerService',
    'mapService',
    'uiGmapGoogleMapApi',
  ];
  angular.module('divesites.map').controller('MapController', MapController);

})();
