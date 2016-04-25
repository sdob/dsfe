(function() {
  'use strict';

  function ReportProblemModalController($scope, $timeout, $uibModal, $uibModalInstance, confirmModalService, object) {
    const { reasons, summonConfirmModal } = confirmModalService;
    const vm = this;

    vm.dismiss = dismiss;
    vm.modalCloseConfirmed = false;
    vm.object = object;
    vm.submit = submit;

    activate();

    function activate() {
      console.log('ReportProblemModalController.activate()');
      console.log('vm.object.name');
      console.log(vm.object.name);

      // Catch modal closing events and show a confirmation modal if the user
      // is cancelling
      $scope.$on('modal.closing', (e) => {
        console.log('modal.closing event');
        // If the user has already indicated that they definitely want to
        // close, or if the form isn't dirty, then just go ahead and close
        if (vm.modalCloseConfirmed || !$scope.reportProblemForm.$dirty) {
          return;
        }

        // Otherwise, we need to show a confirmation modal, so cancel this event
        e.preventDefault();

        // Show the modal
        const instance = summonConfirmModal({
          templateUrl: 'report-problem/cancel-reporting-problem-modal.template.html',
        });

        // If the user confirmed that they want to close, then set the
        // modalCloseConfirmed flag to true, and re-fire the event
        instance.result.then((reason) => {
          if (reason === reasons.CONFIRMED) {
            vm.modalCloseConfirmed = true;
            $uibModalInstance.dismiss();
          }
        });
      });
    }

    function dismiss() {
      console.log('vm.dismiss called');
      $uibModalInstance.close();
    }

    function submit() {
      vm.isSubmitting = true;

      $timeout(() => {
        vm.isSubmitting = false;
      }, 2000);
    }
  }

  ReportProblemModalController.$inject = [
    '$scope',
    '$timeout',
    '$uibModal',
    '$uibModalInstance',
    'confirmModalService',
    'object',
  ];
  angular.module('divesites.reportProblem').controller('ReportProblemModalController', ReportProblemModalController);
})();
