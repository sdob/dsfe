(function() {
  'use strict';
  function informationCardCoordinates() {
    return {
      templateUrl: 'information-card/coordinates.template.html',
      link: (scope, elem, attrs, ctrl) => {
      },
    };
  }

  informationCardCoordinates.$inject = [];
  angular.module('divesites.informationCard').directive('informationCardCoordinates', informationCardCoordinates);
})();
