(function() {

  function ConfirmModalController($uibModalInstance) {
    const vm = this;
    vm.confirm = confirm;
    vm.cancel = cancel;

    function cancel() {
      $uibModalInstance.close('cancelled');
    }

    function confirm() {
      $uibModalInstance.close('confirmed');
    }
  }

  ConfirmModalController.$inject = [
    '$uibModalInstance',
  ];
  angular.module('divesites.widgets').controller('ConfirmModalController', ConfirmModalController);
})();
