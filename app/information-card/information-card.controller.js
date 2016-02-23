(function() {
  'use strict';

  function InformationCardController($auth, $scope, $timeout, $uibModal, dsapi, dscomments, dsimg, informationCardService) {
    const { apiCalls, formatGeocodingData, getNearbySlipways, userIsOwner } = informationCardService;
    const vm = this;

    activate();

    function activate() {
      console.log('InformationCardController.activate()');

      // Bind values to 'vm' that don't require a call to dsapi
      bindValues();

      // Retrieve comments for this site
      updateCommentList();

      const { apiCall } = apiCalls[vm.site.type];
      apiCall(vm.site.id)
      .then((response) => {
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

          // Divesites can have dive lists, which need profiles
          getDiverProfileImages();

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

    function bindValues() {
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.isLoading = true;
      vm.site = $scope.site || {};
      vm.site.images = [];
      vm.summonUploadImageModal = summonUploadImageModal;

      // Depending on the site type, we may offer different functionality
      if (vm.site.type === 'divesite') {
        vm.summonLogDiveModal = summonLogDiveModal;
      }
    }

    function getCommenterProfileImages() {
      const ids = new Set(vm.site.comments.map(c => c.owner.id));
      ids.forEach((id) => {
        dsimg.getUserProfileImage(id)
        .then((response) => {
          if (response && response.data.image && response.data.image.public_id) {
            const profileImageUrl = $.cloudinary.url(response.data.image.public_id, {
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
          if (response.data && response.data.image && response.data.image.public_id) {
            const profileImageUrl = $.cloudinary.url(response.data.image.public_id, {
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
      dsimg.getSiteImages(vm.site)
      .then((response) => {
        const images = response.data;
        // This could be an empty response with a 204, so we need to check
        // that there's content in the response body
        if (images) {
          // Give each image a transformed URL
          images.forEach((image) => {
            image.image.transformedUrl = $.cloudinary.url(image.image.public_id, {
              height: 80,
              width: 80,
              crop: 'fill',
            });
          });
          // Merge data together so that we only have one 'image' object for
          // each image. These have to sit in $scope so that the gallery controller
          // can access them.
          $scope.images = images.map(i => {
            const image = Object.assign({}, i.image);
            image.ownerID = i.ownerID;
            image.createdAt = i.createdAt;
            return image;
          });
          $scope.images.forEach((image) => {
            dsapi.getUserMinimal(image.ownerID)
            .then((response) => {
              image.ownerName = response.data.name;
              image.caption = `${image.ownerName}`;
            });
          });
        }
      });
    }

    function listenForChildEvents() {

      /* Listen for changes to the comments */
      $scope.$on('comment-added', (event) => {
        console.log('heard comment-added');
        updateCommentList();
      });

      $scope.$on('comment-list-updated', (event) => {
        console.log('heard comment-list-updated');
        updateCommentList();
      });

      /* Listen for changes to the list of logged dives */
      $scope.$on('dive-list-updated', (event) => {
        updateDiveListAndStatistics();
      });
    }

    function summonLogDiveModal() {
      const instance = $uibModal.open({
        controller: 'LogDiveModalController',
        controllerAs: 'vm',
        resolve: {
          site: () => vm.site,
        },
        templateUrl: 'information-card/log-dive-modal.template.html',
      });
      instance.result.then((reason) => {
        if (reason === 'logged') {
          updateDiveListAndStatistics();
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
      instance.result.then((reason) => {
        // If the modal closed because we uploaded an image, then reload
        // the image list
        if (reason === 'image-uploaded') {
          getSiteImages();
        }
      });
    }

    function updateCommentList() {
      dscomments.getSiteComments(vm.site)
      .then((response) => {
        $timeout(() => {
          vm.site.comments = response.data;
          getCommenterProfileImages();
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
