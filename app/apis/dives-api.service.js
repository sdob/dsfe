(function() {
  'use strict';

  function divesApi($http, API_URL, CacheFactory) {

    // Retrieve or create a cache for storing dives
    const diveCache = getOrCreateDiveCache();

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

    function getOrCreateDiveCache() {
      // Look for an existing cache
      const existingCache = CacheFactory.get('diveCache');
      // If it exists, return it
      if (existingCache) {
        return existingCache;
      }

      // If not, create and return the new cache
      return CacheFactory('diveCache');
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
    'CacheFactory',
  ];
  angular.module('divesites.apis').factory('divesApi', divesApi);
})();
