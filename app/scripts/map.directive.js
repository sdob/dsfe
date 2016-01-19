(function() {
  'use strict';
  function mapDirective() {
    return {
      templateUrl: 'views/map.html',
      restrict: 'EA',
      controller: 'MapController',
      controllerAs: 'mc',
      link: (scope, elem, attrs, ctrl) => {
      },
    };
  }

  angular.module('divesites').directive('map', mapDirective);
})();
