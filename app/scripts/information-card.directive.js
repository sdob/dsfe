(function () {
  'use strict';

  function InformationCard() {
    return {
      templateUrl: 'views/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
        const card = element.find('.information-card');
        // Toggle chevron direction when the charts are
        // collapsed/uncollapsed
        // TODO: refactor
        $('#js-information-card__depth-chart-toggle')
        .click((e) => {
          console.log(e);
          $('#js-information-card__depth-chart-toggle')
          .find('.chart-header__chevron')
          .toggleClass('opened');
        });
        $('#js-information-card__duration-chart-toggle')
        .click((e) => {
          console.log(e);
          $('#js-information-card__duration-chart-toggle')
          .find('.chart-header__chevron')
          .toggleClass('opened');
        });
      },
    };
  }

  InformationCard.$inject = [];

  angular.module('divesites').directive('informationCard', InformationCard);

})();
