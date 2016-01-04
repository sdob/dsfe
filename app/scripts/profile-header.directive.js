(function () {
  'use strict';
  function ProfileHeader() {
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

  ProfileHeader.$inject = [];
  angular.module('divesites').directive('profileHeader', ProfileHeader);
})();
