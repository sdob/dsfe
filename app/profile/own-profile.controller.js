(function() {
  'use strict';
  function OwnProfileController($element, $rootScope, $scope, $timeout, $uibModal, dsactivity, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    const SLIPWAY_CTID = 10;
    const DIVESITE_CTID = 8;
    const COMPRESSOR_CTID = 11;

    function activate() {
      console.log('OwnProfileController.activate()');
      vm.editable = true;
      vm.user = vm.user || {
        id: localStorageService.get('user'),
      };
      vm.summonConfirmDeleteImageModal = summonConfirmDeleteImageModal;
      $scope.editable = true;

      $scope.$on('dive-log-updated', (e) => {
        console.log('heard dive-log-updated');
        // For now, we'll just do a complete reload of the user profile
        retrieveAndFormatOwnProfile();
      });

      retrieveAndFormatOwnProfile();

    }

    function retrieveAndFormatOwnProfile() {
      // Retrieve and format profile info
      dsapi.getOwnProfile()
      .then((response) => {
        // Format the user data
        vm.user = profileService.formatResponseData(response.data);
        // Format the places added
        vm.user.placesAdded = profileService.formatUserProfilePlacesAdded(vm.user);
        // Broadcast an event to force UI updates
        $scope.$broadcast('user-loaded', vm.user);

        // Get images this user has uploaded
        return dsimg.getUserImages(vm.user.id);
      })
      .then((response) => {
        vm.user.imagesAdded = profileService.formatUserProfileImagesAdded(response);
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
            type: image.content_type_model,
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
    'dsactivity',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('OwnProfileController', OwnProfileController);
})();
