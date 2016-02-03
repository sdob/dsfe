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
    const { defaultMarkerIcons, selectedMarkerIcons } = markerService;
    const { shouldBeVisible } = markerService;
    const { transformAmenityToMarker, transformSiteToMarker } = markerService;

    // Wait time between mousedown and mouseup to trigger a longpress event
    // (in milliseconds)
    const LONG_PRESS_WAIT_TIME_MS = 750;

    // Flag to tell us whether the right-click menu is open
    let contextMenuIsOpen = false;
    // ID of the currently selected marker
    let selectedMarkerID;

    $scope.control = {};

    activate();

    /* Run whatever's necessary when the controller is initialized. */
    function activate() {
      // Set 'loading' state to true (so the user knows that something
      // is happening)
      vm.isLoading = true;

      // Retrieve stored map settings
      vm.map = mapService.get();
      vm.map.control = vm.map.control || {};

      // Clean up contextMenuService
      closeContextMenu();

      // Wire up functions
      vm.isAuthenticated = $auth.isAuthenticated;

      // Wait for the maps API to be ready, then store a ref to it
      uiGmapGoogleMapApi.then((maps) => {
        vm.maps = maps;
        // Set some of our options
        vm.options.mapTypeControlOptions = {
          position: maps.ControlPosition.BOTTOM_CENTER,
        };

        // Implement a long-press listener
        function LongPress(map, length) {
          this.length_ = length;
          const vm = this;
          vm.map_ = map;
          vm.timeoutId_ = null;
          maps.event.addListener(map, 'mousedown', function(e) {
            vm.onMouseDown_(e);
          });

          maps.event.addListener(map, 'mouseup', function(e) {
            vm.onMouseUp_(e);
          });

          maps.event.addListener(map, 'drag', function(e) {
            vm.onMapDrag_(e);
          });
        }

        LongPress.prototype.onMouseUp_ = function(e) {
          clearTimeout(this.timeoutId_);
        };

        LongPress.prototype.onMouseDown_ = function(e) {
          clearTimeout(this.timeoutId_);
          const map = this.map_;
          const event = e;
          this.timeoutId_ = setTimeout(function() {
            vm.maps.event.trigger(map, 'longpress', event);
          }, this.length_);
        };

        LongPress.prototype.onMapDrag_ = function(e) {
          clearTimeout(this.timeoutId_);
        };

        // Until I can figure out how to get the control object working,
        // this has to be assigned after the maps API has loaded
        vm.mapEvents.tilesloaded = (map) => {
          if (!vm.tilesHaveLoaded) {
            vm.tilesHaveLoaded = true;
            new LongPress(map, LONG_PRESS_WAIT_TIME_MS);
            vm.maps.event.addListener(map, 'longpress', (event) => {
              console.log('long press');
              const { x, y } = event.pixel;
              console.log(x, y);
              console.log(event);
              const args = [event];
              // TODO: summon context menu
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
        };
      });

      // Initialize markers as an empty array so that it's never undefined
      // (and angular-google-maps doesn't complain)
      vm.mapMarkers = [];

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
        minZoom: 3,
        streetViewControl: false,
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

      /*
       *
       * Listen for events
       */

      // Listen for filter menu changes
      $scope.$on('filter-preferences', listenForPreferenceChanges);

      // Listen for an information card declaring that it wants to be removed.
      // In this case, we remove the element *and* clear the search path.
      $scope.$on('please-kill-me', handlePleaseKillMe);

      // Listen for $routeUpdate events
      $scope.$on('$routeUpdate', handleRouteUpdate);

      /*
       * Make AJAX requests to DSAPI for site details. These can return in
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
          // Set the marker icon and remove the 'loading' indicator
          $timeout(() => {
            vm.isLoading = false;
            setSelectedMarker(selectedMarker);
          }, 200);
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

      // If there's a selected marker, we may want to deselect it, make it
      // invisible, and change the route
      if (selectedMarkerID) {
        console.log('should selected marker be visible?');
        const selectedMarker = vm.mapMarkers.filter((m) => m.id === selectedMarkerID)[0];
        console.log(shouldBeVisible(selectedMarker, preferences));
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
      // model.type should always be defined, but if it isn't, we'll assume
      // that it's a divesite
      const type = model.type === undefined ? 'divesite' : model.type;
      $location.search(`${type}=${model.id}`);
    }

    /* Summon an information card for a site */
    function summonCard(id, type) {
      // Remove any existing DOM elements
      $('information-card').remove();
      $('slipway-information-card').remove();
      $('compressor-information-card').remove();

      // Get the directive that we should be adding, based on the marker's type
      const { directiveString } = informationCardService.apiCalls[type] || informationCardService.apiCalls.divesite;

      // Compile the directive. We're creating a new scope manually, which means
      // that we'll need to destroy it manually too
      const scope = $scope.$new();
      scope.id = id;
      scope.type = type;
      $('map').append($compile(directiveString)(scope));
    }

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
    'markerService',
    'mapService',
    'uiGmapGoogleMapApi',
  ];
  angular.module('divesites.map').controller('MapController', MapController);

})();
