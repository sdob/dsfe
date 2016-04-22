(function() {
  'use strict';
  function ProfileController($auth, $location, $routeParams, $rootScope, $scope, $timeout, dsactivity, dsapi, dsimg, informationCardService, localStorageService, profileService, userSettingsService) {
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
      // Check whether the viewing user and the profile owner
      // are the same person. If they are, then load the full,
      // visible-to-owner-only profile.
      let apiCall;
      if ($auth.isAuthenticated() && userId === localStorageService.get('user')) {
        $timeout(() => {
          vm.editable = true;
        });
        apiCall = dsapi.getOwnProfile;
      } else {
        apiCall = dsapi.getUser;
      }

      // Get this user's profile information from the API server;
      // either the third-party-visible profile or the full owner-only
      // profile. dsapi.getOwnProfile() doesn't take any parameters, so
      // it'll silently ignore them
      apiCall(userId)
      //dsapi.getUser(userId)
      .then((response) => {
        // Format the incoming response
        vm.user = profileService.formatResponseData(response.data);
        // Format the places-added  list
        vm.user.placesAdded = profileService.formatUserProfilePlacesAdded(vm.user);
        // Broadcast an event to child controllers letting them know that
        // the information has arrived
        $scope.$broadcast('user-loaded', vm.user);
      });

      // Listen for events emitted by the dive log controller
      $scope.$on('dive-log-updated', (e) => {
        dsapi.getUserDives(userId)
        .then((response) => {
          vm.user.dives = response.data;
        });
      });

      // This event should only fire once during the controllers'
      // lifetimes, and we'll respond with a message that the
      // feed controller should/shouldn't load the feed
      $scope.$on('feed-controller-initialized', (e) => {
        console.log(`heard 'feed-controller-initialized'`);
        if ($location.$$search.tab === 'feed') {
          $scope.$broadcast('show-feed');
        }
      });
    }
  }

  ProfileController.$inject = [
    '$auth',
    '$location',
    '$routeParams',
    '$rootScope',
    '$scope',
    '$timeout',
    'dsactivity',
    'dsapi',
    'dsimg',
    'informationCardService',
    'localStorageService',
    'profileService',
    'userSettingsService',
  ];
  angular.module('divesites.profile').controller('ProfileController', ProfileController);
})();
