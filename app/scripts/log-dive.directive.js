(function () {
  'use strict';

  function LogDive() {
    return {
      templateUrl: 'views/log-dive.html',
      restrict: 'E',
      controller: 'LogDiveController',
      controllerAs: 'ldvm',
      link: (scope, elem, attrs, ctrl) => {
        console.log('logDive.link()');
      },
    };
  }

  LogDive.$inject = [];

  angular.module('divesites').directive('logDive', LogDive);
})();
