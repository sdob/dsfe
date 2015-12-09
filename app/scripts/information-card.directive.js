(function () {
  'use strict';

  function InformationCard() {
    return {
      templateUrl: 'views/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
    };
  }

  InformationCard.$inject = [];

  angular.module('divesites').directive('informationCard', InformationCard);

})();
