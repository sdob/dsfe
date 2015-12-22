(function () {
  'use strict';
  function NavigationBar() {
    return {
      templateUrl: 'views/navigation-bar.html',
      link: () => {
        componentHandler.upgradeAllRegistered();
        componentHandler.upgradeDom();
      },
    };
  }

  angular.module('divesites').directive('navigationBar', NavigationBar);
})();
