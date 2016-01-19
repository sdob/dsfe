(function() {
  'use strict';
  function CancelEditingModalController($location, $uibModalInstance, $window) {
    const vm = this;
    activate();

    function activate() {
      vm.dontPerformCancel = dontPerformCancel;
      vm.performCancel = performCancel;
    }

    function performCancel() {
      console.log(`perform cancel`);

      // Dismiss the modal instance
      $uibModalInstance.close();

      // Send us back in history
      $window.history.back();
    }

    function dontPerformCancel() {
      console.log(`don't perform cancel`);
      $uibModalInstance.close();
    }
  }

  CancelEditingModalController.$inject = [
    '$location',
    '$uibModalInstance',
    '$window',
  ];
  angular.module('divesites').controller('CancelEditingModalController', CancelEditingModalController);
})();
