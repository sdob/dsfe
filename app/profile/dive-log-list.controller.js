(function() {
  'use strict';

  function DiveLogListController($scope, $timeout, $uibModal, dsapi, logDiveService) {
    const vm = this;
    activate();

    function activate() {
      console.log('DiveLogListController.activate()');
      vm.summonConfirmDiveDeletionModal = summonConfirmDiveDeletionModal;
      vm.summonDiveLogModal = summonDiveLogModal;
      console.log($scope);
    }

    function summonConfirmDiveDeletionModal(dive) {
      console.log('deleting');
      const instance = logDiveService.summonConfirmDiveDeletionModal(dive);
      instance.result.then((reason) => {
        if (reason === 'deleted') {
          console.log('dive sucessfully deleted');
          // TODO: Other components within the profile should update their
          // knowledge of the dive log when it changes
          $scope.$emit('dive-log-updated');
          dsapi.getUserDives($scope.user.id)
          .then((response) => {
            $timeout(() => {
              $scope.dives = response.data;
            });
          });
        }
      });
    }

    function summonDiveLogModal() {
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
