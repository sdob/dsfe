(function () {
  'use strict';
  function dsapiService($http) {
    const API_URL = 'http://localhost:8000';
    return {
      getDivesite: (id) => $http.get(`${API_URL}/divesites/${id}/`),
      getDivesites: () => $http.get(`${API_URL}/divesites/`),
      getUserDives: (id) => $http.get(`${API_URL}/users/${id}/dives/`),
      getUserDivesites: (id) => $http.get(`${API_URL}/users/${id}/divesites/`),
      getUserRecentActivity: (id) => $http.get(`${API_URL}/users/${id}/recent_activity/`),
      getUser: (id) => $http.get(`${API_URL}/users/${id}/`),
    };
  }

  dsapiService.$inject = ['$http'];
  angular.module('divesites').factory('dsapi', dsapiService);
})();
