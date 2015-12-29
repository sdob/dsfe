(function () {
  'use strict';
  function profileDirective() {
    return {
      templateUrl: 'views/profile.html',
      restrict: 'E',
      controller: 'ProfileController',
      controllerAs: 'pcvm',
      link: (scope, elem, attrs, ctrl) => {
      },
    };
  }

  angular.module('divesites').directive('profile', profileDirective);
})();
