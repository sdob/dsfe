(function () {
  'use strict';
  function diveList() {
    return {
      templateUrl: 'views/information-card/dive-list.html',
    };
  }
  angular.module('divesites.informationCard').directive('diveList', diveList);
})();
