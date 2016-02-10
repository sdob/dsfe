(function() {
  'use strict';

  function SearchMenuController($scope, $timeout, markerService) {
    const vm = this;
    activate();

    function activate() {
      vm.handleSearchSelect = handleSearchSelect;
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
