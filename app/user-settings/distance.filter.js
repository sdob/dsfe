(function() {
  'use strict';

  function distanceFilter() {
    return function(input) {
      return Math.floor(input * 0.621371);
    };
  }

  angular.module('divesites.userSettings').filter('distanceFilter', distanceFilter);
})();
