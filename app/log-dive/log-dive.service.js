(function() {
  'use strict';
  function logDiveService($uibModal) {
    return {
      combineDateAndTime: (date, time) => {
        const year = moment(date).year();
        const month = moment(date).month();
        const day = moment(date).date();
        const hour = moment(time).hour();
        const minute = moment(time).minute();
        const combined = moment([year, month, day, hour, minute]);
        return combined;
      },

      defaultDateAndTime: () => {
        return {
          date: new Date(),
          time: new Date(),
        };
      },

      summonLogDiveModal,
    };

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
