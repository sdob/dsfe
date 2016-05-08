(function() {
  'use strict';
  function logDiveService($uibModal, confirmModalService, dsapi) {
    const { reasons, summonConfirmModal } = confirmModalService;

    return {
      combineDateAndTime,
      deleteDive,
      defaultDateAndTime,
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

    function deleteDive(dive) {
      const instance = summonConfirmModal({
        templateUrl: 'log-dive/confirm-dive-deletion-modal.template.html',
      });

      return instance.result.then((reason) => {
        console.log('reason');
        console.log(reason);
        // Check the reason that the modal instance closed
        if (reason === reasons.CONFIRMED) {
          // If the modal was confirmed, then delete the dive
          return dsapi.deleteDive(dive)
          .then((response) => {
            return 'deleted';
          });
        } else {
          // Otherwise, return the cancelled reason
          return reasons.CANCELLED;
        }
      });
    }

    function defaultDateAndTime() {
      return {
        date: new Date(),
        time: new Date(),
      };
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
    'confirmModalService',
    'dsapi',
  ];
  angular.module('divesites.logDive').factory('logDiveService', logDiveService);
})();
