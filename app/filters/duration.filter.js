(function() {
  'use strict';
  function durationFilter(moment) {
    // Use moment.js to convert duration to minutes
    return (duration) => moment.duration(duration).asMinutes();
  }

  durationFilter.$inject = ['moment'];
  angular.module('divesites').filter('duration', durationFilter);
})();
