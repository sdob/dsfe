(function() {
  'use strict';
  function DiveListController($http, $scope, localStorageService, logDiveService) {
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
      const instance = logDiveService.summonConfirmDiveDeletionModal(dive);
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
    'localStorageService',
    'logDiveService',
  ];
  angular.module('divesites.informationCard').controller('DiveListController', DiveListController);
})();
