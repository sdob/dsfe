(function () {
  'use strict';

  function truncateDepth() {
    return (depth) => parseInt(depth * 100) / 100;
  }

  angular.module('divesites').filter('truncateDepth', truncateDepth);
})();
