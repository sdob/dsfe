(function() {
  'use strict';
  function InformationCardChartsController($scope) {
    const vm = this;
    activate();

    function activate() {
      vm.site = $scope.site;
    }
  }

  InformationCardChartsController.$inject = [
    '$scope',
  ];
  angular.module('divesites.informationCard').controller('InformationCardChartsController', InformationCardChartsController);
})();
