(function() {
  'use strict';

  function divesApi() {
    return {
      deleteDive,
      getDive,
      getDivesiteDives,
      postDive,
      updateDive,
    };

    function deleteDive(id) {
      return $http.delete(`${API_URL}/dives/${id}/`);
    }

    function getDive(id) {
      return $http.get(`${API_URL}/dives/${id}/`);
    }

    function getDivesiteDives(id) {
      return $http.get(`${API_URL}/divesites/${id}/dives/`);
    }

    function postDive(data) {
      return $http.post(`${API_URL}/dives/`, data);
    }

    function updateDive(id, data) {
      return $http.patch(`${API_URL}/dives/${id}/`, data);
    }
  }

  divesApi.$inject = [
    '$http',
    'API_URL',
  ];
  angular.module('divesites.apis').factory('divesApi', divesApi);
})();
