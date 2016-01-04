(function () {
  'use strict';
  function CancelEditingModalController($location, $uibModalInstance) {
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
      // Change location to the main map
      $location.path('/');
    }
    function dontPerformCancel() {
      console.log(`don't perform cancel`);
      $uibModalInstance.close();
    }
  }

  CancelEditingModalController.$inject = ['$location', '$uibModalInstance',];
  angular.module('divesites').controller('CancelEditingModalController', CancelEditingModalController);
})();
