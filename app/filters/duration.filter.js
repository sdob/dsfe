(function() {
  'use strict';
  function durationFilter(moment) {
    return (duration) => (moment.duration(duration).hours() * 60) + moment.duration(duration).minutes();
  }

  durationFilter.$inject = ['moment'];
  angular.module('divesites').filter('duration', durationFilter);
})();
