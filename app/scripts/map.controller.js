(function () {
  'use strict';
  function MapController($compile, $location, $rootScope, $scope, dsapi, filterPreferences, mapSettings) {
    const defaultMapMarkerIcon = '/img/ic_place_black_36dp.png';
    const vm = this;
    activate();

    /* Run whatever's necessary when the controller is initialized. */
    function activate() {


      // If there's a 'divesite' query param in the URL,
      // then try and summon the information card
      if ($location.$$search.divesite) {
        summonInformationCard($location.$$search.divesite);
      }

      // Initialize mapMarkers as an empty array so that angular-google-maps
      // doesn't throw a wobbly if it initializes before the divesites
      // are retrieved
      vm.mapMarkers = [];

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
      vm.options = {
        disableDefaultUI: true,
        minZoom: 3,
      };

      // Listen for filter menu changes
      $scope.$on('filter-preferences', listenForPreferenceChanges);

      $scope.$on('$routeUpdate', (e, c) => {
        // When the route updates (i.e., search params changes),
        // try and summon the information card; otherwise nuke it.
        if (c.params.divesite) {
          summonInformationCard(c.params.divesite);
        } else {
          $('information-card').remove();
        }
      });

      // Retrieve divesites
      dsapi.getDivesites()
      .then((response) => {
        vm.mapMarkers = response.data.map(transformSiteToMarker);
        updateMarkerVisibility(filterPreferences.preferences);
      });
    }

    function getMarkerScreenPosition(map, marker) {
      const overlay = new google.maps.OverlayView();
      overlay.draw = function () {};
      overlay.setMap(map);
      const proj = overlay.getProjection();
      if (proj) {
        console.log(proj);
        const pos = marker.getPosition();
        const p = proj.fromLatLngToContainerPixel(pos);
        return p;
      }
      //console.log(map.fromLatLngToContainerPixel(marker.getPosition()));
    }

    /*
     * Update marker visibility when new filter preference data
     * arrive
     */
    function listenForPreferenceChanges(e, preferences) {
      if (vm.mapMarkers) {
        updateMarkerVisibility(preferences);
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


    /*
     * Transform site data from the Divesites API to a marker that
     * angular-google-maps understands.
     */
    function transformSiteToMarker(s) {
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
    }

    function summonInformationCard(divesite) {
      // look for 'divesite' in params
      dsapi.getDivesite(divesite)
      .then((response) => {
        // remove any existing information cards and add one to the DOM
        $('information-card').remove();
        const scope = $rootScope.$new();
        scope.site = response.data;
        $('map').append($compile('<information-card></information-card>')(scope));
      });
    }

    function updateMarkerVisibility(preferences) {
      vm.mapMarkers.forEach((m) => {
        m.options.visible = shouldBeVisible(m, preferences);
      });
    }
  }

  MapController.$inject = ['$compile', '$location', '$rootScope', '$scope', 'dsapi', 'filterPreferences', 'mapSettings',];
  angular.module('divesites').controller('MapController', MapController);

})();
