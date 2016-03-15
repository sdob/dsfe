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
      console.log('palscope');
      console.log($scope);
    }

    function toggleVisibility(type) {
      $timeout(() => {
        console.log(`toggling visibility for ${type}`);
        vm.visibility[type] = !vm.visibility[type];
        console.log(vm.visibility);
      });
    }
  }

  PlacesAddedListController.$inject = [
    '$scope',
    '$timeout',
  ];
  angular.module('divesites.profile').controller('PlacesAddedListController', PlacesAddedListController);
})();
