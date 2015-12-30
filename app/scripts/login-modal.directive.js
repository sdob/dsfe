(function () {
  'use strict';
  function loginModal() {
    return {
      templateUrl: 'views/login-modal.html',
      controller: 'LoginModalController',
      controllerAs: 'lmvm',
      restrict: 'E',
      link: () => {
      }
    };
  }

  loginModal.$inject = [];
  angular.module('divesites').directive('loginModal', loginModal);
})();
