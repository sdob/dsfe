(function () {
  'use strict';
  console.log('loading level filter');
  function levelFilter() {
    return (level) => {
      if (level === 0) {
        return 'Beginner';
      }
      if (level === 1) {
        return 'Intermediate';
      }
      return 'Advanced';
    };
  }

  angular.module('divesites').filter('level', levelFilter);
})();
