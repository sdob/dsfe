(function () {
  'use strict';

  function InformationCard() {
    return {
      templateUrl: 'views/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
        console.log('InformationCard.link()');
        function HandleClick ()  {
          $(this).parent('.mdl-collapse').toggleClass('mdl-collapse--opened');
        }

        $(function () {
          $('.mdl-collapse__content').each(function () {
            const content = $(this);
            content.css('margin-top', -content.height());
          });
          //$(document.body).on('click', '.mdl-collapse__button', HandleClick);
          $(element).on('click', '.mdl-collapse__button', HandleClick);
        });

        element.on('$destroy', () => {
          console.debug('InformationCard.on($destroy)');
          //$(document.body).off('click', '.mdl-collapse__button', HandleClick);
          $(element).off('click', '.mdl-collapse__button', HandleClick);
        });

      }
    };
  }

  InformationCard.$inject = [];

  angular.module('divesites').directive('informationCard', InformationCard);

})();
