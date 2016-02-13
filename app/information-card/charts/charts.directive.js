(function() {
  'use strict';
  function informationCardCharts($timeout, collapseBehaviour, informationCardChartsService) {
    return {
      controller: 'InformationCardChartsController',
      controllerAs: 'vm',
      scope: true,
      templateUrl: 'information-card/charts/charts.template.html',
      link: (scope, element, attrs, controller) => {
        $('#js-information-card__depth-chart-toggle, #js-information-card__duration-chart-toggle')
        .click(collapseBehaviour.toggleChevron);

        element.on('$destroy', () => {
          scope.$destroy();
        });

        scope.$on('destroy', () => {
        });

        // Rebuild histograms when told to
        scope.$on('refresh-statistics', (evt, site) => {
          scope.vm.site = site;
          buildCharts(site, element);
        });
      },
    };

    function buildCharts(site, element) {
      const avg = (l) => l.reduce((x, y) => x + y) / l.length;
          // Update site in scope to refresh average depth and duration values
          //scope.vm.site = site;

          /* Refresh histograms */

          // Remove existing histograms
          element.find('#information-card-depth-histogram-container').empty();
          element.find('#information-card-duration-histogram-container').empty();
          if (site.dives.length) {
            // Construct new histograms
            const depths = site.dives.map((d) => Number(d.depth));
            const durations = site.dives.map(d => moment.duration(d.duration).minutes());
            // The end of the x-scale for depth and duration is either the maximum depth
            // or large enough to put the mean in the middle
            const maxDepth = Math.max(Math.max(...depths), avg(depths) * 2);
            const maxDuration = Math.max(Math.max(...durations), avg(durations) * 2);
            //console.log(Math.max(depths) * 2);
            const depthHistogram = informationCardChartsService.createHistogram('depth', depths, 20, 512, 178, 0, maxDepth);
            const durationHistogram = informationCardChartsService.createHistogram('duration', durations, 20, 512, 178, 0, maxDuration);
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
