(function() {
  'use strict';

  function ReportProblemModalController($scope, $timeout, $uibModal, $uibModalInstance, confirmModalService, object) {
    const { summonConfirmModal } = confirmModalService;
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

      $scope.$on('modal.closing', (e) => {
        console.log('modal.closing event');
        if (vm.modalCloseConfirmed || !$scope.reportProblemForm.$dirty) {
          return;
        }

        console.log('need to issue confirmation');

        e.preventDefault();

        const instance = summonConfirmModal({
          templateUrl: 'report-problem/cancel-reporting-problem-modal.template.html',
        });

        instance.result.then((reason) => {
          if (reason === 'confirmed') {
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
