(function() {
  'use strict';
  function ProfileHeaderController($auth, $scope, $timeout, $uibModal, dsactivity, dsapi, dsimg, followService, localStorageService, profileService) {
    const cloudinaryIdKey = 'public_id';
    const vm = this;
    activate();

    function activate() {
      console.log('ProfileHeaderController.activate()');

      vm.dsimgHasResponded = false;
      vm.follow = follow;
      vm.hasLoadedFollowStatus = false;
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.summonDeleteProfileImageModal = summonDeleteProfileImageModal;
      vm.summonFollowModal = summonFollowModal;
      vm.summonProfileImageUploadModal = summonImageUploadModal;
      vm.unfollow = unfollow;

      if (vm.isAuthenticated()) {
        vm.ownID = localStorageService.get('user');
      }

      // Wait for profile controller to receive the user data before updating
      $scope.$on('user-loaded', (e, user) => {
        console.log('profile header heard user-loaded');
        vm.user = user;

        // Retrieve follower/follow lists
        dsactivity.getUserFollowers(user.id)
        .then((response) => {
          vm.followers = response.data;
        });

        dsactivity.getUserFollows(user.id)
        .then((response) => {
          vm.follows = response.data;
        });

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

        dsimg.getUserProfileImage(vm.user.id)
        .then((response) => {
          // If we get a successful response, use it for the main profile image
          const url = $.cloudinary.url(response.data.public_id, {
            width: 318,
            height: 318,
            crop: 'fill',
          });
          // Push UI update to the next tick
          $timeout(() => {
            vm.profileImageUrl = url;
            vm.dsimgHasResponded = true;
          }, 0);
        })
        .catch((err) => {
          // On failure (including 404) just make sure that the UI is clean
          console.error(err);
          $timeout(() => {
            vm.dsimgHasResponded = true;
          }, 0);
        });
      });
    }

    function follow() {
      dsactivity.followUser(vm.user.id)
      .then((response) => {
        // The viewing user is now following this profile's user
        vm.userIsFollowing = true;
      })
      .catch((err) => {
        console.error(err);
      });
    }

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

    function summonDeleteProfileImageModal() {
      console.log('summoning delete profile image modal');
      const instance = $uibModal.open({
        templateUrl: 'profile/delete-profile-image-modal.template.html',
        controller: 'DeleteProfileImageModalController',
        controllerAs: 'vm',
        resolve: {
          user: () => vm.user,
        },
        size: 'sm',
      });
      instance.result.then((reason) => {
        if (reason === 'deleted') {
          console.log('deleted');
          $timeout(() => {
            vm.profileImageUrl = undefined;
          });
        }
      });
    }

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
    }

    function summonImageUploadModal() {
      // Summon a modal dialog to allow the user to upload a new image
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

    function unfollow() {
      dsactivity.unfollowUser(vm.user.id)
      .then((response) => {
        // The viewing user is now not following this profile's user
        vm.userIsFollowing = false;
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  ProfileHeaderController.$inject = [
    '$auth',
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
