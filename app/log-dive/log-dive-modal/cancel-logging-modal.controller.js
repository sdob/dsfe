(function() {
  'use strict';
  function CancelLoggingModalController($location, $uibModalInstance, $scope, $window) {
    const vm = this;
    activate();

    function activate() {
      vm.dontPerformCancel = dontPerformCancel;
      vm.performCancel = performCancel;
    }

    function performCancel() {
      console.log(`perform cancel`);

      // Dismiss the modal instance
      $uibModalInstance.close('performCancel');

      // Send us back in history
      // $window.history.back();
    }

    function dontPerformCancel() {
      console.log(`don't perform cancel`);
      $uibModalInstance.close('dontPerformCancel');
    }
  }

  CancelLoggingModalController.$inject = [
    '$location',
    '$uibModalInstance',
    '$scope',
    '$window',
  ];
  angular.module('divesites.informationCard').controller('CancelLoggingModalController', CancelLoggingModalController);
})();
