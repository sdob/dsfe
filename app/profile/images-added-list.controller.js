(function() {
  'use strict';

  function ImagesAddedListController($scope, $timeout, $uibModal, dsimg, profileService) {
    const vm = this;

    vm.isLoading = true;
    vm.summonConfirmDeleteImageModal = summonConfirmDeleteImageModal;

    activate();

    function activate() {
      console.log('ImagesAddedListController.activate()');
      console.log($scope);
      console.log($scope.user);
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

    function summonConfirmDeleteImageModal(image, $index) {
      console.log('summoning delete image modal');
      console.log($index);
      const instance = $uibModal.open({
        controller: 'ConfirmDeleteImageModalController',
        controllerAs: 'vm',
        templateUrl: 'profile/confirm-delete-image-modal.template.html',
        windowClass: 'modal-center',
      });
      instance.result.then((reason) => {
        // Easier for us to handle deletion here, rather than in the modal controller
        if (reason === 'confirmed') {
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

  ImagesAddedListController.$inject = [
    '$scope',
    '$timeout',
    '$uibModal',
    'dsimg',
    'profileService',
  ];
  angular.module('divesites.profile').controller('ImagesAddedListController', ImagesAddedListController);
})();
