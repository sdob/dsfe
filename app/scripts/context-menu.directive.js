(function() {
  'use strict';
  function mapContextMenu(contextMenuService) {
    return {
      templateUrl: 'views/map-context-menu.html',
      link: (scope, element, attrs, controller) => {
        const {x, y} = contextMenuService.pixel();
        console.log(x, y);
        element.find('.map-context-menu').css({'top': y, 'left': x});
      }
    };
  }

  mapContextMenu.$inject = ['contextMenuService'];
  angular.module('divesites').directive('mapContextMenu', mapContextMenu);
})();

