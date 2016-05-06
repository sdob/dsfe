(function() {
  'use strict';

  /*
   * Service wrapping HTTP calls to the main REST API. Everything returns
   * a Promise.
   */
  function dsapiService($auth, $http, API_URL, CacheFactory) {

    function getOrCreateSiteCache() {
      if (CacheFactory.get('siteCache')) {
        return CacheFactory.get('siteCache');
      }

      return CacheFactory('siteCache', {
        maxAge: 15 * 60 * 1000,
        cacheFlushInterval: 60 * 60 * 1000,
        deleteOnExpire: 'aggressive',
      });
    }

    const siteCache = getOrCreateSiteCache();

    const COMPRESSOR_LIST_VIEW = `${API_URL}/compressors/`;
    const DIVESITE_LIST_VIEW = `${API_URL}/divesites/`;
    const SLIPWAY_LIST_VIEW = `${API_URL}/slipways/`;

    return {

      /* DELETE methods */
      deleteDive,

      /* GET methods */
      getCompressor,
      getCompressors,
      getDive,
      getDivesite,
      getDivesites,
      getDivesiteComments,
      getDivesiteDives,
      getNearbySlipways,
      getOwnProfile,
      getStatistics,
      getSlipway,
      getSlipways,
      getUser,
      getUserDives,
      getUserDivesites,
      getUserMinimal,

      /* POST methods */
      postCompressor,
      postDive,
      postDivesite,
      postSlipway,

      /* UPDATE methods */
      updateCompressor,
      updateDive,
      updateDivesite,
      updateSlipway,
      updateProfile,

    };

    function getCompressor(id) {
      return $http.get(`${API_URL}/compressors/${id}/`);
    }

    // Retrieve compressor list, from cache or by API request
    function getCompressors() {
      return $http.get(COMPRESSOR_LIST_VIEW, {
        cache: siteCache,
      });
    }

    function getDive(id) {
      return $http.get(`${API_URL}/dives/${id}/`);
    }

    function getDivesite(id) {
      return $http.get(`${API_URL}/divesites/${id}/`);
    }

    // Retrieve divesite list, from cache or by API request
    function getDivesites() {
      const start = new Date().getTime();
      return $http.get(DIVESITE_LIST_VIEW, {
        cache: siteCache,
      });
    }

    function getDivesiteComments(id) {
      return $http.get(`${API_URL}/divesites/${id}/comments/`);
    }

    function getDivesiteDives(id) {
      return $http.get(`${API_URL}/divesites/${id}/dives/`);
    }

    function getNearbySlipways(id) {
      return $http.get(`${API_URL}/divesites/${id}/nearby_slipways/`);
    }

    function getOwnProfile() {
      const token = $auth.getToken();
      return $http.get(`${API_URL}/users/me/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    }

    function getStatistics() {
      return $http.get(`${API_URL}/statistics/`);
    }

    // Retrieve slipway list, from cache or by API request
    function getSlipway(id) {
      return $http.get(`${API_URL}/slipways/${id}/`, {
        cache: siteCache,
      });
    }

    function getSlipways() {
      return $http.get(SLIPWAY_LIST_VIEW, {
        cache: siteCache,
      });
    }

    function getUser(id) {
      return $http.get(`${API_URL}/users/${id}/`);
    }

    function getUserDives(id) {
      return $http.get(`${API_URL}/users/${id}/dives/`);
    }

    function getUserDivesites(id) {
      return $http.get(`${API_URL}/users/${id}/divesites/`);
    }

    function getUserMinimal(id) {
      return $http.get(`${API_URL}/users/${id}/minimal/`);
    }

    // Create a new compressor, then invalidate the cache so
    // that the updated list will be reloaded
    function postCompressor(data) {
      const url = COMPRESSOR_LIST_VIEW;
      return $http.post(url, data)
      .then((data) => {
        // Invalidate cache
        siteCache.remove(url);
        return data;
      });
    }

    function postDive(data) {
      return $http.post(`${API_URL}/dives/`, data);
    }

    // Create a new divesite, then invalidate the cache so
    // that the updated list will be reloaded
    function postDivesite(data) {
      const url = DIVESITE_LIST_VIEW;
      return $http.post(url, data)
      .then((data) => {
        // Invalidate cache
        siteCache.remove(url);
        return data;
      });
    }

    // Create a new slipway, then invalidate the cache so
    // that the updated list will be reloaded
    function postSlipway(data) {
      const url = SLIPWAY_LIST_VIEW;
      return $http.post(url, data)
      .then((data) => {
        // Invalidate cache
        siteCache.remove(url);
        return data;
      });
    }

    // Update an existing compressor, then invalidate the cache so
    // that the updated list will be reloaded
    function updateCompressor(id, data) {
      const url = COMPRESSOR_LIST_VIEW;
      return $http.patch(`${API_URL}/compressors/${id}/`, data)
      .then((data) => {
        // Invalidate compressor list cache
        siteCache.remove(url);
        return data;
      });
    }

    function updateDive(id, data) {
      return $http.patch(`${API_URL}/dives/${id}/`, data);
    }

    // Update an existing divesite, then invalidate the cache so
    // that the updated list will be reloaded
    function updateDivesite(id, data) {
      const url = DIVESITE_LIST_VIEW;
      return $http.patch(`${API_URL}/divesites/${id}/`, data)
      .then((data) => {
        // Invalidate divesite list cache
        siteCache.remove(url);
        return data;
      });
    }

    // Update an existing slipway, then invalidate the cache so
    // that the updated list will be reloaded
    function updateSlipway(id, data) {
      const url = SLIPWAY_LIST_VIEW;
      return $http.patch(`${API_URL}/slipways/${id}/`, data)
      .then((data) => {
        // Invalidate slipway list cache
        siteCache.remove(url);
        return data;
      });
    }

    function updateProfile(data) {
      const id = data.id;
      return $http.patch(`${API_URL}/users/${id}/`, data);
    }

    function deleteDive(id) {
      return $http.delete(`${API_URL}/dives/${id}/`);
    }
  }

  dsapiService.$inject = [
    '$auth',
    '$http',
    'API_URL',
    'CacheFactory',
  ];
  angular.module('divesites.apis').factory('dsapi', dsapiService);
})();
