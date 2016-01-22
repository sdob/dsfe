(function() {
  'use strict';

  function slipwayInformationCard($document, $location, informationCardService) {
    return {
      templateUrl: 'information-card/slipway-information-card.html',
      controller: 'SlipwayInformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
        const keydownListener = informationCardService.escapeKeydownListener(removeSelf);
        const toggleOpened = informationCardService.toggleOpened(element);
        let dismissButtonHasLoaded = false;
        let titleHasLoaded = false;

        $document.on('keydown', keydownListener);

        scope.$on('$includeContentLoaded', (evt) => {
          if (!titleHasLoaded && element.find('.information-card__title').length) {
            titleHasLoaded = true;
            element.find('.information-card__title').on('click', toggleOpened);
          }

          if (!dismissButtonHasLoaded && element.find('.information-card__dismiss-button')) {
            dismissButtonHasLoaded = true;
            element.find('.information-card__dismiss-button').on('click', removeSelf);
          }
        });

        // Clean up
        element.on('$destroy', () => {
          element.find('.information-card__title').off('click', toggleOpened);
          element.find('.information-card__dismiss-button').off('click', removeSelf);
          $document.off('keydown', keydownListener);
        });

        function removeSelf() {
          scope.$emit('please-kill-me', element);
        }
      },
    };
  }

  slipwayInformationCard.$inject = [
    '$document',
    '$location',
    'informationCardService',
  ];
  angular.module('divesites.informationCard').directive('slipwayInformationCard', slipwayInformationCard);
})();
