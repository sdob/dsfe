(function() {
  'use strict';
  function DiveListController($http, $scope, $uibModal, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.summonConfirmDiveDeletionModal = summonConfirmDiveDeletionModal;
    }

    function summonConfirmDiveDeletionModal(dive) {
      const instance = $uibModal.open({
        controller: 'ConfirmDiveDeletionModalController',
        controllerAs: 'vm',
        resolve: {
          dive: () => dive,
        },
        size: 'sm',
        templateUrl: 'information-card/dive-list/confirm-dive-deletion-modal.template.html',
        windowClass: 'modal-center',
      });
      instance.result.then((reason) => {
        if (reason === 'deleted') {
          // Tell our parent controller that we've deleted a dive
          $scope.$emit('dive-list-updated');
        }
      });
    }

  }

  DiveListController.$inject = [
    '$http',
    '$scope',
    '$uibModal',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('DiveListController', DiveListController);
})();
