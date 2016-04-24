(function() {

  function ConfirmCancelModalController($uibModalInstance) {
    const vm = this;
    vm.dontPerformCancel = dontPerformCancel;
    vm.performCancel = performCancel;

    function dontPerformCancel() {
      $uibModalInstance.close('');
    }

    function performCancel() {
      $uibModalInstance.close('perform-cancel');
    }
  }

  ConfirmCancelModalController.$inject = [
    '$uibModalInstance',
  ];
  angular.module('divesites.widgets').controller('ConfirmCancelModalController', ConfirmCancelModalController);
})();
