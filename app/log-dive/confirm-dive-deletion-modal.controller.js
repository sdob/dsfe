(function() {
  'use strict';
  function ConfirmDiveDeletionModalController($scope, $timeout, $uibModalInstance, dive, dsapi) {
    const vm = this;
    activate();

    function activate() {
      console.log($scope);
      console.log(dive);
      vm.cancel = cancel;
      vm.delete = performDelete;
      vm.dive = dive;
    }

    function cancel() {
      $uibModalInstance.close();
    }

    function performDelete() {
      vm.isDeleting = true;
      console.log('deleting');
      dsapi.deleteDive(vm.dive.id)
      .then((response) => {
        $timeout(() => {
          vm.isDeleting = false;
          $uibModalInstance.close('deleted');
        }, 500);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  ConfirmDiveDeletionModalController.$inject = [
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'dive',
    'dsapi',
  ];
  angular.module('divesites.informationCard').controller('ConfirmDiveDeletionModalController', ConfirmDiveDeletionModalController);
})();
