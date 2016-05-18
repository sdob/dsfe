(function() {
  'use strict';

  function divesApi($http, API_URL, CacheFactory, cachingService, siteCacheService) {

    // Retrieve or create a cache for storing dives
    const diveCache = cachingService.getOrCreateCache('diveCache');
    // Retrieve or create divesite detail cache (since we need to invalidate
    // when a dive is added or updated)

    const { siteDetailCache } = siteCacheService;

    return {
      deleteDive,
      getDive,
      getDivesiteDives,
      postDive,
      updateDive,
    };

    function deleteDive(dive) {
      const siteID = dive.divesite.id;
      return $http.delete(`${API_URL}/dives/${dive.id}/`)
      .then(response => invalidateCacheAndReturnResponse(response, siteID));
    }

    function getDive(id) {
      return $http.get(`${API_URL}/dives/${id}/`);
    }

    function getDivesiteDives(id) {
      return $http.get(`${API_URL}/divesites/${id}/dives/`);
    }

    /*
     * Remove the cached information for the site with siteID,
     * then return the response
     */
    function invalidateCacheAndReturnResponse(response, id) {
      console.log(`invalidating cache for divesite ${id}`);
      siteDetailCache.remove(id);
      return response;
    }

    function postDive(data) {
      const siteID = data.divesite;
      return $http.post(`${API_URL}/dives/`, data)
      .then(response => invalidateCacheAndReturnResponse(response, siteID));
    }

    function updateDive(id, data) {
      const siteID = data.divesite;
      return $http.patch(`${API_URL}/dives/${id}/`, data)
      .then(response => invalidateCacheAndReturnResponse(response, siteID));
    }
  }

  divesApi.$inject = [
    '$http',
    'API_URL',
    'CacheFactory',
    'cachingService',
    'siteCacheService',
  ];
  angular.module('divesites.apis').factory('divesApi', divesApi);
})();
