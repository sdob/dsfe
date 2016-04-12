(function() {
  'use strict';

  function FollowModalController($auth, $timeout, $uibModalInstance, direction, dsimg, followService, localStorageService, user, users) {
    const vm = this;
    activate();

    function activate() {
      vm.direction = direction; // 'followers' or 'follows' or 'suggestions'?
      vm.dismiss = dismiss;
      vm.getSuggestions = getSuggestions;
      vm.follow = follow;
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.unfollow = unfollow;
      vm.user = user; // The user whose list we're viewing
      vm.users = users; // The members of the list we're viewing

      // If we're going to show suggestions, we need to show them first
      if (direction === 'suggestions') {
        vm.isLoading = true;
        console.log('finding suggestions');
        vm.getSuggestions()
        .then((users) => {
          vm.isLoading = false;
          console.log('suggestions returned!');
          console.log(users);
          vm.users = users;
        })
        .then(getProfileThumbnails)
        .then(checkFollowStatuses);
      } else {
        getProfileThumbnails();
        checkFollowStatuses();
      }

    }

    function checkFollowStatuses() {
      // If the viewing user is authenticated, then allow them to follow/unfollow
      // the members of the list
      if (vm.isAuthenticated()) {
        vm.viewingUserID = localStorageService.get('user');

        // Retrieve viewing user's follows once, then check each user's ID
        // against them (this means we only have to make a single API request
        // per controller activation)
        followService.getOwnFollows()
        .then((response) => {
          vm.ownFollowIDs = response.data.map(u => u.id);
          console.log('ownFollowIDCache:');
          console.log(vm.ownFollowIDs);
          vm.users.forEach((user) => {
            user.followStatusResolved = true;
            user.viewingUserIsFollowing = vm.ownFollowIDs.indexOf(user.id) >= 0;
          });
        });
      }
    }

    /* Close the modal, optionally passing a user object */
    function dismiss(user) {
      $uibModalInstance.close(user);
    }

    function follow(user) {
      followService.followUser(user)
      .then((result) => {
        // Update UI
        user.viewingUserIsFollowing = true;
      });
    }

    function getProfileThumbnails() {
      // Get profile thumbnails for each user in the list
      vm.users.forEach((user) => {
        dsimg.getUserProfileImage(user.id)
        .then((response) => {
          if (response && response.data && response.data.public_id) {
            user.profileImageUrl = $.cloudinary.url(response.data.public_id, {
              height: 60,
              width: 60,
              crop: 'fill',
              gravity: 'face',
            });
          }
        });
      });
    }

    function getSuggestions(user) {
      console.log('getting suggestions');
      return followService.getSuggestions();
    }

    function unfollow(user) {
      followService.unfollowUser(user)
      .then((result) => {
        user.viewingUserIsFollowing = false;
      });
    }
  }

  FollowModalController.$inject = [
    '$auth',
    '$timeout',
    '$uibModalInstance',
    'direction',
    'dsimg',
    'followService',
    'localStorageService',
    'user',
    'users',
  ];
  angular.module('divesites.profile').controller('FollowModalController', FollowModalController);
})();
