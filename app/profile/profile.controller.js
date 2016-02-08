(function() {
  'use strict';
  function ProfileController($routeParams, $rootScope, $scope, $timeout, dsapi, dsimg, profileService) {
    const vm = this;
    activate();

    function activate() {
      console.log('ProfileController.activate()');

      // Get the user's ID and put it into $scope
      const userId = $routeParams.userId;
      console.log(`loading user ${userId}`);
      vm.userId = userId;
      $scope.userId = userId;

      // Get this user's profile information from the API server
      dsapi.getUser(userId)
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
      });
    }
  }

  ProfileController.$inject = [
    '$routeParams',
    '$rootScope',
    '$scope',
    '$timeout',
    'dsapi',
    'dsimg',
    'profileService',
  ];
  angular.module('divesites.profile').controller('ProfileController', ProfileController);
})();
