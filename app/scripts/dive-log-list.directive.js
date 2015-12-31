(function () {
  'use strict';
  function DiveLogList() {
    return {
      scope: {
        dives: '='
      },
      templateUrl: 'views/dive-log-list.html',
      link: (scope, elem, attrs, ctrl) => {
        console.log('DiveLogList.link()');
        console.log(attrs);
        console.log(scope);
      },
    };
  }
  DiveLogList.$inject = [];
  angular.module('divesites').directive('diveLogList', DiveLogList);
})();
