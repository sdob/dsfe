(function() {
  'use strict';
  function addSomethingMenu() {
    return {
      link,
      templateUrl: 'map/add-something-menu.html',
    };
    function link(scope, element) {
      // Set up event listeners
      element.find('.floating-menu__header').on('click', toggleOpened);

      element.on('$destroy', () => {
        element.find('floating-menu__header').off('click', toggleOpened);
      });

      function toggleOpened() {
        element.find('.add-something-menu').toggleClass('open');
      }
    }
  }

  addSomethingMenu.$inject = [];
  angular.module('divesites.map').directive('addSomethingMenu', addSomethingMenu);
})();
