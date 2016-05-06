(function() {
  'use strict';

  function divesApi() {
    return {
    };
  }

  divesApi.$inject = [
    '$http',
    'API_URL',
  ];
  angular.module('divesites.apis').factory('divesApi', divesApi);
})();
