(function () {
  'use strict';
  function ProfileHeader() {
    return {
      scope: {
        editable: '=',
        user: '=',
      },
      templateUrl: 'views/profile-header.html',
    };
  }

  ProfileHeader.$inject = [];
  angular.module('divesites').directive('profileHeader', ProfileHeader);
})();
