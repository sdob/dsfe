(function() {
  'use strict';
  function diveLogList() {
    return {
      templateUrl: 'profile/dive-log-list.template.html',
    };
  }

  diveLogList.$inject = [];
  angular.module('divesites.profile').directive('diveLogList', diveLogList);
})();
