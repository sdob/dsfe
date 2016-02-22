(function() {
  'use strict';

  function divesiteInformationCard() {
    return {
      templateUrl: 'information-card/divesite-information-card.template.html',
      controller: 'DivesiteInformationCardController',
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

  divesiteInformationCard.$inject = [
  ];
  angular.module('divesites.informationCard').directive('divesiteInformationCard', divesiteInformationCard);
})();
