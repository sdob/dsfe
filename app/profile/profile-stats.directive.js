(function() {
  'use strict';
  function profileStats() {
    return {
      scope: {
        user: '=',
      },
      templateUrl: 'profile/profile-stats.template.html',
    };
  }

  profileStats.$inject = [];
  angular.module('divesites.profile').directive('profileStats', profileStats);
})();
