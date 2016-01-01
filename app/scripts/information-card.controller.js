(function () {
  'use strict';

  function InformationCardController($auth, $scope, informationCardCharts) {
    const vm = this;
    activate();

    function activate() {
      vm.dismiss = dismiss;
      vm.isAuthenticated = $auth.isAuthenticated;
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

      // Build depth and duration histograms (if we have the data we need)
      if (!!depths.length) {
        const dh = informationCardCharts.createHistogram('depth', depths, 20, 512, 178, 100);
        $('#information-card-depth-histogram-container').append(dh);
      }
      if (!!durations.length) {
        $('#information-card-duration-histogram-container').append(informationCardCharts.createHistogram('duration', durations));
      }
    }

    function dismiss() {
      //vm.visible = false;
      $('information-card').remove();
    }
  }

  InformationCardController.$inject = ['$auth', '$scope', 'informationCardCharts',];
  angular.module('divesites').controller('InformationCardController', InformationCardController);
})();
