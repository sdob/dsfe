(function () {
  'use strict';
  function NavigationBarController($auth, $location, $uibModal) {
    const vm = this;
    activate();

    function activate() {
      console.log('NavigationBarController.activate()');
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.signOut = signOut;
      vm.summonLoginModal = summonLoginModal;
      console.log('is the user authenticated? ' + vm.isAuthenticated());
    }

    function signOut() {
      $auth.logout()
      .then(() => {
        $location.path('/');
      });
    }
    
    function summonLoginModal() {
      console.log('NavigationBarController.summonLoginModal()');
      const modalInstance = $uibModal.open({
        templateUrl: 'views/login-modal.html',
        controller: 'LoginModalController',
        controllerAs: 'lmvm',
        size: 'lg',
      });
    }
  }

  NavigationBarController.$inject = ['$auth', '$location', '$uibModal'];
  angular.module('divesites').controller('NavigationBarController', NavigationBarController);
})();
