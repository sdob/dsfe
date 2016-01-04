(function () {
  'use strict';

  function InformationCardController($auth, $document, $location, $rootScope, $scope, dsapi, informationCardCharts, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.dismiss = dismiss;
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.site = $scope.site;
      vm.userIsOwner = userIsOwner;
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

      // handle keydown events (listening for ESC keypress)
      $document.on('keydown', keydownListener);
      $rootScope.$on('$destroy', () => {
        $document.off('keydown', keydownListener);
      });
    }

    function dismiss() {
      console.log('dismissing...');
      $location.search('');
      $('information-card').remove();
    }

    function keydownListener (evt) {
      if (evt.isDefaultPrevented()) {
        return evt;
      }
      switch (evt.which) {
        // Handle ESC keypress
        case 27: {
          // Wrapping this in $scope.$apply forces the
          // search params to update immediately
          evt.preventDefault();
          $scope.$apply(() => {
            $location.search('');
            $('information-card').remove();
          });
        }
        break;
      }
    }

    function userIsOwner(site) {
      console.log(localStorageService.get('user'));
      console.log(site.owner);
      return localStorageService.get('user') === site.owner.id;
    }

  }

  InformationCardController.$inject = ['$auth', '$document', '$location', '$rootScope', '$scope', 'dsapi', 'informationCardCharts', 'localStorageService',];
  angular.module('divesites').controller('InformationCardController', InformationCardController);
})();
