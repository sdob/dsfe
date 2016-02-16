(function() {
  'use strict';
  function ownProfile() {
    return {
      controller: 'OwnProfileController',
      controllerAs: 'vm',
      templateUrl: 'profile/profile.template.html',
      restrict: 'E',
    };
  }

  ownProfile.$inject = [];
  angular.module('divesites.profile').directive('ownProfile', ownProfile);
})();
