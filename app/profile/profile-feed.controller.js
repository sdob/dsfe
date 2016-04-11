(function() {
  'use strict';

  function ProfileFeedController($auth, $scope, $timeout, dsactivity, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;

    vm.feed = {
      results: [],
    };
    // Is the user authenticated?
    vm.isAuthenticated = $auth.isAuthenticated;
    // Are we waiting for an API request to return?
    vm.isLoading = false;
    // Feed-loading method
    vm.loadFeed = loadFeed;
    // Can we retrieve more pages of the feed?
    vm.next = true;
    // What's the offset of the next page?
    vm.offset = 0;
    // We'll maintain a set of user profile image URLs in this map, so that
    // we don't have to make an API request every time we load a new feed item
    vm.userProfileImageURLs = {};
    // Are we viewing the tab?
    vm.viewing = true;

    // Run activate block
    activate();

    function activate() {
      // If the user is authenticated, fetch their ID
      if (vm.isAuthenticated()) {
        vm.ownID = localStorageService.get('user');
      }

      // Decide whether we're retrieving our own feed or another user's
      // (since other users' feeds shouldn't display their follows'
      // activity)
      if (vm.ownID && $scope.user.id === vm.ownID) {
        vm.apiCall = (offset) => dsactivity.getOwnActivity(offset);
      } else {
        vm.apiCall = (offset) => dsactivity.getUserActivity($scope.user.id, offset);
      }

      /*
       * Listen for show/hide feed events from parent.
       * This will determine whether hitting the bottom of the page should
       * trigger an API request.
       */

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
    }

    // Request the next page of the user's feed
    function loadFeed() {
      // If we know that there's nothing left, then bail out
      if (!vm.next) {
        console.log('bailing');
        return;
      }

      // Otherwise, send the request to the API
      console.log('loading feed!');
      // Show the loading spinner
      vm.isLoading = true;
      // Make the  request
      vm.apiCall(vm.offset)
      .then((response) => {
        // Update the UI to show that the response has arrived
        vm.isLoading = false;
        // Coerce the 'next' field to a boolean
        vm.next = !!response.data.next;
        // Increment the offset for the next page request
        vm.offset += response.data.results.length;
        // Add the activity items to the list of feed results
        vm.feed.results.push(...response.data.results);
        vm.feed.results.forEach(ensureItemUserProfileImageUrlIsInCache);
      });

      function ensureItemUserProfileImageUrlIsInCache(i) {
        // Get the ID of the user whose profile image URL we need
        const id = i.actor.id;

        if (vm.userProfileImageURLs.hasOwnProperty(id)) {
          // If this user ID is in the profile image URL cache, then
          // set it on each matching member of the list of feed results
          vm.feed.results.filter(i => i.actor.id === id).forEach((i) => {
            i.actor.profileImageUrl = vm.userProfileImageURLs[id];
          });
        } else {
          // If the user ID is missing, then make an API request for the
          // corresponding profile image object's URL
          dsimg.getUserProfileImage(id)
          .then((response) => {
            // Format the URL as a thumbnail
            const profileImageUrl = $.cloudinary.url(response.data.public_id, {
              height: 60,
              width: 60,
              crop: 'fill',
              gravity: 'face',
            });
            // Add the formatted URL to the cache
            vm.userProfileImageURLs[id] = profileImageUrl;
            // Push UI updates into the next digest cycle
            $timeout(() => {
              // Update feed items that match the user ID with the new
              // profile image URL
              vm.feed.results.filter(i => i.actor.id === id).forEach((i) => {
                i.actor.profileImageUrl = profileImageUrl;
              });
            });
          });
        }
      }
    }
  }

  ProfileFeedController.$inject = [
    '$auth',
    '$scope',
    '$timeout',
    'dsactivity',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('ProfileFeedController', ProfileFeedController);
})();
