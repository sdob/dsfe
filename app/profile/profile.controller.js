(function() {
  'use strict';
  function ProfileController($routeParams, $rootScope, $scope, $timeout, dsactivity, dsapi, dsimg, informationCardService, profileService, userSettingsService) {
    const vm = this;

    // Get the user's ID and put it into $scope
    const userId = $routeParams.userId;
    $scope.userId = userId;
    vm.userId = userId;
    vm.user = {
      id: userId,
    };

    // Run the activate block
    activate();

    function activate() {
      console.log('ProfileController.activate()');

      // Get this user's profile information from the API server
      dsapi.getUser(userId)
      .then((response) => {
        // Format the incoming response
        vm.user = profileService.formatResponseData(response.data);
        // Format the places-added  list
        vm.user.placesAdded = profileService.formatUserProfilePlacesAdded(vm.user);
        // Broadcast an event to child controllers letting them know that
        // the information has arrived
        $scope.$broadcast('user-loaded', vm.user);
      });

      // Retrieve images this user has uploaded
      dsimg.getUserImages(vm.user.id)
      .then((response) => {
        $timeout(() => {
          vm.user.imagesAdded = profileService.formatUserProfileImagesAdded(response);
        });
      });

      // Listen for events emitted by the dive log controller
      $scope.$on('dive-log-updated', (e) => {
        dsapi.getUserDives(userId)
        .then((response) => {
          vm.user.dives = response.data;
        });
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
