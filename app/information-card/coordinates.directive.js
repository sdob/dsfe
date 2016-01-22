(function() {
  'use strict';
  function informationCardCoordinates() {
    return {
      templateUrl: 'information-card/coordinates.html',
      link: (scope, elem, attrs, ctrl) => {
      },
    };
  }

  informationCardCoordinates.$inject = [];
  angular.module('divesites.informationCard').directive('informationCardCoordinates', informationCardCoordinates);
})();
