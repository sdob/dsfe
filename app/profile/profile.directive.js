(function() {
  'use strict';
  function profileDirective() {
    return {
      templateUrl: 'profile/profile.html',
      restrict: 'E',
      controllerAs: 'vm',
      link,
    };

    function link(scope, elem, attrs, controller) {
    }
  }

  angular.module('divesites.profile').directive('profile', profileDirective);
})();
