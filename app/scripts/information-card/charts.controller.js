(function () {
  'use strict';
  function InformationCardChartsController($scope, informationCardChartsService) {

    const vm = this;
    activate();

    function activate() {
      vm.site = $scope.site;
      constructHistograms();
    }

    function constructHistograms() {
      // Build depth and duration histograms (if we have the data we need)
      const depths = vm.site.dives.map((d) => d.depth);
      const durations = vm.site.dives.map(d => moment.duration(d.duration).minutes());
      let depthHistogram;
      let durationHistogram;
      if (depths.length) {
        depthHistogram = informationCardChartsService.createHistogram('depth', depths, 20, 512, 178, 0, 100);
        //$('#information-card-depth-histogram-container').append(dh);
      }
      if (durations.length) {
        durationHistogram = informationCardChartsService.createHistogram('duration', durations);
        //$('#information-card-duration-histogram-container').append(informationCardChartsService.createHistogram('duration', durations));
      }
      vm.histograms = {
        depth: depthHistogram,
        duration: durationHistogram,
      };
    }
  }

  InformationCardChartsController.$inject = [
    '$scope',
    'informationCardChartsService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardChartsController', InformationCardChartsController);
})();
