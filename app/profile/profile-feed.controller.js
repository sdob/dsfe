(function() {
  'use strict';

  function ProfileFeedController($auth, $scope, $timeout, dsactivity, dsimg, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.feed = {
        results: [],
      };
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.loadFeed = loadFeed;
      vm.next = true;
      vm.offset = 0;
      // We'll maintain a set of user profile image URLs
      vm.userProfileImageURLs = {};
      // Are we viewing the tab? Initially, yes
      vm.viewing = true;

      if (vm.isAuthenticated()) {
        vm.ownID = localStorageService.get('user');
      }

      // Decide whether we're retrieving our own feed or another user's
      if (vm.ownID && $scope.user.id === vm.ownID) {
        vm.apiCall = (offset) => dsactivity.getOwnActivity(offset);
      } else {
        vm.apiCall = (offset) => dsactivity.getUserActivity($scope.user.id, offset);
      }

      // Listen for show/hide feed events from parent
      $scope.$on('hide-feed', () => {
        $timeout(() => {
          console.log('heard hide-feed event');
          vm.viewing = false;
        });
      });

      $scope.$on('show-feed', () => {
        $timeout(() => {
          console.log('heard show-feed event');
          vm.viewing = true;
        });
      });

      // Kick things off by making an initial call
      // vm.loadFeed();
    }

    function loadFeed() {
      // If we know that there's nothing left, then bail out
      if (!vm.next) {
        console.log('bailing');
        return;
      }

      console.log('loading feed!');
      vm.isLoading = true;
      vm.apiCall(vm.offset)
      .then((response) => {
        vm.isLoading = false;
        vm.next = !!response.data.next;
        vm.offset += response.data.results.length;
        vm.feed.results.push(...response.data.results);
        vm.feed.results.forEach((i) => {
          const id = i.actor.id;
          if (vm.userProfileImageURLs.hasOwnProperty(id)) {
            vm.feed.results.filter(i => i.actor.id === id).forEach((i) => {
              i.actor.profileImageUrl = vm.userProfileImageURLs[id];
            });
          } else {
            dsimg.getUserProfileImage(id)
            .then((response) => {
              const profileImageUrl = $.cloudinary.url(response.data.image.public_id, {
                height: 60,
                width: 60,
                crop: 'fill',
                gravity: 'face',
              });
              vm.userProfileImageURLs[id] = profileImageUrl;
              $timeout(() => {
                vm.feed.results.filter(i => i.actor.id === id).forEach((i) => {
                  i.actor.profileImageUrl = profileImageUrl;
                });
              });
            });
          }
        });
      });
    }

  }

  ProfileFeedController.$inject = [
    '$auth',
    '$scope',
    '$timeout',
    'dsactivity',
    'dsimg',
    'localStorageService',
  ];
  angular.module('divesites.profile').controller('ProfileFeedController', ProfileFeedController);
})();
