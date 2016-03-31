(function() {
  'use strict';

  function FollowModalController($auth, direction, dsimg, followService, user, users) {
    const vm = this;
    activate();

    function activate() {
      vm.direction = direction; // 'followers' or 'follows'?
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.user = user; // The user whose list we're viewing
      vm.users = users; // The members of the list we're viewing

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

      // If the viewing user is authenticated, then allow them to follow/unfollow
      // the members of the list
      if (vm.isAuthenticated()) {
        // Check whether each of the members of this list is followed by the viewing user
        vm.users.forEach((user) => {
          followService.userIsFollowing(user)
          .then((isFollowing) => {
            user.viewingUserIsFollowing = isFollowing;
          });
        });
      }
    }
  }

  FollowModalController.$inject = [
    '$auth',
    'direction',
    'dsimg',
    'followService',
    'user',
    'users',
  ];
  angular.module('divesites.profile').controller('FollowModalController', FollowModalController);
})();
