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
            //dsapi.getDivesite(i.divesiteID)
            let apiCall;
            let id;
            // FIXME: ugly hack because dsimg doesn't return a site type
            if (i.hasOwnProperty('divesiteID')) {
              apiCall = dsapi.getDivesite;
              id = i.divesiteID;
            } else if (i.hasOwnProperty('slipwayID')) {
              apiCall = dsapi.getSlipway;
              id = i.slipwayID;
            } else if (i.hasOwnProperty('compressorID')) {
              apiCall = dsapi.getCompressor;
              id = i.compressorID;
            }

            console.log(`im calling...`);
            console.log(apiCall);
            apiCall(id)
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
          const id = image._id;
          console.log('deleting image');
          console.log(image);
          // FIXME: ugly hack to get around the fact that dsimg doesn't
          // return a site type (yet)
          let apiCall;
          if (image.hasOwnProperty('divesiteID')) {
            apiCall = dsimg.deleteDivesiteImage;
          } else if (image.hasOwnProperty('slipwayID')) {
            apiCall = dsimg.deleteSlipwayImage;
          } else if (image.hasOwnProperty('compressorID')) {
            apiCall = dsimg.deleteCompressorImage;
          }

          return apiCall(id)
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
