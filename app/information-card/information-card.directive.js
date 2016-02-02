(function() {
  'use strict';

  function informationCard() {
    return {
      templateUrl: 'information-card/information-card.html',
      controller: 'InformationCardController',
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

  informationCard.$inject = [
  ];
  angular.module('divesites.informationCard').directive('informationCard', informationCard);
})();
