(function() {
  'use strict';

  function compressorInformationCard() {
    return {
      templateUrl: 'information-card/compressor-information-card.html',
      controller: 'CompressorInformationCardController',
      controllerAs: 'icvm',
      link,
    };

    function link(scope, element, attrs, controller) {

      // Clean up
      element.on('$destroy', () => {
        // Because we created this scope manually, we need to destroy it
        // manually too
        scope.$destroy();
      });
    }
  }

  compressorInformationCard.$inject = [
  ];
  angular.module('divesites.informationCard').directive('compressorInformationCard', compressorInformationCard);
})();
