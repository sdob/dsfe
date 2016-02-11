(function() {
  'use strict';

  function SlipwayInformationCardController($auth, $document, $location, $rootScope, $scope, $timeout, $uibModal, dsapi, dscomments, dsimg, informationCardService, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.isLoading = true;
      console.log('SlipwayInformationCardController.activate()');
      const id = $scope.id;
      const type = $scope.type;
      const { apiCall } = informationCardService.apiCalls[type];

      vm.site = $scope.site || {};
      if (vm.site.geocoding_data) {
        vm.site.locData = informationCardService.formatGeocodingData(vm.site);
      }

      vm.siteID = id;
      vm.siteType = type;

      /* Wire up functions */
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.toggleSectionVisibility = toggleSectionVisibility;

      apiCall(id)
      .then((response) => {
        vm.site = Object.assign(vm.site, response.data);
        vm.site.locData = vm.site.locData || informationCardService.formatGeocodingData(vm.site);
        $scope.site = vm.site;

        vm.userIsOwner = informationCardService.userIsOwner(vm.site);
        $timeout(() => {
          vm.isLoading = false;
        });
      });
    }
  }

  SlipwayInformationCardController.$inject = ['$auth',
    '$document',
    '$location',
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'dscomments',
    'dsimg',
    'informationCardService',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('SlipwayInformationCardController', SlipwayInformationCardController);
})();
