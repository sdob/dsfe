(function() {
  'use strict';
  function OwnProfileController($rootScope, $scope, $uibModal,  dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    function activate() {
      console.log('OwnProfileController.activate()');
      vm.editable = true;
      $scope.editable = true;
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
      })
      .catch((err) => {
        console.error('error from dsapi');
        console.error(err);
      });
    }
  }

  OwnProfileController.$inject = [
    '$rootScope',
    '$scope',
    '$uibModal',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('OwnProfileController', OwnProfileController);
})();
