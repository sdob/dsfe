(function() {
  'use strict';

  function ConfirmDeleteImageModalController($uibModalInstance) {
    const vm = this;
    activate();

    function activate() {
      vm.cancel = cancel;
      vm.confirm = confirm;
    }

    function cancel() {
      $uibModalInstance.close('cancelled');
    }

    function confirm() {
      $uibModalInstance.close('confirmed');
    }
  }

  ConfirmDeleteImageModalController.$inject = [
    '$uibModalInstance',
  ];
  angular.module('divesites.profile').controller('ConfirmDeleteImageModalController', ConfirmDeleteImageModalController);
})();
