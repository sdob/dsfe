(function() {
  'use strict';
  function mapDirective() {
    return {
      templateUrl: 'map/map.html',
      restrict: 'EA',
      controller: 'MapController',
      controllerAs: 'mc',
      link: (scope, elem, attrs, ctrl) => {
      },
    };
  }

  angular.module('divesites').directive('map', mapDirective);
})();
