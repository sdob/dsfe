(function () {
  'use strict';

  function InformationCardController($auth, $document, $location, $rootScope, $scope, $timeout, $uibModal, dsapi, dsimg, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      console.log($scope);
      vm.site = $scope.site;
      vm.site.images = {}; // Ensure that this is never undefined
      // Initially show dive list
      vm.sectionVisibilities = {
        default: true,
          uploadImageForm: false,
          logDiveForm: false,
      };
      // Initially collapse histograms
      vm.collapseDepthChart = true;
      vm.collapseDurationHistogram = true;
      // Wire up functions
      vm.dismiss = dismiss;
      vm.getDivesiteImages = getDivesiteImages;
      $timeout(() => {
        vm.isAuthenticated = $auth.isAuthenticated;
        $scope.isAuthenticated = $auth.isAuthenticated;
        vm.toggleSectionVisibility = toggleSectionVisibility;
        vm.showFullSizeImage = showFullSizeImage;
        vm.toggleUploadImageForm = toggleUploadImageForm;
        vm.userIsOwner = userIsOwner;
      }, 0);

      console.log($auth.isAuthenticated);

      /* Contact API for various bits and bobs */
      getNearbySlipways();
      getDivesiteHeaderImage();
      getDivesiteImages();
      getDiverProfileImages();

      // handle keydown events (ESC keypress dismisses the information card */
      $document.on('keydown', keydownListener);
      $rootScope.$on('$destroy', () => {
        $document.off('keydown', keydownListener);
      });
    }

    function dismiss() {
      // Remove self from the DOM
      $location.search('');
      $('information-card').remove();
    }

    function getDiverProfileImages() {
      // Contact image server for profile images of dives
      vm.site.dives.forEach((dive) => {
        dsimg.getUserProfileImage(dive.diver.id)
        .then((response) => {
          if (response.data) {
            // We're expecting a JSON object containing at least {image: {public_id: String}}
            if (response.data && response.data.image && response.data.image.public_id) {
              dive.diver.profileImageUrl = $.cloudinary.url(response.data.image.public_id, {
                height: 60,
                width: 60,
                crop: 'fill',
                gravity: 'face',
              });
            }
          }
        });
      });
    }

    function getDivesiteHeaderImage() {
      // Contact image server for header image
      dsimg.getDivesiteHeaderImage(vm.site.id)
      .then((response) => {
        if(response.data && response.data.image && response.data.image.public_id) {
          const public_id = response.data.image.public_id;
          vm.site.headerImageUrl = $.cloudinary.url(public_id, {
          });
          vm.backgroundStyle = {
            'background': `blue url(${vm.site.headerImageUrl}) center / cover`,
          };
        }
      });
    }

    function getDivesiteImages() {
      // Contact image server for divesite images
      dsimg.getDivesiteImages(vm.site.id)
      .then((response) => {
        //vm.site.images = response.data.map((item) => item.image);
        vm.site.images = response.data;
        vm.site.images.forEach((image) => {
          image.transformedUrl = $.cloudinary.url(image.image.public_id, {
            height: 60,
            width: 60,
            crop: 'fill',
          });
        });
        console.log('vm.site.images:');
        console.log(vm.site.images);
      });
    }

    function getNearbySlipways() {
      // Contact API server for nearby slipways
      dsapi.getNearbySlipways(vm.site.id)
      .then((response) => {
        vm.site.nearbySlipways = response.data.map((slipway) => {
          const s = slipway;
          // Global 'haversine' variable
          s.distanceFromDivesite = haversine(
            {latitude: vm.site.latitude, longitude: vm.site.longitude},
            {latitude: slipway.latitude, longitude: slipway.longitude}
          );
          return s;
        });
      });
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
    function showFullSizeImage(img) {
      $uibModal.open({
        controller: 'ShowFullSizeImageController',
        controllerAs: 'vm',
        resolve: {
          image: () => img,
        },
        templateUrl: 'views/show-full-size-image.html',
        windowClass: 'show-full-size-image',
        size: 'lg',
        //scope: $scope,
      });
    }


    function toggleUploadImageForm() {
      console.log('toggling!');
      // If the upload image form is currently visible, hide it and
      // show the dive list (the default view)
      if (vm.sectionVisibilities.uploadImageForm) {
        vm.sectionVisibilities.uploadImageForm = false;
        vm.sectionVisibilities.diveList = true;
      } else {
        // If the upload image form is currently invisible, set
        // all other section visibilities to false and the upload image
        // form's visibility to true
        Object.keys(vm.sectionVisibilities).forEach((k) => {
          vm.sectionVisibilities[k] = false;
        });
        vm.sectionVisibilities.uploadImageForm = true;
      }
    }

    function toggleSectionVisibility(section) {
      // If we've been passed garbage, just return
      if (!vm.sectionVisibilities.hasOwnProperty(section)) return;
      if (vm.sectionVisibilities[section]) {
        // If the section is currently visible, hide it, then
        // show the dive list (the default view)
        vm.sectionVisibilities[section] = false;
        vm.sectionVisibilities.default = true;
      } else {
        // If the section is currently invisible, set
        // all other section visibilities to false and the upload image
        // form's visibility to true
        Object.keys(vm.sectionVisibilities).forEach((k) => {
          vm.sectionVisibilities[k] = false;
        });
        vm.sectionVisibilities[section] = true;
      }
    }

    function userIsOwner() {
      // Check whether the authenticated user owns this site
      return localStorageService.get('user') === vm.site.owner.id;
    }

  }

  InformationCardController.$inject = ['$auth',
    '$document',
    '$location',
    '$rootScope',
    '$scope',
    '$timeout', 
    '$uibModal',
    'dsapi',
    'dsimg',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardController', InformationCardController);
})();
