(function () {
  'use strict';

  function SlipwayInformationCard() {
    return {
      templateUrl: 'views/slipway-information-card.html',
      controller: 'SlipwayInformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
      },
    };
  }

  SlipwayInformationCard.$inject = [];

  angular.module('divesites').directive('slipwayInformationCard', SlipwayInformationCard);

})();
