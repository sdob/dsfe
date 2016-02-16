(function() {
  'use strict';

  function depthFilter() {
    return function(depth, unit) {
      if (unit === 'si') {
        return depth;
      }

      return depth * 3.28084;
    };
  }

  angular.module('divesites').filter('depth', depthFilter);
})();
