(function() {
  'use strict';

  function logDive() {
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

  logDive.$inject = [];
  angular.module('divesites').directive('logDive', logDive);
})();
