(function () {
  'use strict';
  function authenticationService(API_URL) {
    return {
    };
  }

  authenticationService.$inject = ['API_URL'];
  angular.module('divesites').factory('authentication', authenticationService);
})();
