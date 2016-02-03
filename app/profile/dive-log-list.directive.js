(function() {
  'use strict';
  function diveLogList() {
    return {
      templateUrl: 'profile/dive-log-list.html',
      link: (scope, elem, attrs, ctrl) => {
        console.log(scope);
      },
    };
  }

  diveLogList.$inject = [];
  angular.module('divesites.profile').directive('diveLogList', diveLogList);
})();
