(function() {
  'use strict';

  function ReportProblemModalController($scope, $timeout, $uibModal, $uibModalInstance, object) {
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

        const instance = $uibModal.open({
          controller: 'CancelReportingProblemModalController',
          controllerAs: 'vm',
          size: 'sm',
          templateUrl: 'report-problem/cancel-reporting-problem-modal.template.html',
          windowClass: 'modal-center',
        });

        instance.result.then((reason) => {
          if (reason === 'performCancel') {
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
    'object',
  ];
  angular.module('divesites.reportProblem').controller('ReportProblemModalController', ReportProblemModalController);
})();
