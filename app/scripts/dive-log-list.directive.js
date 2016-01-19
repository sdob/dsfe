(function() {
  'use strict';
  function diveLogList() {
    return {
      scope: {
        dives: '=',
      },
      templateUrl: 'views/dive-log-list.html',
      link: (scope, elem, attrs, ctrl) => {
        console.log('DiveLogList.link()');
      },
    };
  }

  diveLogList.$inject = [];
  angular.module('divesites').directive('diveLogList', diveLogList);
})();
