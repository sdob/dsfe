(function() {
  'use strict';
  function profileHeader() {
    return {
      controller: 'ProfileHeaderController',
      controllerAs: 'vm',
      link,
      scope: {
        user: '=',
        userId: '=',
      },
      templateUrl: 'profile/profile-header.html',
    };

    function link(scope, element, attrs, controller) {
      console.log('profileHeader.link()');
      console.log(scope);
    }
  }

  profileHeader.$inject = [];
  angular.module('divesites.profile').directive('profileHeader', profileHeader);
})();
