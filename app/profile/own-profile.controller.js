(function() {
  'use strict';
  function OwnProfileController($rootScope, $scope, $uibModal, cloudinaryTransformation, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    function activate() {
      vm.editable = true;
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
        $rootScope.$broadcast('profile-data-loaded', response.data);
      });
    }
  }

  OwnProfileController.$inject = [
    '$rootScope',
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
