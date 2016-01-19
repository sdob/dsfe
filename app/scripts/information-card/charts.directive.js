(function() {
  'use strict';
  function informationCardCharts(collapseBehaviour) {
    return {
      controller: 'InformationCardChartsController',
      controllerAs: 'vm',
      templateUrl: 'views/information-card/charts.html',
      link: (scope, element, attrs, controller) => {
        $('#js-information-card__depth-chart-toggle, #js-information-card__duration-chart-toggle')
        .click(collapseBehaviour.toggleChevron);
        if (controller.histograms.depth) {
          element.find('#information-card-depth-histogram-container').append(controller.histograms.depth);
        }

        if (controller.histograms.duration) {
          element.find('#information-card-duration-histogram-container').append(controller.histograms.duration);
        }
      },
    };
  }

  informationCardCharts.$inject = ['collapseBehaviour'];
  angular.module('divesites.informationCard').directive('informationCardCharts', informationCardCharts);
})();
