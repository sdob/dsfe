(function() {
  'use strict';

  function SlipwayInformationCardController($auth, $document, $location, $rootScope, $scope, $uibModal, dsapi, dsimg, informationCardService, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      console.log('SlipwayInformationCardController.activate()');

      vm.site = $scope.site;

      /* Wire up functions */
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.userIsOwner = informationCardService.userIsOwner(vm.site);
    }
  }

  SlipwayInformationCardController.$inject = ['$auth',
    '$document',
    '$location',
    '$rootScope',
    '$scope',
    '$uibModal',
    'dsapi',
    'dsimg',
    'informationCardService',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('SlipwayInformationCardController', SlipwayInformationCardController);
})();
