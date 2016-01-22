(function() {
  'use strict';

  function InformationCardController($auth, $document, $location, $rootScope, $scope, $timeout, $uibModal, dsapi, dsimg, informationCardService, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      // Site data is loaded by the map controller before the information card
      // is loaded
      vm.site = $scope.site;
      vm.site.images = {}; // Ensure that this is never undefined
      vm.site.locData = informationCardService.formatGeocodingData(vm.site);

      $timeout(() => {
        // Push this into the next tick so that the charts directive has linked
        $scope.$broadcast('refresh-statistics', vm.site);
      }, 0);

      // Initially show dive list
      vm.sectionVisibilities = {
        defaultSection: true,
        uploadImageForm: false,
        logDiveForm: false,
      };

      // Initially collapse histograms
      vm.collapseDepthChart = true;
      vm.collapseDurationHistogram = true;

      // TODO: why am I wrapping this in a timeout?
      $timeout(() => {
        // Wire up functions
        vm.isAuthenticated = $auth.isAuthenticated;
        $scope.isAuthenticated = $auth.isAuthenticated;
        vm.toggleSectionVisibility = toggleSectionVisibility;
        vm.toggleUploadImageForm = toggleUploadImageForm;

        // Note that informationCardService.userIsOwner(site) returns a function
        vm.userIsOwner = informationCardService.userIsOwner(vm.site);
      }, 0);

      // Get nearby slipways
      informationCardService.getNearbySlipways(vm.site)
      .then((slipways) => {
        vm.site.nearbySlipways = slipways;
      });

      // Get the divesite header image (if it exists)
      informationCardService.getDivesiteHeaderImage(vm.site)
      .then((imageUrl) => {
        if (imageUrl) {
          vm.site.headerImageUrl = imageUrl;
          vm.backgroundStyle = {
            background: `blue url(${vm.site.headerImageUrl}) center / cover`,
          };
        }
      });

      // Get the divesite's images (if they exist)
      informationCardService.getDivesiteImages(vm.site)
      .then((images) => {
        vm.site.images = images;
      });

      // Get divers' profile images
      getDiverProfileImages();

      /* Listen for events emitted upwards by LogDiveController */
      $scope.$on('dive-list-updated', (event) => {
        console.log('InformationController received "dive-list-updated"...');
        dsapi.getDivesite(vm.site.id)
        .then((response) => {
          vm.site = response.data;

          // Broadcast a refresh-histogram event to child scopes
          $scope.$broadcast('refresh-statistics', vm.site);
        });
      });
    }

    function getDiverProfileImages() { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
      // Create a set of user IDs --- no need to ping the image server
      // repeatedly for the same diver's profile image
      const ids = new Set(vm.site.dives.map(d => d.diver.id));
      ids.forEach((id) => {
        dsimg.getUserProfileImage(id)
        .then((response) => {
          if (response.data && response.data.image && response.data.image.public_id) {
            const profileImageUrl = $.cloudinary.url(response.data.image.public_id, {
              height: 60,
              width: 60,
              crop: 'fill',
              gravity: 'face',
            });
            vm.site.dives.filter(d => d.diver.id === id).forEach((d) => {
              d.diver.profileImageUrl = profileImageUrl;
            });
          }
        });
      });
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function toggleUploadImageForm() {
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
        vm.sectionVisibilities.defaultSection = true;
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
    'informationCardService',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardController', InformationCardController);
})();
