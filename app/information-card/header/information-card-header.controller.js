(function() {
  'use strict';
  function InformationCardHeaderController($auth, $scope, $timeout, dsapi, dsimg, followService, informationCardService, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.followStatusHasLoaded = false;
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.toggleFollowing = toggleFollowing;

      if (vm.isAuthenticated()) {
        vm.viewingUserID = localStorageService.get('user');
      }

      getAndApplySiteHeaderImage();

      // Wait for main information card to load site data asynchronously,
      // then perform a single check to see if the viewing user is following
      // the owner
      $scope.$on('site-loaded', (e, site) => {
        const owner = site.owner;

        // Retrieve the owner's profile image URL
        dsimg.getUserProfileImage(owner.id)
        .then((response) => {
          console.log('retrieved owner profile image');
          if (response && response.data && response.data.public_id) {
            vm.ownerProfileImageUrl = $.cloudinary.url(response.data.public_id, {
              height: 18,
              width: 18,
              crop: 'fill',
              gravity: 'face',
            });
            console.log(vm.ownerProfileImageUrl);
          }
        });

        // If the viewing user is authenticated, consult the follow API
        // to see if they're following the site owner
        if (vm.isAuthenticated()) {
          const viewingUserID = localStorageService.get('user');
          followService.userIsFollowing(owner)
          .then((result) => {
            vm.userIsFollowingOwner = result;
            $timeout(() => {
              vm.followStatusHasLoaded = true;
            });
          });
        }
      });

      $scope.$on('header-image-changed', () => {
        // The main information card handles the logic for changing
        // the header image; we just listen and obediently make calls
        // to DSAPI. (In the future, we should probably pass the image
        // URL up the chain to avoid having to do this, but let's ship
        // for now.)
        console.log(`information card header heard 'header-image-changed`);
        getAndApplySiteHeaderImage();
      });
    }

    function getApiCallByType(type) {
      // XXX Change the function calls
      if (type === 'compressor') {
        return informationCardService.getDivesiteHeaderImage;
      }
      if (type === 'slipway') {
        return informationCardService.getDivesiteHeaderImage;
      }
      return informationCardService.getDivesiteHeaderImage;
    }

    function getAndApplySiteHeaderImage() {
      dsimg.getSiteHeaderImage($scope.site)
      .then((headerImage) => {
        if (headerImage && headerImage.data && headerImage.data.public_id) {
          vm.headerImageUrl = $.cloudinary.url(headerImage.data.public_id, {});
          vm.backgroundStyle = {
            background: `url(${vm.headerImageUrl}) center / cover`,
          };
        } else {
          delete(vm.headerImageUrl);
          delete(vm.backgroundStyle);
        }
      });
    }

    /* Send an API request to toggle whether the viewing user is following
     * the site owner
     */
    function toggleFollowing(user, evt) {
      // Flag that we're in the middle of an AJAX operation
      vm.followStatusHasLoaded = false;
      // Stop the event from propagating (so that we don't proceed to
      // expand/contract the info card
      evt.stopPropagation();
      // Pick an API call depending on whether the user is currently following
      const { followUser, unfollowUser } = followService;
      const apiCall = vm.userIsFollowingOwner ? unfollowUser : followUser;
      // Make the call and switch the controller state on success
      apiCall(user)
      .then(() => {
        vm.userIsFollowingOwner = !vm.userIsFollowingOwner;
        $timeout(() => {
          vm.followStatusHasLoaded = true;
        });
      });
    }
  }

  InformationCardHeaderController.$inject = [
    '$auth',
    '$scope',
    '$timeout',
    'dsapi',
    'dsimg',
    'followService',
    'informationCardService',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardHeaderController', InformationCardHeaderController);
})();
