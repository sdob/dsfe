(function () {
  'use strict';
  function NearbySlipways(collapseBehaviour) {
    return {
      scope: {
        slipways: '=',
      },
      templateUrl: 'views/nearby-slipways.html',
      link: () => {
        $('#js-information-card__nearby-slipways-toggle')
        .click(collapseBehaviour.toggleChevron);
      },
    };
  }
  NearbySlipways.$inject = ['collapseBehaviour'];
  angular.module('divesites').directive('nearbySlipways', NearbySlipways);
})();
