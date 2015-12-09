(function () {
  'use strict';
  function FilterMenu() {
    return {
      templateUrl: 'views/filter-menu.html',
      restrict: 'EA',
      controller: 'FilterMenuController',
      controllerAs: 'fmvm',
      link: (scope, elem, attrs, ctrl) => {
        console.info('FilterMenu.link()');
      },
    };
  }
  angular.module('divesites').directive('filterMenu', FilterMenu);
})();
