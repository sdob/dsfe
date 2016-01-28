(function() {
  'use strict';
  function signIn() {
    return {
      controller: 'SignInController',
      controllerAs: 'vm',
      templateUrl: 'login/sign-in-template.html',
    };
  }

  angular.module('divesites.login').directive('signIn', signIn);
})();
