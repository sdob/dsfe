(function () {
  'use strict';

  function InformationCard(collapseBehaviour) {
    return {
      templateUrl: 'views/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
        const card = element.find('.information-card');
        // Toggle chevron direction when the charts are
        // collapsed/uncollapsed
        $('#js-information-card__depth-chart-toggle, #js-information-card__duration-chart-toggle, #js-information-card__nearby-slipways-toggle')
        .click(collapseBehaviour.toggleChevron);
      },
    };
  }

  InformationCard.$inject = ['collapseBehaviour'];

  angular.module('divesites').directive('informationCard', InformationCard);

})();
