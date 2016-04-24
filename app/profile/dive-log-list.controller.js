(function() {
  'use strict';

  function DiveLogListController($auth, $scope, $timeout, $uibModal, conditionsLayoutService, dsapi, localStorageService, logDiveService, profileService) {
    const { getWeatherWiClass, winds } = conditionsLayoutService;

    const vm = this;
    vm.getWeatherWiClass = getWeatherWiClass;
    vm.winds = winds;
    activate();

    function activate() {
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.summonConfirmDiveDeletionModal = summonConfirmDiveDeletionModal;
      vm.summonLogDiveModal = summonLogDiveModal;

      if (vm.isAuthenticated()) {
        vm.viewingUserID = localStorageService.get('user');
      }
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

    function summonConfirmDiveDeletionModal($index, dive) {
      console.log($index, dive);
      logDiveService.deleteDive(dive)
      .then((result) => {
        // logDiveService takes care of the actual deletion; we just need
        // to know whether to update the dive log list
        // console.log(`reason: ${reason}`);
        console.log('result');
        console.log(result);
        if (result === 'deleted') {
          // We know that the dive has been deleted, so remove it from vm.dives
          // in the next cycle
          $timeout(() => {
            $scope.user.dives.splice($scope.user.dives.indexOf(dive), 1);
          });
        }
      });
    }

    function summonLogDiveModal(dive) {
      profileService.editDive(dive)
      .then(emitEventIfSuccessful('logged', 'dive-log-updated'));
    }
  }

  DiveLogListController.$inject = [
    '$auth',
    '$scope',
    '$timeout',
    '$uibModal',
    'conditionsLayoutService',
    'dsapi',
    'localStorageService',
    'logDiveService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('DiveLogListController', DiveLogListController);
})();
