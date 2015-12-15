(function () {
  'use strict';

  function InformationCard() {
    return {
      templateUrl: 'views/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: () => {
        $(function () {
          $('.mdl-collapse__content').each(function () {
            const content = $(this);
            console.info(content);
            content.css('margin-top', -content.height());
          });

          $(document.body).on('click', '.mdl-collapse__button', function () {
            $(this).parent('.mdl-collapse').toggleClass('mdl-collapse--opened');
          });
        });
      }
    };
  }

  InformationCard.$inject = [];

  angular.module('divesites').directive('informationCard', InformationCard);

})();
