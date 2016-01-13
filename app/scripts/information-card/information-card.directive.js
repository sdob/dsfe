(function () {
  'use strict';

  function informationCard(collapseBehaviour) {
    return {
      templateUrl: 'views/information-card/main.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
      },
    };
  }

  informationCard.$inject = ['collapseBehaviour'];

  angular.module('divesites.informationCard').directive('informationCard', informationCard);

})();
