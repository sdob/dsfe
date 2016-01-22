(function() {
  'use strict';
  function profileDirective() {
    return {
      templateUrl: 'views/profile.html',
      restrict: 'E',
      controllerAs: 'vm',
      link: (scope, elem, attrs, ctrl) => {
        console.log('profile.link()');
        console.log(scope);
      },
    };
  }

  angular.module('divesites').directive('profile', profileDirective);
})();
