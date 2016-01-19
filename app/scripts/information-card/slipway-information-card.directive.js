(function() {
  'use strict';

  function slipwayInformationCard() {
    return {
      templateUrl: 'views/information-card/slipway-information-card.html',
      controller: 'SlipwayInformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
      },
    };
  }

  slipwayInformationCard.$inject = [];
  angular.module('divesites.informationCard').directive('slipwayInformationCard', slipwayInformationCard);
})();
