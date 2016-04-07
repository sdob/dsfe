(function() {
  'use strict';

  function DiveLogListController($scope, $timeout, $uibModal, dsapi, logDiveService, profileService) {
    const vm = this;
    activate();

    function activate() {
      console.log('DiveLogListController.activate()');
      vm.summonConfirmDiveDeletionModal = summonConfirmDiveDeletionModal;
      vm.summonLogDiveModal = summonLogDiveModal;
    }

    /* Return a function that takes a reason, compares it to the expected reason,
     * and emits an event to parent scope if the two match
     */
    function emitEventIfSuccessful(expectedReason, event) {
      return (reason) => {
        console.log(reason);
        if (reason === expectedReason) {
          $scope.$emit(event);
        }
      };
    }

    function summonConfirmDiveDeletionModal(dive) {
      console.log('deleting');
      profileService.confirmDiveDeletion(dive)
      .then(emitEventIfSuccessful('deleted', 'dive-log-updated'));
    }

    function summonLogDiveModal(dive) {
      profileService.editDive(dive)
      .then(emitEventIfSuccessful('logged', 'dive-log-updated'));
    }
  }

  DiveLogListController.$inject = [
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'logDiveService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('DiveLogListController', DiveLogListController);
})();
