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
        dsimg.getUserProfileImage(userID)
        .then((response) => {
          vm.userProfileThumbnailImage = $.cloudinary.url(response.data.image.url, {
            height: 18,
            width: 18,
            crop: 'fill',
            gravity: 'face',
          });
          console.log(vm.userProfileThumbnailImage);
        });

      }
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
          dsimg.getUserProfileImage(userID)
          .then((response) => {
            console.log(response.data.image.url);
            vm.userProfileThumbnailImage = $.cloudinary.url(response.data.image.url, {
              height: 18,
              width: 18,
              crop: 'fill',
              gravity: 'face',
            });
            console.log(vm.userProfileThumbnailImage);
            //console.log(response.data.image.url);
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
