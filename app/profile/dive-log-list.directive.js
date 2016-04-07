(function() {
  'use strict';
  function diveLogList() {
    return {
      controller: 'DiveLogListController',
      controllerAs: 'vm',
      scope: {
        user: '=',
      },
      templateUrl: 'profile/dive-log-list.template.html',
    };
  }

  diveLogList.$inject = [];
  angular.module('divesites.profile').directive('diveLogList', diveLogList);
})();
