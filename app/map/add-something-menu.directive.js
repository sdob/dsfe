(function() {
  'use strict';
  function addSomethingMenu() {
    return {
      templateUrl: 'map/add-something-menu.html',
    };
  }

  addSomethingMenu.$inject = [];
  angular.module('divesites.map').directive('addSomethingMenu', addSomethingMenu);
})();
