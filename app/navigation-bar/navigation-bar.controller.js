(function() {
  'use strict';
  function NavigationBarController(
    $auth,
    $document,
    $location,
    $timeout,
    $uibModal,
    dsimg,
    localStorageService,
    profileService
  ) {
    const vm = this;
    activate();

    function activate() {
      vm.toggleFullscreen = toggleFullscreen;
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.signOut = signOut;
      vm.summonLoginModal = summonLoginModal;
      $document.bind('fullscreenchange', () => {
        vm.isFullscreen = $(document).fullScreen();
      });

      // Try and download a thumbnail
      if (localStorageService.get('user')) {
        const userID = localStorageService.get('user');
        retrieveProfileThumbnailImage(userID)
        .then((url) => {
          vm.userProfileThumbnailImage = url;
        });
      }
    }

    function retrieveProfileThumbnailImage(id) {
      return dsimg.getUserProfileImage(id)
      .then((response) => $.cloudinary.url(response.data.image.public_id, {
        height: 18,
        width: 18,
        crop: 'fill',
        gravity: 'face',
      }));
    }

    function toggleFullscreen() {
      $(document).toggleFullScreen();
    }

    function signOut() {
      localStorageService.remove('user');
      profileService.clear(); // remove own profile data from profileService
      vm.userProfileThumbnailImage = undefined;
      $auth.logout()
      .then(() => {
        // Clear search path if it's not empty, and take us to the front page
        $location.search('');
        $location.path('/');
      });
    }

    function summonLoginModal() {
      const modalInstance = $uibModal.open({
        templateUrl: 'login/login-modal.html',
        controller: 'LoginModalController',
        controllerAs: 'lmvm',
        size: 'sm',
        windowClass: 'sign-in',
      });
      modalInstance.result.then((reason) => {
        if (reason === 'signed-in') {
          // We've signed in successfully
          console.log('navigation bar controller: signed in');
          const userID = localStorageService.get('user');
          retrieveProfileThumbnailImage(userID)
          .then((url) => {
            vm.userProfileThumbnailImage = url;
          });
        }
      });
    }
  }

  NavigationBarController.$inject = [
    '$auth',
    '$document',
    '$location',
    '$timeout',
    '$uibModal',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.navigationBar').controller('NavigationBarController', NavigationBarController);
})();
