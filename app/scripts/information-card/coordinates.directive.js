(function () {
  'use strict';
  function informationCardCoordinates() {
    return {
      templateUrl: 'views/information-card/coordinates.html',
      link: (scope, elem, attrs, ctrl) => {
        console.log('coordinate scope');
        console.log(scope);
      }
    };
  }
  informationCardCoordinates.$inject = [];
  angular.module('divesites.informationCard').directive('informationCardCoordinates', informationCardCoordinates);
})();
