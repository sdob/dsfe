(function () {
  'use strict';
  function dsapiService($http) {
    const API_URL = 'http://localhost:8000';
    return {
      getUser: (id) => $http.get(`${API_URL}/users/{$id}/`),
      retrieveDivesites: () => $http.get(`${API_URL}/divesites/`),
      retrieveDivesite: (id) => $http.get(`${API_URL}/divesites/${id}`),
    };
  }

  dsapiService.$inject = ['$http'];
  angular.module('divesites').factory('dsapi', dsapiService);
})();
