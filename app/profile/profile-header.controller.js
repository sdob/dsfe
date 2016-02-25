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
      vm.summonProfileImageUploadModal = summonImageUploadModal;
      vm.unfollow = unfollow;

      if (vm.isAuthenticated()) {
        vm.ownID = localStorageService.get('user');
      }

      // Wait for profile controller to receive the user data before updating
      $scope.$on('user-loaded', (e, user) => {
        console.log('profile header heard user-loaded');
        vm.user = user;
        const userId = vm.user.id;

        // Check whether the viewer is logged in
        if (vm.isAuthenticated()) {
          let isFollowing = false;
          // Check whether this user is being followed by the viewer
          followService.userIsFollowing(vm.user)
          .then((result) => {
            console.log(result);
            isFollowing = result;
            // Then set a flag
            vm.userIsFollowing = isFollowing;
            console.log('is the user following? ' + vm.userIsFollowing);
            // Display the follow/unfollow button
            vm.hasLoadedFollowStatus = true;
          });
        }

        // Retrieve the user profile
        profileService.getUserProfile(userId)
        .then((profile) => {
          // Put profile data into scope
          vm.user = profileService.formatResponseData(profile);

          // Ensure that nothing is undefined
          vm.user.compressors = vm.user.compressors || [];
          vm.user.divesites = vm.user.divesites || [];
          vm.user.slipways = vm.user.slipways || [];

          // Build a 'contributions' list
          vm.user.placesAdded = [].concat(
            vm.user.divesites.map((x) => Object.assign({ type: 'divesite' }, x)),
              vm.user.compressors.map((x) => Object.assign({ type: 'compressor' }, x)),
                vm.user.slipways.map((x) => Object.assign({ type: 'slipway' }, x))
          );

          //console.log(vm.user.placesAdded);
          console.log($scope);

          // Look for a profile image
          return dsimg.getUserProfileImage(profile.id);
        })
        .then((response) => {
          // If we get a successful response, use it
          const url = $.cloudinary.url(response.data.public_id, {
            width: 318,
            height: 318,
            crop: 'fill',
          });
          // Push this into the next tick
          $timeout(() => {
            vm.profileImageUrl = url;
            vm.dsimgHasResponded = true;
          }, 0);
        })
        .catch((err) => {
          // On failure (including 404) jus tmake sure that
          // the UI is clean
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
        console.log(response.data);
        vm.userIsFollowing = true; // User can't follow any more
      })
      .catch((err) => {
        console.error(err);
      });
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

    function unfollow() {
      dsactivity.unfollowUser(vm.user.id)
      .then((response) => {
        vm.userIsFollowing = false;
      })
      .catch((err) => {
        console.error(err);
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
      instance.result.then((reason) => {
        console.log(`modal dismissed with reason: ${reason}`);
        if (reason === 'uploaded') {
          dsimg.getUserProfileImage(vm.user.id)
          .then((response) => {
            console.log('received response from dsimg');
            console.log(response.data);
            const url = formatHeroImageUrl(response);
            $timeout(() => {
              console.log('updating vm.profileImageUrl');
              console.log(url);
              vm.profileImageUrl = url;
            }, 0);
          })
          .catch((err) => {
            console.error(`this shouldn't happen - we've uploaded an image`);
          });
        }
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
