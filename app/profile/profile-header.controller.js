(function() {
  'use strict';
  function ProfileHeaderController($auth, $location, $scope, $timeout, $uibModal, dsactivity, dsapi, dsimg, followService, localStorageService, profileService) {
    const cloudinaryIdKey = 'public_id';
    const vm = this;
    // This flag lets the UI know whether we've received the profile image
    vm.dsimgHasResponded = false;
    // Let the viewing user follow this user (if they're not the same user)
    vm.follow = follow;
    // This flag lets the UI know whether we've resolved the question of
    // whether the viewing user is following this user (if they're not the
    // same user)
    vm.hasLoadedFollowStatus = false;
    // Pointer to the auth service's authentication checker
    vm.isAuthenticated = $auth.isAuthenticated;
    // Confirm profile image deletion
    vm.summonDeleteProfileImageModal = summonDeleteProfileImageModal;
    // Bring up the follow/follower information modal for this user
    vm.summonFollowModal = summonFollowModal;
    // Allow the user to edit their profile
    vm.summonProfileImageUploadModal = summonProfileImageUploadModal;
    // Let the viewing user unfollow this user (if they're not the same user)
    vm.unfollow = unfollow;

    // Run activate block
    activate();

    // Activate block: make API requests
    function activate() {
      console.log('ProfileHeaderController.activate()');

      // Retrieve the viewing user's ID
      if (vm.isAuthenticated()) {
        vm.ownID = localStorageService.get('user');
      }

      // Wait for profile controller to receive the user data before updating
      $scope.$on('user-loaded', (e, user) => {
        console.log('profile header heard user-loaded');
        vm.user = user;

        // Retrieve follow/follower stats and bind to scope
        updateUserFollowStats();

        // Check whether the viewer is logged in and allow them to follow/unfollow
        if (vm.isAuthenticated()) {
          let isFollowing = false;
          // Check whether this user is being followed by the viewer
          followService.userIsFollowing(vm.user)
          .then((result) => {
            // Then set a flag
            vm.userIsFollowing = result;
            // Display the follow/unfollow button
            vm.hasLoadedFollowStatus = true;
          });
        }

        // Retrieve this user's full profile image URL
        dsimg.getUserProfileImage(vm.user.id)
        .then((response) => {
          // Update the UI that we're no longer waiting
          vm.dsimgHasResponded = true;
          // If we get a successful response, use it for the main profile image
          if (response && response.data && response.data.public_id) {
            // Get a suitably-formatted version of the profile image
            const url = formatHeroImageUrl(response);
            // Push UI update to the next tick
            $timeout(() => {
              // Put the profile image URL into scope
              vm.profileImageUrl = url;
            });
          }
        })
        .catch((err) => {
          // On failure, make sure that the UI is clean
          console.error(err);
          $timeout(() => {
            vm.dsimgHasResponded = true;
          });
        });
      });
    }

    function follow() {
      // Make the API request
      dsactivity.followUser(vm.user.id)
      .then((response) => {
        // The viewing user is now following this profile's user
        vm.userIsFollowing = true;
      })
      .then(updateUserFollowStats)
      .catch((err) => {
        console.error(err);
      });
    }

    // Take an API response, pass it to the Cloudinary jQuery API, and
    // return a hero-sized image URL
    function formatHeroImageUrl(response) {
      const url = $.cloudinary.url(response.data.public_id, {
        width: 318,
        height: 318,
        crop: 'fill',
      });
      console.log('formatted hero image:');
      console.log(url);
      return url;
    }

    // Confirm that the user wants to delete their profile image
    function summonDeleteProfileImageModal() {
      console.log('summoning delete profile image modal');
      const instance = $uibModal.open({
        controller: 'DeleteProfileImageModalController',
        controllerAs: 'vm',
        resolve: {
          user: () => vm.user,
        },
        size: 'sm',
        templateUrl: 'profile/delete-profile-image-modal.template.html',
        windowClass: 'modal-center',
      });

      // When the modal is closed (not dismissed), check the reason, and
      // if the user asked to delete the image, update the UI accordingly
      instance.result.then((reason) => {
        if (reason === 'deleted') {
          console.log('deleted');
          $timeout(() => {
            vm.profileImageUrl = undefined;
          });
        }
      });
    }

    // Summon a follow modal. Direction here can be:
    // 'follows': (users whom this user follows)
    // 'followers': (users who follow this user)
    // 'suggestions' (a list of suggestions, to be shown on the user's own profile)
    function summonFollowModal(direction, userList) {
      const instance = $uibModal.open({
        templateUrl: 'profile/follow-modal.template.html',
        controller: 'FollowModalController',
        controllerAs: 'vm',
        resolve: {
          direction: () => direction,
          user: () => vm.user,
          users: () => userList,
        },
        size: 'lg',
      });

      // When the instance is closed or dismissed, update the user's follow stats.
      // We do this because changes are made while the modal is open, and don't
      // require the modal to be closed with a success-like result in order for
      // the header to need updating
      instance.closed.then(updateUserFollowStats);

      // On modal close, follow a link to selected user's profile
      // (if a user was selected) --- this handles the fact that
      // $locationChangeStart will close the modal instead
      instance.result
      .then((user) => {
        if (user !== undefined) {
          console.log(`heading for user ${user.id}`);
          return goToProfile(user);
        }
      });

      // Change location to the selected user's profile
      function goToProfile(user) {
        $location.path(`/users/${user.id}`);
      }
    }

    // Summon a modal dialog to allow the user to upload a new image
    function summonProfileImageUploadModal() {
      const instance = $uibModal.open({
        templateUrl: 'profile/upload-profile-image-modal.template.html',
        controller: 'ProfileImageUploadController',
        controllerAs: 'vm',
        resolve: {
          user: () => vm.user,
        },
        size: 'sm',
      });

      // When the modal dialog closes, if the user uploaded an image,
      // update their profile image
      instance.result.then((reason) => {
        if (reason === 'uploaded') {
          dsimg.getUserProfileImage(vm.user.id)
          .then((response) => {
            // format the profile image
            const url = formatHeroImageUrl(response);
            $timeout(() => {
              vm.profileImageUrl = url;
            }, 0);
          })
          .catch((err) => {
            console.error(`this shouldn't happen - we've uploaded an image`);
          });
        }
      });
    }

    // Stop the viewing user from following this user
    function unfollow() {
      dsactivity.unfollowUser(vm.user.id)
      .then((response) => {
        // The viewing user is now not following this profile's user
        vm.userIsFollowing = false;
      })
      .then(updateUserFollowStats)
      .catch((err) => {
        console.error(err);
      });
    }

    // Update the follow/follower statistics
    function updateUserFollowStats() {
      console.log('updating follow stats');
      // Retrieve follower list
      dsactivity.getUserFollowers(vm.user.id)
      .then((response) => {
        $timeout(() => {
          vm.followers = response.data;
        });
      });

      // Retrieve follow list
      dsactivity.getUserFollows(vm.user.id)
      .then((response) => {
        $timeout(() => {
          vm.follows = response.data;
        });
      });
    }
  }

  ProfileHeaderController.$inject = [
    '$auth',
    '$location',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsactivity',
    'dsapi',
    'dsimg',
    'followService',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('ProfileHeaderController', ProfileHeaderController);
})();
