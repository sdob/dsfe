(function () {
  'use strict';

  function informationCard(collapseBehaviour) {
    return {
      templateUrl: 'views/information-card/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
        //console.log(element.find('.information-card__collapse-chevron'));
        element.find('.information-card__collapse-chevron')
        .click(function (e) {
          //console.log($(this));
          //$(this).toggleClass('opened');
          element.find('.information-card').toggleClass('opened');
        });
      },
    };
  }

  informationCard.$inject = ['collapseBehaviour'];

  angular.module('divesites.informationCard').directive('informationCard', informationCard);

})();
