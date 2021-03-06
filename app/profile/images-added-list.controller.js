(function() {
  'use strict';

  function ImagesAddedListController($scope, $timeout, $uibModal, confirmModalService, dsimg, editImageService, profileService) {
    const { reasons, summonConfirmModal } = confirmModalService;
    // const { summonEditImageModal } = editImageService;
    const vm = this;

    vm.isLoading = true;
    vm.summonConfirmDeleteImageModal = summonConfirmDeleteImageModal;
    vm.summonEditImageModal = summonEditImageModal;

    activate();

    function activate() {
      vm.user = $scope.user;

      // Retrieve user images
      dsimg.getUserImages(vm.user.id)
      .then((response) => {
        vm.isLoading = false;
        $timeout(() => {
          vm.images = profileService.formatUserProfileImagesAdded(response);
        });
      })
      .catch(handleErrorResponse);
    }

    function handleErrorResponse(err) {
      console.error(err);
    }

    function summonEditImageModal(image) {
      const instance = editImageService.summonEditImageModal(image);
      instance.result.then((reason) => {
        // We're expecting {reason: 'blah', data: {...}}
        if (reason.result === 'edited') {
          // Update the caption in the UI
          image.caption = reason.data.caption;
        }
      });
    }

    function summonConfirmDeleteImageModal(image, $index) {
      console.log($index);
      const instance = summonConfirmModal({
        templateUrl: 'profile/confirm-delete-image-modal.template.html',
      });

      instance.result.then((reason) => {
        // Easier for us to handle deletion here, rather than in the modal controller
        if (reason === reasons.CONFIRMED) {
          // We can give the user immediate feedback by removing
          // the element from the DOM while we contact DSIMG in the
          // background.
          vm.images.splice(vm.images.indexOf(image), 1);

          // Format the image data that the API expects
          const id = image.id;
          const site = {
            id: image.object_id,
            type: image.content_type_model,
          };

          // Send the deletion request to the API
          return dsimg.deleteSiteImage(site, id)
          .then((response) => {
            console.log(response.data);
          });
        }
      })
      .catch(handleErrorResponse);
    }
  }

  ImagesAddedListController.$inject = [
    '$scope',
    '$timeout',
    '$uibModal',
    'confirmModalService',
    'dsimg',
    'editImageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('ImagesAddedListController', ImagesAddedListController);
})();
