(function () {
  'use strict';
  function NavigationBar() {
    return {
      templateUrl: 'views/navigation-bar.html',
      controller: 'NavigationBarController',
      controllerAs: 'nbvm',
      link: () => {
      },
    };
  }

  angular.module('divesites').directive('navigationBar', NavigationBar);
})();
