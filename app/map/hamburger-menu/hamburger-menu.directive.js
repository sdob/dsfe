(function() {
  'use strict';

  function hamburgerMenu() {
    return {
      controller :'HamburgerMenuController',
      controllerAs: 'hamburgerVM',
      templateUrl: 'map/hamburger-menu/hamburger-menu.template.html',
      link: function(scope, element) {
      }
    };
  }

  hamburgerMenu.$inject = [
  ];
  angular.module('divesites.hamburgerMenu').directive('hamburgerMenu', hamburgerMenu);
})();
