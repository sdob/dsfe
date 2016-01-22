(function() {
  'use strict';
  function nearbySlipways(collapseBehaviour) {
    return {
      scope: {
        slipways: '=',
      },
      templateUrl: 'information-card/nearby-slipways.html',
      link: () => {
        $('#js-information-card__nearby-slipways-toggle')
        .click(collapseBehaviour.toggleChevron);
      },
    };
  }

  nearbySlipways.$inject = [
    'collapseBehaviour',
  ];
  angular.module('divesites.informationCard').directive('nearbySlipways', nearbySlipways);
})();
