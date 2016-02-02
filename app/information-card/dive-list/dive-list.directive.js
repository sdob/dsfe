(function() {
  'use strict';
  function diveList(localStorageService) {
    return {
      controller: 'DiveListController',
      controllerAs: 'vm',
      link,
      scope: {
        dives: '=',
      },
      templateUrl: 'information-card/dive-list.html',
    };
    function link(scope, elem, attrs, ctrl) {
      scope.userId = localStorageService.get('user');
      console.log('divelist');
      console.log(scope);
    }
  }

  diveList.$inject = [
    'localStorageService',
  ];
  angular.module('divesites.informationCard').directive('diveList', diveList);
})();