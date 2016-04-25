(function() {
  'use strict';

  function ConfirmModalController($uibModalInstance, confirmModalService) {
    const { reasons } = confirmModalService;
    const vm = this;
    // Bind 'vm.confirm' and 'vm.cancel' methods
    vm.confirm = confirm;
    vm.cancel = cancel;

    function cancel() {
      $uibModalInstance.close(reasons.CANCELLED);
    }

    function confirm() {
      $uibModalInstance.close(reasons.CONFIRMED);
    }
  }

  ConfirmModalController.$inject = [
    '$uibModalInstance',
    'confirmModalService',
  ];
  angular.module('divesites.widgets').controller('ConfirmModalController', ConfirmModalController);
})();
