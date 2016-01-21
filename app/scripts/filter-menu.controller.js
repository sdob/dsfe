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
      console.log(`handling select for '${item.name}'`);
      console.log($scope.mc);
      $scope.mc.map.center = {
        latitude: item.latitude,
        longitude: item.longitude,
      };

      // Emulate a marker click here
      console.log($scope.mc.mapMarkers);
      const marker = $scope.mc.mapMarkers.filter((m) => m.id === item.id)[0];
      console.log(marker);
      $scope.mc.markerEvents.click(marker, undefined, item);
    }

    function updatePreferences() {
      Object.keys(vm.preferences).forEach((k) => {
        filterPreferences.set(k, vm.preferences[k]);
      });
    }
  }

  FilterMenuController.$inject = ['$scope', 'filterPreferences'];
  angular.module('divesites').controller('FilterMenuController', FilterMenuController);
})();
