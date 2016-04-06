(function() {
  'use strict';
  function logDiveService($uibModal) {
    return {
      combineDateAndTime,
      defaultDateAndTime,
      summonConfirmDiveDeletionModal,
      summonLogDiveModal,
    };

    function combineDateAndTime(date, time) {
      const year = moment(date).year();
      const month = moment(date).month();
      const day = moment(date).date();
      const hour = moment(time).hour();
      const minute = moment(time).minute();
      const combined = moment([year, month, day, hour, minute]);
      return combined;
    }

    function defaultDateAndTime() {
      return {
        date: new Date(),
        time: new Date(),
      };
    }

    function summonConfirmDiveDeletionModal(dive) {
      return $uibModal.open({
        controller: 'ConfirmDiveDeletionModalController',
        controllerAs: 'vm',
        resolve: {
          dive: () => dive,
        },
        size: 'sm',
        templateUrl: 'log-dive/confirm-dive-deletion-modal.template.html',
        windowClass: 'modal-center',
      });
    }

    function summonLogDiveModal(dive, site) {
      return $uibModal.open({
        controller: 'LogDiveModalController',
        controllerAs: 'vm',
        resolve: {
          diveID: () => dive === undefined ? undefined : dive.id,
          site: () => site,
        },
        size: 'lg',
        templateUrl: 'log-dive/log-dive-modal.template.html',
      });
    }
  }

  logDiveService.$inject = [
    '$uibModal',
  ];
  angular.module('divesites.logDive').factory('logDiveService', logDiveService);
})();
