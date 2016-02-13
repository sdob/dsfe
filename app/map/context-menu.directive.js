(function() {
  'use strict';
  function mapContextMenu(contextMenuService) {
    return {
      templateUrl: 'map/map-context-menu.template.html',
      link: (scope, element, attrs, controller) => {
        const { x, y } = contextMenuService.pixel();
        element.find('.map-context-menu').css({ top: y, left: x });
      },
    };
  }

  mapContextMenu.$inject = ['contextMenuService'];
  angular.module('divesites.map').directive('mapContextMenu', mapContextMenu);
})();

