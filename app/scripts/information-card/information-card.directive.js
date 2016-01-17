(function () {
  'use strict';

  function informationCard(collapseBehaviour) {
    return {
      templateUrl: 'views/information-card/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
      },
    };
  }

  informationCard.$inject = ['collapseBehaviour'];

  angular.module('divesites.informationCard').directive('informationCard', informationCard);

})();
