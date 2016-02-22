(function() {
  'use strict';

  function informationCard() {
    return {
      controller: 'InformationCardController',
      controllerAs: 'vm',
      link,
      templateUrl: 'information-card/information-card.template.html',
    };

    function link(scope, element) {
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
