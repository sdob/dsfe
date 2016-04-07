(function() {
  'use strict';

  function DiveLogListController($scope, $timeout, $uibModal, dsapi, logDiveService) {
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
        if (reason === expectedReason) {
          $scope.$emit(event);
        }
      };
    }

    function summonConfirmDiveDeletionModal(dive) {
      console.log('deleting');
      const instance = logDiveService.summonConfirmDiveDeletionModal(dive);
      // We might need to emit an event when the modal closes
      instance.result.then(emitEventIfSuccessful('deleted', 'dive-log-updated'));
    }

    function summonLogDiveModal(dive) {
      // We need to retrieve the divesite details first
      dsapi.getDivesite(dive.divesite.id)
      .then((response) => {
        const site = response.data;
        const instance = logDiveService.summonLogDiveModal(dive, site);
        // We might need to emit an event when the modal closes
        instance.result.then(emitEventIfSuccessful('logged', 'dive-log-updated'));
      });
    }
  }

  DiveLogListController.$inject = [
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'logDiveService',
  ];
  angular.module('divesites.profile').controller('DiveLogListController', DiveLogListController);
})();
