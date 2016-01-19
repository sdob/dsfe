(function() {
  'use strict';
  function addSomethingMenu() {
    return {
      templateUrl: 'views/add-something-menu.html',
    };
  }

  addSomethingMenu.$inject = [];
  angular.module('divesites').directive('addSomethingMenu', addSomethingMenu);
})();
