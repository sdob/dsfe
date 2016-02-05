(function() {
  'use strict';
  function CancelEditProfileModalController($uibModalInstance) {
    const vm = this;
    activate();

    function activate() {
      vm.performCancel = performCancel;
      vm.dontPerformCancel = dontPerformCancel;
    }

    function dontPerformCancel() {
      $uibModalInstance.close('dont-perform-cancel');
    }

    function performCancel() {
      $uibModalInstance.close('perform-cancel');
    }
  }

  CancelEditProfileModalController.$inject = [
    '$uibModalInstance',
  ];
  angular.module('divesites.profile').controller('CancelEditProfileModalController', CancelEditProfileModalController);
})();
