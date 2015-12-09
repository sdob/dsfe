(function () {
  'use strict';
  function mapDirective() {
    return {
      templateUrl: 'views/map.html',
      restrict: 'EA',
      controller: 'MapController',
      controllerAs: 'mc',
      link: (scope, elem, attrs, ctrl) => {
        console.info('map.link()');
      },
    };
  }

  angular.module('divesites').directive('map', mapDirective);
})();
