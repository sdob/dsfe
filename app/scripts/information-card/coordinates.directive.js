(function () {
  'use strict';
  function informationCardCoordinates() {
    return {
      templateUrl: 'views/information-card/coordinates.html',
    };
  }
  informationCardCoordinates.$inject = [];
  angular.module('divesites.informationCard').directive('informationCardCoordinates', informationCardCoordinates);
})();
