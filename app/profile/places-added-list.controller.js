(function() {
  'use strict';

  function PlacesAddedListController($scope, $timeout) {
    const vm = this;
    activate();

    function activate() {
      vm.toggleVisibility = toggleVisibility;
      vm.user = $scope.user;
      vm.visibility = {
        compressor: true,
        divesite: true,
        slipway: true,
      };
    }

    function toggleVisibility(type) {
      $timeout(() => {
        vm.visibility[type] = !vm.visibility[type];
      });
    }
  }

  PlacesAddedListController.$inject = [
    '$scope',
    '$timeout',
  ];
  angular.module('divesites.profile').controller('PlacesAddedListController', PlacesAddedListController);
})();
