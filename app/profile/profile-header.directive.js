(function() {
  'use strict';
  function profileHeader() {
    return {
      controller: 'ProfileHeaderController',
      controllerAs: 'vm',
      link,
      scope: true,
      templateUrl: 'profile/profile-header.html',
    };

    function link(scope, element, attrs, controller) {
    }
  }

  profileHeader.$inject = [];
  angular.module('divesites.profile').directive('profileHeader', profileHeader);
})();
