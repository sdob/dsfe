(function() {
  'use strict';

  function informationCard(collapseBehaviour) {
    return {
      templateUrl: 'views/information-card/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {

        // TODO: can probably remove the on-click from the chevron element,
        // since it just provides a nice visual hint of the parent element's
        // behaviour
        element.find('.information-card__collapse-chevron')
        .click(function(e) {
          element.find('.information-card').toggleClass('opened');
        });

        element.find('.information-card__title')
        .click(function(e) {
          element.find('.information-card').toggleClass('opened');
        });
      },
    };
  }

  informationCard.$inject = ['collapseBehaviour'];
  angular.module('divesites.informationCard').directive('informationCard', informationCard);
})();
