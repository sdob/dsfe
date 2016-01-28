(function() {
  'use strict';
  function profileHeader() {
    return {
      controller: 'ProfileHeaderController',
      controllerAs: 'vm',
      link,
      templateUrl: 'profile/profile-header.html',
    };

    function link(scope, element, attrs, controller) {
      console.log('profileHeader.link()');
    }
  }

  profileHeader.$inject = [];
  angular.module('divesites.profile').directive('profileHeader', profileHeader);
})();
