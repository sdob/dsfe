(function() {
  'use strict';
  function informationCardCharts($timeout, collapseBehaviour, informationCardChartsService) {
    return {
      controller: 'InformationCardChartsController',
      controllerAs: 'vm',
      scope: true,
      templateUrl: 'information-card/charts/charts.html',
      link: (scope, element, attrs, controller) => {
        $('#js-information-card__depth-chart-toggle, #js-information-card__duration-chart-toggle')
        .click(collapseBehaviour.toggleChevron);

        element.on('$destroy', () => {
          console.log('**** informationCardCharts.element.on(\'$destroy\')');
          scope.$destroy();
        });

        scope.$on('destroy', () => {
          console.log('**** charts scope destroy');
        });

        // Rebuild histograms when told to
        scope.$on('refresh-statistics', (evt, site) => {
          scope.vm.site = site;
          buildCharts(site, element);
        });
      },
    };

    function buildCharts(site, element) {
          // Update site in scope to refresh average depth and duration values
          //scope.vm.site = site;

          /* Refresh histograms */

          // Remove existing histograms
          element.find('#information-card-depth-histogram-container').empty();
          element.find('#information-card-duration-histogram-container').empty();
          if (site.dives.length) {
            // Construct new histograms
            const depths = site.dives.map((d) => d.depth);
            const durations = site.dives.map(d => moment.duration(d.duration).minutes());
            const depthHistogram = informationCardChartsService.createHistogram('depth', depths, 20, 512, 178, 0, 100);
            const durationHistogram = informationCardChartsService.createHistogram('duration', durations);
            element.find('#information-card-depth-histogram-container').append(depthHistogram);

            element.find('#information-card-duration-histogram-container').append(durationHistogram);
          }
        }
  }

  informationCardCharts.$inject = [
    '$timeout',
    'collapseBehaviour',
    'informationCardChartsService',
  ];
  angular.module('divesites.informationCard').directive('informationCardCharts', informationCardCharts);
})();
