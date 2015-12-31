(function () {
  'use strict';
  function ProfileStats() {
    return {
      scope: {
        user: '=',
      },
      templateUrl: 'views/profile-stats.html',
    };
  }

  ProfileStats.$inject = [];
  angular.module('divesites').directive('profileStats', ProfileStats);
})();
