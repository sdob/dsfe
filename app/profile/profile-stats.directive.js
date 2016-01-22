(function() {
  'use strict';
  function profileStats() {
    return {
      scope: {
        user: '=',
      },
      templateUrl: 'profile/profile-stats.html',
    };
  }

  profileStats.$inject = [];
  angular.module('divesites').directive('profileStats', profileStats);
})();
