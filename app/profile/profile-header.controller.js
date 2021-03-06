(function() {
  'use strict';
  function ProfileHeaderController($auth, $location, $rootScope, $scope, $timeout, $uibModal, confirmModalService, dsactivity, dsapi, dsimg, followService, localStorageService, profileService) {
    const { reasons, summonConfirmModal } = confirmModalService;
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

      // Retrieve the viewing user's ID
      if (vm.isAuthenticated()) {
        vm.ownID = localStorageService.get('user');
      }

      // Wait for ProfileController to receive the user data before updating
      $scope.$on('user-loaded', (e, user) => {
        vm.user = user;

        // Retrieve follow/follower stats and bind to scope
        updateUserFollowStats();

        // Check whether the viewer is logged in and allow them to follow/unfollow
        if (vm.isAuthenticated()) {
          checkFollowStatus();
        }

        // Retrieve this user's full profile image URL
        retrieveAndBindProfileImage();
      });
    }

    function broadcastProfileImageChanged(public_id) {
      $rootScope.$broadcast('profile-image-changed', {
        public_id,
        user: vm.user.id,
      });
    }

    function checkFollowStatus() {
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

    function formatAsHeroImage(public_id) {
      const url = $.cloudinary.url(public_id, {
        width: 318,
        height: 318,
        crop: 'fill',
      });
      return url;
    }

    function retrieveAndBindProfileImage() {
      // Retrieve this user's full profile image URL
      dsimg.getUserProfileImage(vm.user.id)
      .then((response) => {
        // Update the UI that we're no longer waiting
        vm.dsimgHasResponded = true;
        // If we get a successful response, use it for the main profile image
        if (response && response.data && response.data.public_id) {
          // Get a suitably-formatted version of the profile image
          const url = formatAsHeroImage(response.data.public_id);
          // Push UI update to the next tick
          $timeout(() => {
            // Bind the profile image to a scope variable
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
    }

    // Confirm that the user wants to delete their profile image
    function summonDeleteProfileImageModal() {
      const instance = summonConfirmModal({
        templateUrl: 'profile/delete-profile-image-modal.template.html',
      });

      // When the modal is closed (not dismissed), check the reason, and
      // if the user asked to delete the image, update the UI accordingly
      instance.result.then((reason) => {
        if (reason === reasons.CONFIRMED) {
          broadcastProfileImageChanged(undefined);
          /*
          $rootScope.$broadcast('profile-image-changed', {
            public_id: undefined,
            user: vm.user.id,
          });
          */
          // Optimistically remove image from front-end straight awway
          $timeout(() => {
            vm.profileImageUrl = undefined;
          });
          // Make the API request to delete the image
          dsimg.deleteUserProfileImage(vm.user.id)
          .then((response) => {
            // We don't really need to do anything with this in production
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
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
        if (reason.reason === 'uploaded') {
          // We have the new public_id from the modal, so send that
          broadcastProfileImageChanged(reason.public_id);
          // Update the profile image in the header
          vm.profileImageUrl = formatAsHeroImage(reason.public_id);
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
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    'confirmModalService',
    'dsactivity',
    'dsapi',
    'dsimg',
    'followService',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('ProfileHeaderController', ProfileHeaderController);
})();
