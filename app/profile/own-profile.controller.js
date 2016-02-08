(function() {
  'use strict';
  function OwnProfileController($rootScope, $scope, $timeout, $uibModal, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    function activate() {
      console.log('OwnProfileController.activate()');
      vm.editable = true;
      $scope.editable = true;
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
        vm.user.imagesAdded = [];
        // Ensure that nothing is undefined
        vm.user.compressors = vm.user.compressors || [];
        vm.user.divesites = vm.user.divesites || [];
        vm.user.slipways = vm.user.slipways || [];

        // Build a 'contributions' list
        vm.user.placesAdded = [].concat(
          vm.user.divesites.map((x) => Object.assign({ type: 'divesite' }, x)),
            vm.user.compressors.map((x) => Object.assign({ type: 'compressor' }, x)),
              vm.user.slipways.map((x) => Object.assign({ type: 'slipway' }, x))
        );
        $scope.$broadcast('user-loaded', vm.user);
        return dsimg.getUserImages(vm.user.id);
      })
      .then((response) => {
        console.log(`response from dsimg: ${response.data.length}`);
        $timeout(() => {
          vm.user.imagesAdded = response.data;
          vm.user.imagesAdded.forEach((i) => {
            dsapi.getDivesite(i.divesiteID)
            .then((response) => {
              console.log('boom', i, response.data);
              i.divesiteName = response.data.name;
            });
          });
        });
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  OwnProfileController.$inject = [
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('OwnProfileController', OwnProfileController);
})();
