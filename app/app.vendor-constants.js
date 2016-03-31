(function() {
  'use strict';
  // Following the Papa style guide, define injectable constants for
  // third-party JS
  angular.module('divesites')
  .constant('d3', d3)
  .constant('haversine', haversine)
  .constant('moment', moment);
})();
