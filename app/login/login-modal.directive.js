(function() {
  'use strict';
  function loginModal() {
    return {
      templateUrl: 'login/login-modal.template.html',
      controller: 'LoginModalController',
      controllerAs: 'lmvm',
      restrict: 'E',
      link: () => {
      },
    };
  }

  loginModal.$inject = [];
  angular.module('divesites.login').directive('loginModal', loginModal);
})();
