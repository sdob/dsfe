(function() {
  'use strict';
  function NavigationBarController($auth, $location, $uibModal, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.signOut = signOut;
      vm.summonLoginModal = summonLoginModal;
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
    '$location',
    '$uibModal',
    'localStorageService',
  ];
  angular.module('divesites').controller('NavigationBarController', NavigationBarController);
})();
