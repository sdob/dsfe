(function() {
  'use strict';

  function SearchMenuController($scope, $timeout, markerService) {
    const vm = this;
    activate();

    function activate() {
      console.log('SearchMenuController.activate()');
      vm.handleSearchSelect = handleSearchSelect;
      //$scope.defaultMarkerIcons = markerService.defaultMarkerIcons;
    }

    function handleSearchSelect(item) {
      $scope.$emit('search-selection', item);
    }
  }

  SearchMenuController.$inject = [
    '$scope',
    '$timeout',
    'markerService',
  ];
  angular.module('divesites.map').controller('SearchMenuController', SearchMenuController);
})();
