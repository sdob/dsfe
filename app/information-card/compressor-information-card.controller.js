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
      $scope.site = $scope.site || {};
      if ($scope.site.geocoding_data) {
        $scope.site.locData = informationCardService.formatGeocodingData($scope.site);
      }

      $scope.site.images = {};
      vm.siteType = type;
      vm.siteID = id;

      /* Wire up functions */
      vm.isAuthenticated = $auth.isAuthenticated;

      // Retrieve the site data
      apiCall(id)
      .then((response) => {
        vm.isLoading = false;
        $scope.site = Object.assign($scope.site, response.data);
        $scope.site.locData = $scope.site.locData ||  informationCardService.formatGeocodingData($scope.site);

        vm.userIsOwner = informationCardService.userIsOwner($scope.site);
      });

      $timeout(() => {
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
