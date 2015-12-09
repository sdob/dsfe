(function () {
  'use strict';

  function InformationCardController($scope) {
    const vm = this;
    activate();

    function activate() {
      vm.hide = hide;
      vm.visible = false;

      // Listen for clicks on main map to display the card
      $scope.$on('show-information-card', show);
      $scope.$on('$destroy', show);
    }

    function hide() {
      vm.visible = false;
    }

    function show(e, site) {
      vm.visible = true;
      console.info(site);
      vm.site = site;
    }
  }

  InformationCardController.$inject = ['$scope'];
  angular.module('divesites').controller('InformationCardController', InformationCardController);
})();
