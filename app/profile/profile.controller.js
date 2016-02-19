(function() {
  'use strict';
  function ProfileController($routeParams, $rootScope, $scope, $timeout, dsapi, dsimg, informationCardService, profileService, userSettingsService) {
    const vm = this;
    activate();

    function activate() {
      console.log('ProfileController.activate()');

      // Get the user's ID and put it into $scope
      const userId = $routeParams.userId;
      console.log(`loading user ${userId}`);
      vm.userId = userId;
      $scope.userId = userId;
      vm.user = {
        id: userId,
      };

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
            let apiCall;
            let id;
            // FIXME: ugly hack because dsimg doesn't return a site type
            if (i.hasOwnProperty('divesiteID')) {
              console.log(`looking at a divesite with id ${i.divesiteID}`);
              apiCall = dsapi.getDivesite;
              id = i.divesiteID;
            } else if (i.hasOwnProperty('slipwayID')) {
              console.log(`looking at a slipway with id ${i.slipwayID}`);
              apiCall = dsapi.getSlipway;
              id = i.slipwayID;
            } else if (i.hasOwnProperty('compressorID')) {
              console.log(`looking at a compressor with id ${i.compressorID}`);
              apiCall = dsapi.getCompressor;
              id = i.compressorID;
            }
            //dsapi.getDivesite(i.divesiteID)
            apiCall(id)
            .then((response) => {
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
    'informationCardService',
    'profileService',
    'userSettingsService',
  ];
  angular.module('divesites.profile').controller('ProfileController', ProfileController);
})();
