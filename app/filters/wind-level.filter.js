(function() {
  'use strict';

  function windLevel(conditionsLayoutService) {
    const { winds } = conditionsLayoutService;
    return (level) => winds[level].description;
  }

  windLevel.$inject = [
    'conditionsLayoutService',
  ];
  angular.module('divesites').filter('windLevel', windLevel);
})();
