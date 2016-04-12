(function() {
  'use strict';
  function OwnProfileController($element, $rootScope, $scope, $timeout, $uibModal, dsactivity, dsapi, dsimg, localStorageService, profileService) {
    const SLIPWAY_CTID = 10;
    const DIVESITE_CTID = 8;
    const COMPRESSOR_CTID = 11;

    $scope.editable = true;

    const vm = this;
    // This flag sets the profile as editable, which we'll pass to the
    // header and other components so that they know to display editing
    // action buttons
    vm.editable = true;
    // Summon a deletion confirmation modal when the user tries to delete
    // an image from their list
    vm.summonConfirmDeleteImageModal = summonConfirmDeleteImageModal;
    vm.user = vm.user || {
      id: localStorageService.get('user'),
    };

    // Run the activation block
    activate();

    function activate() {
      console.log('OwnProfileController.activate()');

      // Retrieve the user's own (expanded) profile data
      retrieveAndFormatOwnProfile();

      // Get images this user has uploaded
      dsimg.getUserImages(vm.user.id)
      .then((response) => {
        console.log('images added');
        console.log(response.data);
        // Push scope update into next tick
        $timeout(() => {
          // Format the images added
          vm.user.imagesAdded = profileService.formatUserProfileImagesAdded(response);
          console.log(vm.user.imagesAdded);
        });
      })
      .catch(handleErrorResponse);

      // Listen for events telling us that the dive log has changed, so
      // that we can update the user's statistics in the header
      $scope.$on('dive-log-updated', (e) => {
        console.log('heard dive-log-updated');
        // For now, we'll just do a complete reload of the user profile
        // whenever the dive log has changed
        retrieveAndFormatOwnProfile();
      });
    }

    /*
     * Any error responses should be the fault of the API server, and not
     * something we can control ourselves. In the long term, we should
     * provide a UI update that indicates this, but for now we'll just
     * dump the error to the console.
     */
    function handleErrorResponse(err) {
      console.error(err);
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
      })
      .catch(handleErrorResponse);
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

          // Format the image data that the API expects
          const id = image.id;
          const site = {
            id: image.object_id,
            type: image.content_type_model,
          };

          // Send the deletion request to the API
          return dsimg.deleteSiteImage(site, id);
        }
      })
      .then((response) => {
        // We don't really need to do anything with the response in production
        console.log(response.data);
      })
      .catch(handleErrorResponse);
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
