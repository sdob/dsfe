(function() {
  'use strict';

  function InformationCardController($auth, $scope, $timeout, $uibModal, dsapi, dscomments, dsimg, followService, informationCardService, logDiveService) {
    const { apiCalls, formatGeocodingData, getNearbySlipways, userIsOwner } = informationCardService;
    const vm = this;

    activate();

    function activate() {
      // Bind values to 'vm' that don't require a call to dsapi
      vm.isAuthenticated = $auth.isAuthenticated;
      // Ensure that 'images' is never undefined
      vm.images = [];
      vm.isLoading = true;
      vm.site = $scope.site || {};
      vm.site.locData = formatGeocodingData(vm.site);
      vm.site.images = [];
      vm.summonReportProblemModal = summonReportProblemModal;
      vm.summonSetSiteHeaderImageModal = summonSetSiteHeaderImageModal;
      vm.summonUploadImageModal = summonUploadImageModal;

      // Depending on the site type, we may offer different functionality
      if (vm.site.type === 'divesite') {
        // Divesites allow us to log dives
        vm.summonLogDiveModal = summonLogDiveModal;
      }

      // Retrieve comments for this site
      updateCommentList();

      // Choose the right call to DSAPI, based on the site type
      const { apiCall } = apiCalls[vm.site.type];
      apiCall(vm.site.id)
      .then((data) => {
        // Handle the response from DSAPI: bind values, fetch profile images, etc.

        // Update our bound values with data from the API
        vm.site = Object.assign(vm.site, data);
        vm.site.locData = formatGeocodingData(vm.site);

        console.log('InformationCardController#site:');
        console.log(vm.site);

        // Retrieve site images
        getSiteImages();

        // Set up event listeners
        listenForChildEvents();

        // Depending on the site, we may want to grab more information
        if (vm.site.type === 'divesite') {
          // Retrieve nearby slipways
          getNearbySlipways(vm.site)
          .then((slipways) => {
            vm.site.nearbySlipways = slipways;
          });

          // Force stats charts to be rebuilt
          $timeout(() => {
            $scope.$broadcast('refresh-statistics', vm.site);
          });

        }

        // Remove the isLoading flag
        vm.isLoading = false;
        // Check whether the user owns this site
        vm.userIsOwner = userIsOwner(vm.site);

        // Broadcast an event telling child components that the site info
        // has loaded
        $timeout(() => {
          $scope.$broadcast('site-loaded', vm.site);
        });

      });
    }

    function getSiteImages() {
      // Retrieve uploaded images for this site
      dsimg.getSiteImages(vm.site)
      .then((response) => {
        const images = response.data;
        // This could be an empty response with a 204, so we need to check
        // that there's content in the response body
        if (images) {
          // Give each image a transformed thumbnail URL
          images.forEach((image) => {
            image.url = $.cloudinary.url(image.public_id);
            image.transformedUrl = $.cloudinary.url(image.public_id, {
              height: 80,
              width: 80,
              crop: 'fill',
            });
          });
          vm.images = images;
          // We also have to bind the images to $scope, because
          // the Lightbox gallery isn't implemented (AFAIK) to allow
          // us to pass the variable in.
          $scope.images = images;
        }

        // Look for an image tagged as the header for this site
        const headerImage = vm.images.filter((i) => i.is_header_image)[0];
        if (headerImage) {
          vm.headerImage = headerImage;
        }
      });
    }

    function listenForChildEvents() {
      /* Listen for changes to the comments */
      $scope.$on('comment-added', (event) => {
        updateCommentList();
      });

      $scope.$on('comment-list-updated', (event) => {
        updateCommentList();
      });

      /* Listen for changes to the list of logged dives */
      $scope.$on('dive-list-updated', (event) => {
        updateDiveListAndStatistics();
      });
    }

    function setSiteHeaderImage(imageUrl) {
      $timeout(() => {
        vm.site.headerImageUrl = imageUrl;
        vm.backgroundStyle = {
          background: `url(${vm.site.headerImageUrl}) center / cover`,
        };
      });
    }

    function summonLogDiveModal(dive) {
      const instance = logDiveService.summonLogDiveModal(dive, vm.site);
      instance.result.then((reason) => {
        if (reason === 'logged') {
          updateDiveListAndStatistics();
        }
      });
    }

    function summonReportProblemModal() {
      const instance = $uibModal.open({
        controller: 'ReportProblemModalController',
        controllerAs: 'vm',
        resolve: {
          object: () => vm.site,
        },
        size: 'sm',
        templateUrl: 'report-problem/report-problem-modal.template.html',
      });
    }

    function summonSetSiteHeaderImageModal() {
      const instance = $uibModal.open({
        controller: 'SetSiteHeaderImageModalController',
        controllerAs: 'vm',
        resolve: {
          images: () => vm.images,
          site: () => vm.site,
        },
        templateUrl: 'information-card/set-site-header-image-modal.template.html',
      });
      instance.result.then((reason) => {
        // We have changed the header image, either by selecting an
        // existing image, by uploading a new one, or by clearing it
        // (in other words, we haven't cancelled our of the modal)
        if (reason === 'changed' || reason === 'cleared') {
          // We don't handle the header image here; we delegate it to
          // the header directive
          $scope.$broadcast('header-image-changed');
        }
      });
    }

    function summonUploadImageModal() {
      const instance = $uibModal.open({
        controller: 'UploadImageModalController',
        controllerAs: 'vm',
        resolve: {
          site: () => vm.site,
        },
        size: 'sm',
        templateUrl: 'information-card/upload-image-modal.template.html',
        windowClass: 'modal-center',
      });
      instance.result.then((val) => {
        // If the modal closed because we uploaded an image, then reload
        // the image list
        if (val.reason === 'uploaded') {
          getSiteImages();
        }
      });
    }

    function retrieveComments(site) {
      return dscomments.getSiteComments(site).then(response => response.data);
    }

    function updateCommentList() {
      return dscomments.getSiteComments(vm.site)
      .then((response) => {
        $timeout(() => {
          vm.site.comments = response.data;
          if (vm.isAuthenticated()) {
            vm.site.comments.forEach((comment) => {
              const owner = comment.owner;
              followService.userIsFollowing(owner)
              .then((result) => {
                comment.viewerIsFollowingOwner = result;
              });
            });
          }
        });
      });
    }

    function updateDiveListAndStatistics() {
      dsapi.getDivesite(vm.site.id)
      .then((data) => {
        vm.site.dives = data.dives;
        vm.site.depth = data.depth;
        vm.site.duration = data.duration;
        getDiverProfileImages();
        $scope.$broadcast('refresh-statistics', vm.site);
      });
    }
  }

  InformationCardController.$inject = [
    '$auth',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'dscomments',
    'dsimg',
    'followService',
    'informationCardService',
    'logDiveService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardController', InformationCardController);
})();
