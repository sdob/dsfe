(function () {
  'use strict';
  function NavigationBar() {
    return {
      templateUrl: 'views/navigation-bar.html',
    };
  }

  angular.module('divesites').directive('navigationBar', NavigationBar);
})();
