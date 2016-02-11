(function() {
  'use strict';

  function CompressorInformationCardController($auth, $document, $location, $rootScope, $scope, $timeout, $uibModal, dsapi, dsimg, informationCardService, localStorageService) {
    const vm = this;
    vm.isLoading = true;
    activate();

    function activate() {
      const type = $scope.type;
      const id = $scope.id;
      const { apiCall } = informationCardService.apiCalls[type];

      // Retrieve site information from scope if we've got it
      vm.site = $scope.site || {};
      if (vm.site.geocoding_data) {
        vm.site.locData = informationCardService.formatGeocodingData(vm.site);
      }

      vm.site.images = {};
      vm.siteType = type;
      vm.siteID = id;

      /* Wire up functions */
      vm.isAuthenticated = $auth.isAuthenticated;

      vm.sectionVisibilities = {
        defaultSection: true,
        uploadImageForm: false,
      };

      // Retrieve the site data
      apiCall(id)
      .then((response) => {
        vm.site = Object.assign(vm.site, response.data);
        vm.site.locData = vm.site.locData ||  informationCardService.formatGeocodingData(vm.site);
        $scope.site = vm.site;

        vm.userIsOwner = informationCardService.userIsOwner(vm.site);
      });

      $timeout(() => {
        vm.isLoading = false;
      });
    }
  }

  CompressorInformationCardController.$inject = ['$auth',
    '$document',
    '$location',
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'dsimg',
    'informationCardService',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('CompressorInformationCardController', CompressorInformationCardController);
})();
