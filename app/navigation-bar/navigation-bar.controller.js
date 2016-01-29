(function() {
  'use strict';
  function NavigationBarController(
    $auth,
    $document,
    $location,
    $timeout,
    $uibModal,
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
    }

    function toggleFullscreen() {
      $(document).toggleFullScreen();
    }

    function signOut() {
      localStorageService.remove('user');
      profileService.clear(); // remove own profile data from profileService
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
    }
  }

  NavigationBarController.$inject = [
    '$auth',
    '$document',
    '$location',
    '$timeout',
    '$uibModal',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.navigationBar').controller('NavigationBarController', NavigationBarController);
})();
