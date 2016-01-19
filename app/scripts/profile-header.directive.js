(function() {
  'use strict';
  function profileHeader() {
    return {
      scope: {
        editable: '=',
        user: '=',
      },
      templateUrl: 'views/profile-header.html',
      controller: 'ProfileHeaderController',
      controllerAs: 'vm',
    };
  }

  profileHeader.$inject = [];
  angular.module('divesites').directive('profileHeader', profileHeader);
})();
