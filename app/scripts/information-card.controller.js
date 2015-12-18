(function () {
  'use strict';

  function InformationCardController($scope, informationCardCharts) {
    const vm = this;
    console.log('InformationCardController.scope');
    console.log($scope);
    activate();

    function activate() {
      console.info('InformationCardController.activate()');
      vm.dismiss = dismiss;
      vm.site = $scope.site;
      vm.visible = true;
      // Initially collapse depth histogram
      vm.collapseDepthChart = true;
      // Initially collapse duration histogram
      vm.collapseDurationHistogram = true;
      vm.site.header_image_url = 'http://lorempixel.com/512/178/nature/' + (parseInt(Math.random() * 20) + 1);

      // XXX: for dev purposes only, set header image
      const depths = vm.site.dives.map((d) => d.depth);
      const durations = vm.site.dives.map(d => moment.duration(d.duration).minutes());

      // Calculate our own average duration, with a sanity check (set to 0
      // if we have no logged dives
      vm.site.averageDuration = 0;
      if (durations) {
        vm.site.averageDuration = (durations.reduce((acc, n) => acc + n, 0)) / durations.length;
      }

      // Clear existing SVGs
      d3.select('#information-card-depth-histogram').remove();
      d3.select('#information-card-duration-histogram').remove();
      // Build depth and duration histograms
      const dh = informationCardCharts.createHistogram('depth', depths, 20, 512, 178, 100);
      $('#information-card-depth-histogram-container').append(dh);
      $('#information-card-duration-histogram-container').append(informationCardCharts.createHistogram('duration', durations));
    }

    function dismiss() {
      //vm.visible = false;
      $('information-card').remove();
    }
  }

  InformationCardController.$inject = ['$scope', 'informationCardCharts',];
  angular.module('divesites').controller('InformationCardController', InformationCardController);
})();
