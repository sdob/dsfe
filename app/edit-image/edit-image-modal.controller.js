(function() {
  'use strict';

  function EditImageModalController($scope, $uibModalInstance, confirmModalService) {
    const { reasons, summonConfirmModal } = confirmModalService;

    const vm = this;
    vm.cancel = cancel;
    vm.submit = submit;

    function cancel() {
      // Check whether form is dirty
      const instance = summonConfirmModal({
        templateUrl: 'edit-image/confirm-cancel-editing.template.html',
      });
      instance.result.then((reason) => {
        if (reason === reasons.CONFIRMED) {
          $uibModalInstance.close();
        }
      });
    }

    function submit() {
      console.log($scope.editForm);
    }
  }

  EditImageModalController.$inject = [
    '$scope',
    '$uibModalInstance',
    'confirmModalService',
  ];
  angular.module('divesites.editImage').controller('EditImageModalController', EditImageModalController);
})();
