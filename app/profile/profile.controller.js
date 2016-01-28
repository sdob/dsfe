(function() {
  'use strict';
  function ProfileController($routeParams, $rootScope, $scope, dsapi, dsimg, profileService) {
    const vm = this;
    activate();

    function activate() {
      console.log('ProfileController.activate()');

      // Get the user's ID and put it into $scope
      const userId = $routeParams.userId;
      vm.userId = userId;
      $scope.userId = userId;

      // Get this user's profile information from the API server
      dsapi.getUser(userId)
      .then((response) => {
        // Query the image server for a profile image for this user
        vm.user = profileService.formatResponseData(response.data);
        console.log(vm.user);
        $rootScope.$broadcast('profile-data-loaded', response.data);
      });
    }
  }

  ProfileController.$inject = [
    '$routeParams',
    '$rootScope',
    '$scope',
    'dsapi',
    'dsimg',
    'profileService',
  ];
  angular.module('divesites.profile').controller('ProfileController', ProfileController);
})();
