(function() {
  'use strict';
  function durationFilter() {
    return (duration) => moment.duration(duration).minutes();
  }

  angular.module('divesites').filter('duration', durationFilter);
})();
