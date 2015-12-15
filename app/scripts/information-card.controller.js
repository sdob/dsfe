(function () {
  'use strict';

  function InformationCardController($scope, informationCardCharts) {
    const vm = this;
    activate();

    function activate() {
      vm.hide = hide;
      vm.visible = false;
      // Initially collapse depth histogram
      vm.collapseDepthChart = true;
      // Initially collapse duration histogram
      vm.collapseDurationHistogram = true;

      // Listen for clicks on main map to display the card
      $scope.$on('show-information-card', show);
      $scope.$on('$destroy', show);
    }


    function hide() {
      vm.visible = false;
    }

    function show(e, site) {
      vm.visible = true;
      vm.site = site;
      const depths = vm.site.dives.map((d) => d.depth);
      const durations = vm.site.dives.map(d => moment.duration(d.duration).minutes());

      // Calculate our own average duration, with a sanity check (set to 0
      // if we have no logged dives
      vm.site.averageDuration = 0;
      if (durations) {
        console.info(durations.reduce((acc, n) => acc + n, 0));
        vm.site.averageDuration = (durations.reduce((acc, n) => acc + n, 0)) / durations.length;
      }

      // Clear existing SVGs
      d3.select('#information-card-depth-histogram').remove();
      d3.select('#information-card-duration-histogram').remove();
      // Build depth and duration histograms
      const dh = informationCardCharts.createHistogram('depth', depths);
      $('#information-card-depth-histogram-container').append(dh);
      $('#information-card-duration-histogram-container').append(informationCardCharts.createHistogram('duration', durations));
    }
  }

  InformationCardController.$inject = ['$scope', 'informationCardCharts',];
  angular.module('divesites').controller('InformationCardController', InformationCardController);
})();
