(function() {
  'use strict';
  function NavigationBarController(
    $auth,
    $document,
    $location,
    $timeout,
    $uibModal,
    localStorageService
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
      $auth.logout()
      .then(() => {
        $location.path('/');
      });
    }

    function summonLoginModal() {
      const modalInstance = $uibModal.open({
        templateUrl: 'views/login-modal.html',
        controller: 'LoginModalController',
        controllerAs: 'lmvm',
        size: 'lg',
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
  ];
  angular.module('divesites').controller('NavigationBarController', NavigationBarController);
})();
