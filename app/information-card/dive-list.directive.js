(function() {
  'use strict';
  function diveList() {
    return {
      scope: {
        dives: '=',
      },
      templateUrl: 'information-card/dive-list.html',
    };
  }

  diveList.$inject = [];
  angular.module('divesites.informationCard').directive('diveList', diveList);
})();
