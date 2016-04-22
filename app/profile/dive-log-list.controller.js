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

    function summonConfirmDiveDeletionModal(dive) {
      profileService.confirmDiveDeletion(dive)
      .then(emitEventIfSuccessful('deleted', 'dive-log-updated'));
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
