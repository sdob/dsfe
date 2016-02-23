(function() {
  'use strict';
  function informationCardHeader($document, informationCardService) {
    return {
      controller: 'InformationCardHeaderController',
      controllerAs: 'vm',
      link,
      scope: {
        site: '=',
      },
      templateUrl: 'information-card/header/information-card-header.template.html',
    };

    function link(scope, element, attrs, controller) {
      const keydownListener = informationCardService.escapeKeydownListener(removeSelf);
      // Add event listeners
      $document.on('keydown', keydownListener);

      element.find('.information-card__dismiss-button').on('click', removeSelf);
      element.find('.information-card__title').on('click', toggleOpened);

      element.on('$destroy', () => {
        // Remove event listeners
        $document.off('keydown', keydownListener);
        element.find('.information-card__dismiss-button').off('click', removeSelf);
        element.find('.information-card__title').off('click', toggleOpened);
      });

      function removeSelf() {
        // Ask parent scope to remove us
        scope.$emit('please-kill-me');
      }

      function toggleOpened() {
        $document.find('.information-card').toggleClass('opened');
      }
    }

  }

  informationCardHeader.$inject = [
    '$document',
    'informationCardService',
  ];
  angular.module('divesites.informationCard').directive('informationCardHeader', informationCardHeader);
})();
