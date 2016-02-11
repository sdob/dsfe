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

      //vm.site = $scope.site || {};
      $scope.site = $scope.site || {};
      if ($scope.site.geocoding_data) {
        $scope.site.locData = informationCardService.formatGeocodingData($scope.site);
      }

      vm.siteID = id;
      vm.siteType = type;

      /* Wire up functions */
      vm.isAuthenticated = $auth.isAuthenticated;

      // Retrieve slipway data
      apiCall(id)
      .then((response) => {
        $scope.site = Object.assign($scope.site, response.data);
        $scope.site.locData = $scope.site.locData || informationCardService.formatGeocodingData($scope.site);

        vm.userIsOwner = informationCardService.userIsOwner($scope.site);
        $timeout(() => {
          vm.isLoading = false;
        });
      });

      // Retrieve comments
      dscomments.getSlipwayComments(id)
      .then((response) => {
        $timeout(() => {
          $scope.site.comments = response.data;
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
