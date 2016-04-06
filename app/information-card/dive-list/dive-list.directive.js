(function() {
  'use strict';
  function diveList(localStorageService) {
    return {
      controller: 'DiveListController',
      controllerAs: 'vm',
      link,
      scope: {
        dives: '=',
        site: '=',
        userProfileImageUrls: '=',
      },
      templateUrl: 'information-card/dive-list/dive-list.template.html',
    };
    function link(scope, elem, attrs, ctrl) {
      scope.userID = localStorageService.get('user');
      console.log('divelist');
      console.log(scope);
    }
  }

  diveList.$inject = [
    'localStorageService',
  ];
  angular.module('divesites.informationCard').directive('diveList', diveList);
})();
