(function() {
  'use strict';
  function DiveListController($http, $scope, $uibModal, localStorageService, logDiveService) {
    const vm = this;
    activate();

    function activate() {
      vm.summonConfirmDiveDeletionModal = summonConfirmDiveDeletionModal;
      vm.summonLogDiveModal = summonLogDiveModal;
      console.log($scope);
    }

    function summonLogDiveModal(dive, site) {
      const instance = logDiveService.summonLogDiveModal(dive, site);
      console.log('modal invoked');
      console.log(instance);
      instance.result.then((reason) => {
        console.log('log dive modal closed with reason...');
        console.log(reason);
        if (reason === 'logged') {
          $scope.$emit('dive-list-updated');
        }
      });
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
    'logDiveService',
  ];
  angular.module('divesites.informationCard').controller('DiveListController', DiveListController);
})();
