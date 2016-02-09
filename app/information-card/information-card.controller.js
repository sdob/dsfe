(function() {
  'use strict';

  function InformationCardController($auth, $document, $location, $rootScope, $scope, $timeout, $uibModal, dsapi, dsimg, informationCardService, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.isLoading = true; // We're waiting for the site to load
      console.log('on activation, my scope site is');
      console.log($scope.site);
      vm.site = $scope.site || {};
      vm.site.images = {};
      // If we have geocoding data, then format it
      if (vm.site.geocoding_data) {
        console.log('i have GEOCODING DATA');
        vm.site.locData = informationCardService.formatGeocodingData(vm.site);
      }

      // This is the logged-in user's ID
      vm.userId = localStorageService.get('user');
      $scope.userId = vm.userId;

      const id = $scope.id;
      const type = $scope.type;
      const { apiCall, _ } = informationCardService.apiCalls[type];

      vm.siteID = id;
      vm.siteType = type;

      // Initially show dive list
      vm.sectionVisibilities = {
        defaultSection: true,
        uploadImageForm: false,
        logDiveForm: false,
      };

      // Initially collapse histograms
      vm.collapseDepthChart = true;
      vm.collapseDurationHistogram = true;

      // Wire up functions
      vm.isAuthenticated = $auth.isAuthenticated;
      $scope.isAuthenticated = $auth.isAuthenticated;
      vm.summonLogDiveModal = summonLogDiveModal;
      vm.summonSetDivesiteHeaderImageModal = summonSetDivesiteHeaderImageModal;
      vm.summonUploadImageModal = summonUploadImageModal;
      vm.toggleSectionVisibility = toggleSectionVisibility;
      vm.toggleUploadImageForm = toggleUploadImageForm;

      $timeout(() => {
        apiCall(id)
        .then((response) => {
          // Overwrite whatever site data we had at activation
          $scope.site = response.data;
          vm.site = response.data;
          vm.site.locData = informationCardService.formatGeocodingData(vm.site);

          // Get the divesite's images (if they exist)
          $timeout(() => {
            loadDivesiteImages();
          });

          // Get divers' profile images
          getDiverProfileImages();

          // Now we can determine whether the user owns this site
          vm.userIsOwner = informationCardService.userIsOwner(vm.site);

          // Get nearby slipways
          informationCardService.getNearbySlipways(vm.site)
          .then((slipways) => {
            vm.site.nearbySlipways = slipways;
          });

          // Force stats charts to be rebuilt
          $timeout(() => {
            // Push this into the next tick so that the charts directive has linked
            $scope.$broadcast('refresh-statistics', vm.site);
            // We're no longer loading, so remove the modal-mask
            vm.isLoading = false;
          });
        });
      }, 1000);

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
            $timeout(() => {
              vm.site.dives.filter(d => d.diver.id === id).forEach((d) => {
                d.diver.profileImageUrl = profileImageUrl;
              });
            }, 0);
          }
        });
      });
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function setDivesiteHeaderImage(imageUrl) {
      // If there's an image, dsimg will return 200 and a non-null object
      if (imageUrl) {
        $timeout(() => {
          console.log('setting divesite header image');
          vm.site.headerImageUrl = imageUrl;
          vm.backgroundStyle = {
            background: `blue url(${vm.site.headerImageUrl}) center / cover`,
          };
        });
      }
    }

    function summonLogDiveModal() {
      const instance = $uibModal.open({
        controller: 'LogDiveModalController',
        controllerAs: 'vm',
        templateUrl: 'information-card/log-dive-modal.html',
        resolve: {
          site: () => vm.site,
        },
      });
      instance.result.then((reason) => {
        if (reason === 'logged') {
          console.log('new dive logged');
        }
      });
    }

    function summonSetDivesiteHeaderImageModal() {
      const instance = $uibModal.open({
        controller: 'SetDivesiteHeaderImageModalController',
        controllerAs: 'vm',
        templateUrl: 'information-card/set-divesite-header-image-modal.html',
        resolve: {
          site: () => vm.site,
        },
      });
      instance.result.then((reason) => {
        // On successful upload of an image, load it from DSIMG
        if (reason === 'uploaded') {
          informationCardService.getDivesiteHeaderImage(vm.site.id)
          .then((imageUrl) => {
            console.log('came back with imageUrl');
            console.log(imageUrl);
            setDivesiteHeaderImage(imageUrl);
          })
          .catch((err) => {
            console.error(err);
          });
        }
      });
    }

    function summonUploadImageModal() {
      const instance = $uibModal.open({
        controller: 'UploadImageModalController',
        controllerAs: 'vm',
        templateUrl: 'information-card/upload-image-modal.html',
        resolve: {
          site: () => vm.site,
        },
      });
      instance.result.then((reason) => {
        if (reason === 'image-uploaded') {
          console.log('image was uploaded successfully');
          loadDivesiteImages();
        }
      });
    }

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

    function loadDivesiteImages() {
      informationCardService.getDivesiteImages(vm.site)
      .then((images) => {
        if (images) {
          $scope.images = images.map(i => {
            const image = Object.assign({}, i.image);
            image.ownerID = i.ownerID;
            return image;
          });
        }
      });
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
