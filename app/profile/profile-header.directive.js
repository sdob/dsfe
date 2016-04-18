(function() {
  'use strict';
  function profileHeader() {
    return {
      controller: 'ProfileHeaderController',
      controllerAs: 'vm',
      link,
      scope: {
        editable: '=',
        user: '=',
      },
      templateUrl: 'profile/profile-header.template.html',
    };

    function link(scope, element, attrs, controller) {
    }
  }

  profileHeader.$inject = [];
  angular.module('divesites.profile').directive('profileHeader', profileHeader);
})();
