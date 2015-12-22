(function () {
  'use strict';
  function profileDirective() {
    return {
      templateUrl: 'views/profile.html',
      restrict: 'E',
      controller: 'ProfileController',
      controllerAs: 'pcvm',
      link: (scope, elem, attrs, ctrl) => {
        // Apply MDL behaviour to MDL components
        componentHandler.upgradeAllRegistered();
        componentHandler.upgradeDom();
      },
    };
  }

  angular.module('divesites').directive('profile', profileDirective);
})();
