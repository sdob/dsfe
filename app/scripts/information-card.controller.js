(function () {
  'use strict';

  function InformationCardController($auth, $document, $location, $rootScope, $scope, $uibModal, dsapi, dsimg, informationCardCharts, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      console.log('HAVERSINE');
      console.log(haversine);
      vm.dismiss = dismiss;
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.site = $scope.site;
      vm.site.images = {}; // Ensure that this is never undefined
      vm.userIsOwner = userIsOwner;
      vm.visible = true;
      // Initially collapse depth histogram
      vm.collapseDepthChart = true;
      // Initially collapse duration histogram
      vm.collapseDurationHistogram = true;
      vm.showBiggerImage = showBiggerImage;

      // Contact API server for nearby slipways
      dsapi.getNearbySlipways(vm.site.id)
      .then((response) => {
        console.log('nearby slipways');
        console.log(response.data);
        vm.site.nearbySlipways = response.data.map((slipway) => {
          const s = slipway;
          // Global 'haversine' variable
          s.distanceFromDivesite = haversine(
            {latitude: vm.site.latitude, longitude: vm.site.longitude},
            {latitude: slipway.latitude, longitude: slipway.longitude}
          );
          console.log(s.distanceFromDivesite);
          return s;
        });
      });

      // Contact image server for header image
      dsimg.getDivesiteHeaderImage(vm.site.id)
      .then((response) => {
        console.log(response);
        if(response.data && response.data.image && response.data.image.public_id) {
          const public_id = response.data.image.public_id;
          vm.site.headerImageUrl = $.cloudinary.url(public_id, {
          });
          vm.backgroundStyle = {
            'background': `blue url(${vm.site.headerImageUrl}) center / cover`,
          };
        }
      });

      // Contact image server for divesite images
      dsimg.getDivesiteImages(vm.site.id)
      .then((response) => {
        /*
        vm.site.images = response.data.map((x) => $.cloudinary.url(x.image.public_id, {
          height: 60,
          width: 60,
          crop: 'fill',
        }));
        */
       vm.site.images = response.data.map((item) => item.image);
       vm.site.images.forEach((image) => {
         image.transformedUrl = $.cloudinary.url(image.public_id, {
           height: 60,
           width: 60,
           crop: 'fill',
         });
       });
      });

      // Contact image server for profile images of dives
      vm.site.dives.forEach((dive) => {
        dsimg.getUserProfileImage(dive.diver.id)
        .then((response) => {
          if (response.data) {
            // We're expecting a JSON object containing at least {image: {public_id: String}}
            if (response.data.image && response.data.image.public_id) {
              dive.diver.profileImageUrl = $.cloudinary.url(response.data.image.public_id, {
                height: 60,
                width: 60,
                crop: 'fill',
              });
            }
          }
        });
      });

      // Build depth and duration histograms (if we have the data we need)
      const depths = vm.site.dives.map((d) => d.depth);
      const durations = vm.site.dives.map(d => moment.duration(d.duration).minutes());
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

    // Show a full-size version of the image in a modal
    function showBiggerImage(img) {
      console.log('showBiggerImage');
      console.log(img);
      $uibModal.open({
        controller: ($scope, image) => {
          // TODO: assigning to 'vm.image' doesn't seem to work; I
          // need to work out why.
          $scope.image = image;
        },
        controllerAs: 'vm',
        resolve: {
          image: () => img,
        },
        templateUrl: 'views/show-full-size-image.html',
        windowClass: 'show-full-size',
        size: 'lg',
        //scope: $scope,
      });
    }


    function userIsOwner(site) {
      return localStorageService.get('user') === site.owner.id;
    }

  }

  InformationCardController.$inject = ['$auth',
    '$document',
    '$location',
    '$rootScope',
    '$scope',
    '$uibModal',
    'dsapi',
    'dsimg',
    'informationCardCharts',
    'localStorageService',
  ];
  angular.module('divesites').controller('InformationCardController', InformationCardController);
})();
