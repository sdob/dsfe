(function() {
  'use strict';
  function OwnProfileController($element, $rootScope, $scope, $timeout, $uibModal, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    function activate() {
      console.log('OwnProfileController.activate()');
      vm.editable = true;
      vm.user = vm.user || {
        id: localStorageService.get('user'),
      };
      vm.summonConfirmDeleteImageModal = summonConfirmDeleteImageModal;
      $scope.editable = true;

      // Retrieve profile info
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
        vm.user.imagesAdded = [];
        // Ensure that nothing is undefined
        vm.user.compressors = vm.user.compressors || [];
        vm.user.divesites = vm.user.divesites || [];
        vm.user.slipways = vm.user.slipways || [];

        // Build a 'contributions' list
        vm.user.placesAdded = [].concat(
          vm.user.divesites.map((x) => Object.assign({ type: 'divesite' }, x)),
            vm.user.compressors.map((x) => Object.assign({ type: 'compressor' }, x)),
              vm.user.slipways.map((x) => Object.assign({ type: 'slipway' }, x))
        );
        $scope.$broadcast('user-loaded', vm.user);
        return dsimg.getUserImages(vm.user.id);
      })
      .then((response) => {
        console.log(`response from dsimg: ${response.data.length}`);
        $timeout(() => {
          vm.user.imagesAdded = response.data;
          vm.user.imagesAdded.forEach((i) => {
            i.url = $.cloudinary.url(i.public_id);
            //dsapi.getDivesite(i.divesiteID)
            let apiCall;
            let id;
            // FIXME: ugly hack because dsimg doesn't return a site type;
            // ultimately we should be returning the site name with the
            // image information
            if (i.content_type === 8) {
              apiCall = dsapi.getDivesite;
            } else if (i.content_type === 11) {
              apiCall = dsapi.getSlipway;
            } else if (i.content_type === 10) {
              apiCall = dsapi.getCompressor;
            }

            apiCall(i.object_id)
            .then((response) => {
              i.divesiteName = response.data.name;
            });
          });
        });
      })
      .catch((err) => {
        console.error(err);
      });
    }

    function summonConfirmDeleteImageModal(image, $index) {
      console.log('summoning delete image modal');
      console.log($index);
      const instance = $uibModal.open({
        controller: 'ConfirmDeleteImageModalController',
        controllerAs: 'vm',
        templateUrl: 'profile/confirm-delete-image-modal.template.html',
      });
      instance.result.then((reason) => {
        // Easier for us to handle deletion here
        if (reason === 'confirmed') {
          // We can give the user immediate feedback by removing
          // the element from the DOM while we contact DSIMG in the
          // background.
          vm.user.imagesAdded.splice(vm.user.imagesAdded.indexOf(image), 1);
          // Now contact DSIMG to perform the deletion
          const id = image.id;
          const site = {
            id: image.object_id,
            type: dsimg.CONTENT_TYPES[image.content_type],
          };

          return dsimg.deleteSiteImage(site, id)
          .then((response) => {
            console.log(response.data);
          });
        }
      });
    }
  }

  OwnProfileController.$inject = [
    '$element',
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('OwnProfileController', OwnProfileController);
})();
