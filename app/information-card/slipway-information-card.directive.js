(function() {
  'use strict';

  function slipwayInformationCard() {
    return {
      templateUrl: 'information-card/slipway-information-card.html',
      controller: 'SlipwayInformationCardController',
      controllerAs: 'icvm',
      link,
    };

    function link(scope, element, attrs, controller) {

      // Clean up
      element.on('$destroy', () => {
        // Because we created this scope manually, we need to destroy it
        // manually too
        scope.$destroy();
      });
    }
  }

  slipwayInformationCard.$inject = [
  ];
  angular.module('divesites.informationCard').directive('slipwayInformationCard', slipwayInformationCard);
})();
