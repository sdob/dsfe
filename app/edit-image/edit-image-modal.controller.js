(function() {
  'use strict';

  function EditImageModalController($scope, $uibModalInstance, confirmModalService, image) {
    const { reasons, summonConfirmModal } = confirmModalService;

    const vm = this;
    vm.cancel = cancel;
    vm.caption = image.caption;
    vm.modalCloseConfirmed = false;
    vm.image = image;
    vm.submit = submit;

    activate();

    function activate() {
      console.log('EditImageModalController.activate()');
      console.log(image);

      $scope.$on('modal.closing', (e) => {
        if (vm.modalCloseConfirmed || !$scope.captionForm.$dirty) {
          return;
        }

        e.preventDefault();

        const instance = summonConfirmModal({
          templateUrl: 'edit-image/confirm-cancel-editing.template.html',
        });
        instance.result.then((reason) => {
          if (reason === reasons.CONFIRMED) {
            vm.modalCloseConfirmed = true;
            $uibModalInstance.close();
          }
        });
      });
    }

    function cancel() {
      console.log('calling vm.cancel');
      $uibModalInstance.close();
    }

    function submit() {
      console.log($scope.captionForm);
    }
  }

  EditImageModalController.$inject = [
    '$scope',
    '$uibModalInstance',
    'confirmModalService',
    'image',
  ];
  angular.module('divesites.editImage').controller('EditImageModalController', EditImageModalController);
})();
