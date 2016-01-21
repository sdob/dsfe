(function() {
  'use strict';
  function InformationCardChartsController($scope) {
    const vm = this;
    activate();

    function activate() {
      console.log('on chart controller activation, here is my scope:');
      console.log($scope);
      vm.site = $scope.site;
    }
  }

  InformationCardChartsController.$inject = [
    '$scope',
  ];
  angular.module('divesites.informationCard').controller('InformationCardChartsController', InformationCardChartsController);
})();
