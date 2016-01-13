(function () {
  'use strict';

  function SlipwayInformationCard() {
    return {
      templateUrl: 'views/information-card/slipway-information-card.html',
      controller: 'SlipwayInformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
      },
    };
  }

  SlipwayInformationCard.$inject = [];

  angular.module('divesites.informationCard').directive('slipwayInformationCard', SlipwayInformationCard);

})();
