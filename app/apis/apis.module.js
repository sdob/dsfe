(function() {
  'use strict';
  const API_URL = '//divesites-api.herokuapp.com';
  const IMG_API_URL = '//dsimg.herokuapp.com';
  angular.module('divesites.apis', [
    'satellizer',
  ])
  .constant('API_URL', API_URL)
  .constant('IMG_API_URL', IMG_API_URL);
})();
