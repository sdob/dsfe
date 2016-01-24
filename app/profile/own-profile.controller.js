(function() {
  'use strict';
  function OwnProfileController($scope, $uibModal, cloudinaryTransformation, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    function activate() {
      vm.editable = true;
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
      });
    }
  }

  OwnProfileController.$inject = [
    '$scope',
    '$uibModal',
    'cloudinaryTransformation',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('OwnProfileController', OwnProfileController);
})();
