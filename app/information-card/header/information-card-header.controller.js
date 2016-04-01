(function() {
  'use strict';
  function InformationCardHeaderController($auth, $scope, dsapi, dsimg, followService, informationCardService, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.follow = follow;
      vm.followStatusHasLoaded = false;
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.unfollow = unfollow;

      if (vm.isAuthenticated()) {
        vm.viewingUserID = localStorageService.get('user');
      }

      getAndApplySiteHeaderImage();

      // Wait for main information card to load site data asynchronously,
      // then perform a single check to see if the viewing user is following
      // the owner
      $scope.$on('site-loaded', (e, site) => {
        const owner = site.owner;
        if (vm.isAuthenticated()) {
          const viewingUserID = localStorageService.get('user');
          followService.userIsFollowing(owner)
          .then((result) => {
            vm.followStatusHasLoaded = true;
            vm.userIsFollowingOwner = result;
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

    function follow(user) {
      followService.followUser(user)
      .then(() => {
        vm.userIsFollowingOwner = true;
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
        console.log('I found a header image!');
        console.log(headerImage);
        if (headerImage && headerImage.data && headerImage.data.public_id) {
          vm.headerImageUrl = $.cloudinary.url(headerImage.data.public_id, {});
          console.log('header image should be');
          console.log(vm.headerImageUrl);
          vm.backgroundStyle = {
            background: `url(${vm.headerImageUrl}) center / cover`,
          };
        } else {
          console.log('header image appears to be nothing');
          delete(vm.headerImageUrl);
          delete(vm.backgroundStyle);
        }
      });
    }

    function unfollow(user) {
      followService.unfollowUser(user)
      .then(() => {
        vm.userIsFollowingOwner = false;
      });
    }
  }

  InformationCardHeaderController.$inject = [
    '$auth',
    '$scope',
    'dsapi',
    'dsimg',
    'followService',
    'informationCardService',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardHeaderController', InformationCardHeaderController);
})();
