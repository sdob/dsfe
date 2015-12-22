(function () {
  'use strict';
  function MapController($compile, $rootScope, $scope, dsapi, filterPreferences, mapSettings) {
    const vm = this;
    activate();

    /* Run whatever's necessary when the controller is initialized. */
    function activate() {

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

      // Listen for filter menu changes
      $scope.$on('filter-preferences', listenForPreferenceChanges);
      $scope.$on('$destroy', listenForPreferenceChanges);

      // Retrieve divesites
      dsapi.getDivesites()
      .then((response) => {
        console.info(`MapController received ${response.data.length} objects`);
        vm.mapMarkers = response.data.map(transformSiteToMarker);
        updateMarkerVisibility(filterPreferences.preferences);
      });
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
      dsapi.getDivesite(model.id)
      .then((response) => {
        console.info('retrieved Divesite');
        //console.info(response.data);
        // remove any existing information cards and add one to the DOM
        $('information-card').remove();
        const scope = $rootScope.$new();
        scope.site = response.data;
        //scope.icvm.site = response.data;
        $('map').append($compile('<information-card></information-card>')(scope));
        //$rootScope.$broadcast('show-information-card', response.data);
      });
    }


    /*
     * Check site data against filter preferences to see if it should be
     * visible on the map
     */
    function shouldBeVisible(marker, preferences) {
      const depth = marker.depth <= preferences.maximumDepth;
      //const depth = true;
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
        id: s.id,
        title: s.name,
        loc: {
          latitude: s.latitude,
          longitude: s.longitude,
        },
        options: {
          visible: false,
        },
        shoreEntry: s.shore_entry,
      };
    }


    function updateMarkerVisibility(preferences) {
      vm.mapMarkers.forEach((m) => {
        m.options.visible = shouldBeVisible(m, preferences);
      });
    }
  }

  MapController.$inject = ['$compile', '$rootScope', '$scope', 'dsapi', 'filterPreferences', 'mapSettings',];
  angular.module('divesites').controller('MapController', MapController);

})();
