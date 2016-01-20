(function() {
  'use strict';

  function informationCard($document, $location, collapseBehaviour, informationCardService) {
    return {
      templateUrl: 'views/information-card/information-card.html',
      controller: 'InformationCardController',
      controllerAs: 'icvm',
      link: (scope, element, attrs, controller, transcludeFn) => {
        console.log('linking info card');
        console.log(scope);
        const keydownListener = informationCardService.escapeKeydownListener(removeSelf);
        const toggleOpened = informationCardService.toggleOpened(element);
        // XXX: This seems hacky, but the alternative *appears* to be inserting
        // 'onload' markup into the templates
        let dismissButtonHasLoaded = false;
        let titleHasLoaded = false;

        // Register listeners
        $document.on('keydown', keydownListener);

        // When the ng-includes have finished running, assign event listeners
        scope.$on('$includeContentLoaded', (evt) => {

          // When the title element has loaded, give it open/close behaviour
          if (!titleHasLoaded && element.find('.information-card__title').length) {
            titleHasLoaded = true;
            element.find('.information-card__title').on('click', toggleOpened);
          }

          // When the dismiss button has loaded, give it dismiss behaviour
          if (!dismissButtonHasLoaded && element.find('.information-card__dismiss-button').length) {
            dismissButtonHasLoaded = true;
            element.find('.information-card__dismiss-button').on('click', removeSelf);
          }
        });

        // Clean up
        element.on('$destroy', () => {
          console.log('destroying information card');

          // Remove click listener
          element.find('.information-card__title').off('click', toggleOpened);

          // Remove dismiss listener
          element.find('.information-card__dismiss-button').off('click', removeSelf);

          // Remove ESC key 
          $document.off('keydown', keydownListener);
        });

        function removeSelf() {
          // politely ask parent scope to remove me
          scope.$emit('please-kill-me', element);
        }
      },
    };
  }

  informationCard.$inject = [
    '$document',
    '$location',
    'collapseBehaviour',
    'informationCardService',
  ];
  angular.module('divesites.informationCard').directive('informationCard', informationCard);
})();
