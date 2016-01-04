(function () {
  'use strict';

  function InformationCardController($auth, $document, $rootScope, $scope, dsapi, informationCardCharts) {
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
        const dh = informationCardCharts.createHistogram('depth', depths, 20, 512, 178, 0, 100);
        $('#information-card-depth-histogram-container').append(dh);
      }
      if (!!durations.length) {
        $('#information-card-duration-histogram-container').append(informationCardCharts.createHistogram('duration', durations));
      }

      dsapi.getOwnId()
      .then((response) => {
        console.log('response from dsapi.getOwnId');
        console.log(response.data);
        vm.userId = response.data.id;
      });

      // handle keydown events (listening for ESC keypress)
      $document.on('keydown', keydownListener);
      $rootScope.$on('$destroy', () => {
        $document.off('keydown', keydownListener);
      });
      // TODO: handle back button. This is probably a bit more
      // complicated; we'll need to push a history state when
      // the info card is summoned.
    }

    function dismiss() {
      //vm.visible = false;
      $('information-card').remove();
    }

    function keydownListener (evt) {
      if (evt.isDefaultPrevented()) {
        return evt;
      }
      switch (evt.which) {
        // Handle ESC keypress
        case 27: {
          evt.preventDefault();
          $('information-card').remove();
        }
        break;
      }
    }
  }

  InformationCardController.$inject = ['$auth', '$document', '$rootScope', '$scope', 'dsapi', 'informationCardCharts',];
  angular.module('divesites').controller('InformationCardController', InformationCardController);
})();
