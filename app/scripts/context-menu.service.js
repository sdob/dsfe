(function() {
  'use strict';
  function contextMenuService() {
    let latLng;
    let pixel;
    return {
      latLng: (coords) => {
        if (coords === undefined) {
          return latLng;
        }
        latLng = coords;
      },
      pixel: (p) => {
        if (p === undefined) {
          return pixel;
        }
        pixel = p;
      },
    };
  }

  angular.module('divesites').factory('contextMenuService', contextMenuService);
})();
