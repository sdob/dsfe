(function() {
  'use strict';

  /*
   * API module for communicating with the back-end services that hold
   * our data.
   */
  angular.module('divesites.apis', [
    'satellizer',
    'divesites.constants',
  ]);
})();
