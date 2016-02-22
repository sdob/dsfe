(function() {
  'use strict';
  function InformationCardChartsController($scope, userSettingsService) {
    const vm = this;
    activate();

    function activate() {
      vm.site = $scope.site;
    }
  }

  InformationCardChartsController.$inject = [
    '$scope',
    'userSettingsService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardChartsController', InformationCardChartsController);
})();
