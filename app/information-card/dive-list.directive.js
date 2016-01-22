(function() {
  'use strict';
  function diveList() {
    return {
      scope: {
        dives: '=',
      },
      templateUrl: 'views/information-card/dive-list.html',
    };
  }

  diveList.$inject = [];
  angular.module('divesites.informationCard').directive('diveList', diveList);
})();
