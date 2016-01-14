(function () {
  'use strict';
  function logDiveService() {
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
      }
    };
  }
  logDiveService.$inject = [];
  angular.module('divesites').factory('logDiveService', logDiveService);
})();
