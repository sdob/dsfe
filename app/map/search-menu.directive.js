(function() {
  'use strict';

  function searchMenu() {
    return {
      controller: 'SearchMenuController',
      controllerAs: 'vm',
      link,
      templateUrl: 'map/search-menu.html',
    };
    function link(scope, element) {
      console.log(scope);
      // Set up event listeners
      element.find('.floating-menu__header').on('click', toggleOpened);

      element.on('$destroy', () => {
        element.find('floating-menu__header').off('click', toggleOpened);
      });

      function toggleOpened() {
        element.find('.search-menu').toggleClass('open');
      }
    }
  }

  searchMenu.$inject = [
  ];
  angular.module('divesites.map').directive('searchMenu', searchMenu);
})();
