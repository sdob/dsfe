(function() {
  'use strict';
  function InformationCardChartsController($scope, userSettingsService) {
    const vm = this;
    activate();

    function activate() {
      vm.site = $scope.site;
      vm.units = userSettingsService.getUserSettings().units;
      if (vm.units === 'si') {
        console.log('units are SI');
      } else {
        // Units are imperial
      }
    }
  }

  InformationCardChartsController.$inject = [
    '$scope',
    'userSettingsService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardChartsController', InformationCardChartsController);
})();
