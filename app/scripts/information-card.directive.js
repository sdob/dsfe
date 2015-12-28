(function () {
  'use strict';

  function InformationCard() {
    return {
      templateUrl: 'views/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
        const card = element.find('.information-card');
        //console.log('card:');
        //console.log(card);
        //console.log(card[0].offsetTop);
        //console.log(card[0].offsetLeft);
      },
    };
  }

  InformationCard.$inject = [];

  angular.module('divesites').directive('informationCard', InformationCard);

})();
