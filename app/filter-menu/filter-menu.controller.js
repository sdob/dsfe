(function() {
  'use strict';
  function FilterMenuController($scope, filterPreferences) {
    const vm = this;
    vm.updatePreferences = updatePreferences;

    activate();

    function activate() {
      // Wire up scope functions
      vm.handleSearchSelect = handleSearchSelect;

      // handle filter preferences
      vm.preferences = filterPreferences.preferences;
      vm.updatePreferences();
    }

    function handleSearchSelect(item) {
      // When the user selects a divesite from the search results, re-centre
      // the map, then emulate a click on the map marker
      $scope.mc.map.center = {
        latitude: item.latitude,
        longitude: item.longitude,
      };

      // Emulate a marker click here
      const marker = $scope.mc.mapMarkers.filter((m) => m.id === item.id)[0];
      console.log(marker);
      $scope.mc.markerEvents.click(marker, undefined, item);
    }

    function updatePreferences() {
      // TODO: this causes several events to be broadcast every time a single
      // change is made. This needs to be updated so that a single object is
      // built, and the preferences service receives and handles it and
      // broadcasts a single event. (The reason this *needs* doing is that the
      // MapController has to iterate over every map marker whenever it receives
      // a filter preference change event.
      Object.keys(vm.preferences).forEach((k) => {
        filterPreferences.set(k, vm.preferences[k]);
      });
    }
  }

  FilterMenuController.$inject = ['$scope', 'filterPreferences'];
  angular.module('divesites.filterMenu').controller('FilterMenuController', FilterMenuController);
})();
