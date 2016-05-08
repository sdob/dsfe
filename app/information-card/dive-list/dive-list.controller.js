(function() {
  'use strict';
  function DiveListController($http, $scope, localStorageService, logDiveService) {
    const vm = this;
    activate();

    function activate() {
      vm.summonConfirmDiveDeletionModal = summonConfirmDiveDeletionModal;
      vm.summonLogDiveModal = summonLogDiveModal;
    }

    function summonLogDiveModal(dive, site) {
      const instance = logDiveService.summonLogDiveModal(dive, site);
      instance.result.then((reason) => {
        if (reason === 'logged') {
          $scope.$emit('dive-list-updated');
        }
      });
    }

    function summonConfirmDiveDeletionModal(dive) {
      logDiveService.deleteDive(dive)
      .then((result) => {
        if (result === 'deleted') {
          $scope.$emit('dive-list-updated');
        }
      });
    }

  }

  DiveListController.$inject = [
    '$http',
    '$scope',
    'localStorageService',
    'logDiveService',
  ];
  angular.module('divesites.informationCard').controller('DiveListController', DiveListController);
})();
