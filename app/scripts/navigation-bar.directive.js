(function () {
  'use strict';
  function NavigationBar() {
    return {
      templateUrl: 'views/navigation-bar.html',
      link: () => {
      },
    };
  }

  angular.module('divesites').directive('navigationBar', NavigationBar);
})();
