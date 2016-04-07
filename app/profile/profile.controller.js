(function() {
  'use strict';
  function ProfileController($routeParams, $rootScope, $scope, $timeout, dsactivity, dsapi, dsimg, informationCardService, profileService, userSettingsService) {
    const vm = this;
    activate();

    function activate() {
      console.log('ProfileController.activate()');

      // Get the user's ID and put it into $scope
      const userId = $routeParams.userId;
      vm.userId = userId;
      $scope.userId = userId;
      vm.user = {
        id: userId,
      };

      $scope.$on('dive-log-updated', (e) => {
        dsapi.getUserDives(userId)
        .then((response) => {
          vm.user.dives = response.data;
        });
      });

      // Get this user's profile information from the API server
      dsapi.getUser(userId)
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
        vm.user.placesAdded = profileService.formatUserProfilePlacesAdded(vm.user);
        $scope.$broadcast('user-loaded', vm.user);

        // Retrieve images this user's uploaded
        return dsimg.getUserImages(vm.user.id);
      })
      .then((response) => {
        vm.user.imagesAdded = profileService.formatUserProfileImagesAdded(response);
      });
    }
  }

  ProfileController.$inject = [
    '$routeParams',
    '$rootScope',
    '$scope',
    '$timeout',
    'dsactivity',
    'dsapi',
    'dsimg',
    'informationCardService',
    'profileService',
    'userSettingsService',
  ];
  angular.module('divesites.profile').controller('ProfileController', ProfileController);
})();
