(function() {
  'use strict';

  function InformationCardController($auth, $scope, $timeout, $uibModal, dsapi, dscomments, dsimg, informationCardService) {
    const { apiCalls, formatGeocodingData, getNearbySlipways, userIsOwner } = informationCardService;
    const vm = this;

    activate();

    function activate() {
      console.log('InformationCardController.activate()');

      // Bind values to 'vm' that don't require a call to dsapi
      vm.isAuthenticated = $auth.isAuthenticated;
      // Ensure that 'images' is never undefined
      vm.images = [];
      vm.isLoading = true;
      vm.site = $scope.site || {};
      vm.site.images = [];
      vm.summonSetSiteHeaderImageModal = summonSetSiteHeaderImageModal;
      vm.summonUploadImageModal = summonUploadImageModal;
      vm.userProfileImageUrls = {};

      // Depending on the site type, we may offer different functionality
      if (vm.site.type === 'divesite') {
        vm.summonLogDiveModal = summonLogDiveModal;
      }

      // Retrieve comments for this site
      updateCommentListAndProfileCache();

      // Choose the right call to DSAPI, based on the site type
      const { apiCall } = apiCalls[vm.site.type];
      apiCall(vm.site.id)
      .then((response) => {
        console.log(response.data);
        // Handle the response from DSAPI: bind values, fetch profile images, etc.

        // Update our bound values with data from the API
        vm.site = Object.assign(vm.site, response.data);
        vm.site.locData = formatGeocodingData(vm.site);

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

          // getUserProfileImages(vm.site.dives.map(d => d.diver.id));

          // Force stats charts to be rebuilt
          $timeout(() => {
            $scope.$broadcast('refresh-statistics', vm.site);
          });
        }

        // Remove the isLoading flag
        vm.isLoading = false;
        // Check whether the user owns this site
        vm.userIsOwner = userIsOwner(vm.site);
      });
    }

    function updateCommentListAndProfileCache() {
      return updateCommentList()
      .then(updateUserProfileImageUrlCache);
    }

    function getUserProfileImageURLs(ids) {
      // Return a list of promises that resolve to {id, url} pairs
      const promises = ids.map(zipIdWithUrl);
      return Promise.all(promises);

      function formatProfileImageResponse(response) {
        if (response && response.data && response.data.public_id) {
          const profileImageUrl = $.cloudinary.url(response.data.public_id, {
            height: 60,
            width: 60,
            crop: 'fill',
            gravity: 'face',
          });
          return profileImageUrl;
        }

        return undefined;
      }

      function zipIdWithUrl(id) {
        return dsimg.getUserProfileImage(id)
        .then(formatProfileImageResponse)
        .then((url) => ({ id, url }));
      }
    }

    function getCommenterProfileImages() {
      const ids = new Set(vm.site.comments.map(c => c.owner.id));
      ids.forEach((id) => {
        dsimg.getUserProfileImage(id)
        .then((response) => {
          if (response && response.data && response.data.public_id) {
            const profileImageUrl = $.cloudinary.url(response.data.public_id, {
              height: 60,
              width: 60,
              crop: 'fill',
              gravity: 'face',
            });
            $timeout(() => {
              vm.site.comments.filter(c => c.owner.id === id).forEach(c => {
                c.owner.profileImageUrl = profileImageUrl;
              });
            });
          }
        });
      });
    }

    function getDiverProfileImages() {
      const ids = new Set(vm.site.dives.map(d => d.diver.id));
      ids.forEach(id => {
        dsimg.getUserProfileImage(id)
        .then((response) => {
          console.log(response.data);
          if (response.data && response.data.image && response.data.public_id) {
            const profileImageUrl = $.cloudinary.url(response.data.public_id, {
              height: 60,
              width: 60,
              crop: 'fill',
              gravity: 'face',
            });
            $timeout(() => {
              vm.site.dives.filter(d => d.diver.id === id).forEach(d => {
                d.diver.profileImageUrl = profileImageUrl;
              });
            });
          }
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
        console.log('heard comment-added');
        updateCommentListAndProfileCache();
      });

      $scope.$on('comment-list-updated', (event) => {
        console.log('heard comment-list-updated');
        updateCommentListAndProfileCache();
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

    function summonLogDiveModal() {
      const instance = $uibModal.open({
        controller: 'LogDiveModalController',
        controllerAs: 'vm',
        resolve: {
          site: () => vm.site,
        },
        size: 'lg',
        templateUrl: 'information-card/log-dive-modal.template.html',
      });
      instance.result.then((reason) => {
        if (reason === 'logged') {
          updateDiveListAndStatistics();
        }
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
        console.log(`set site header image modal closed with reason: ${reason}`);
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
        templateUrl: 'information-card/upload-image-modal.template.html',
      });
      instance.result.then((val) => {
        // If the modal closed because we uploaded an image, then reload
        // the image list
        if (val.reason === 'image-uploaded') {
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
        });
      });
    }

    function updateDiveListAndStatistics() {
      dsapi.getDivesite(vm.site.id)
      .then((response) => {
        vm.site.dives = response.data.dives;
        vm.site.depth = response.data.depth;
        vm.site.duration = response.data.duration;
        getDiverProfileImages();
        $scope.$broadcast('refresh-statistics', vm.site);
      });
    }

    function updateUserProfileImageUrlCache() {
      // To update the profile cache, we retrieve the list of
      retrieveComments(vm.site)
      .then((comments) => {
        vm.site.comments = comments;
      })
      .then(() => {
        const users = Array.from(new Set([].concat(
          vm.site.comments ? vm.site.comments.map(c => c.owner.id) : []
        )
        .concat(
          vm.site.dives ? vm.site.dives.map(d => d.diver.id) : []
        )));
        return users;
      })
      .then(getUserProfileImageURLs)
      .then((vals) => {
        $timeout(() => {
          vals.forEach(({ id, url }) => {
            // Populate the cache of user profile images
            vm.userProfileImageUrls[id] = url;
          });
        });
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
    'informationCardService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardController', InformationCardController);
})();
