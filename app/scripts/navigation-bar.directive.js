(function () {
  'use strict';
  function NavigationBar() {
    return {
      templateUrl: 'views/navigation-bar.html',
      controller: 'NavigationBarController',
      controllerAs: 'nbvm',
      link: () => {
        console.log('navigationBar.link()');
      },
    };
  }

  angular.module('divesites').directive('navigationBar', NavigationBar);
})();
