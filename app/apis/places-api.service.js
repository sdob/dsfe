(function() {
  'use strict';

  function placesApi($http, API_URL, CacheFactory, cachingService) {

    const COMPRESSOR_LIST_VIEW = `${API_URL}/compressors/`;
    const DIVESITE_LIST_VIEW = `${API_URL}/divesites/`;
    const SLIPWAY_LIST_VIEW = `${API_URL}/slipways/`;

    const siteDetailCache = cachingService.getOrCreateCache('siteDetailCache');
    const siteListCache = cachingService.getOrCreateCache('siteListCache');

    return {
      getCompressor,
      getCompressors,
      getDivesite,
      getDivesites,
      getSlipway,
      getSlipways,
      postCompressor,
      postDivesite,
      postSlipway,
      updateCompressor,
      updateDivesite,
      updateSlipway,
    };

    function getCompressor(id) {
      const url = `${COMPRESSOR_LIST_VIEW}/${id}/`;
      return $http.get(url);
    }

    // Retrieve compressor list, from cache or by API request
    function getCompressors() {
      return $http.get(COMPRESSOR_LIST_VIEW, {
        cache: siteListCache,
      });
    }

    function getDivesite(id) {
      return $http.get(`${API_URL}/divesites/${id}/`);
    }

    // Retrieve divesite list, from cache or by API request
    function getDivesites() {
      return $http.get(DIVESITE_LIST_VIEW, {
        cache: siteListCache,
      });
    }

    // Retrieve slipway list, from cache or by API request
    function getSlipway(id) {
      return $http.get(`${API_URL}/slipways/${id}/`, {
        cache: siteListCache,
      });
    }

    function getSlipways() {
      return $http.get(SLIPWAY_LIST_VIEW, {
        cache: siteListCache,
      });
    }

    // Create a new compressor, then invalidate the cache so
    // that the updated list will be reloaded
    function postCompressor(data) {
      const url = COMPRESSOR_LIST_VIEW;
      return $http.post(url, data)
      .then((data) => {
        // Invalidate cache
        siteListCache.remove(url);
        return data;
      });
    }

    // Create a new divesite, then invalidate the cache so
    // that the updated list will be reloaded
    function postDivesite(data) {
      const url = DIVESITE_LIST_VIEW;
      return $http.post(url, data)
      .then((data) => {
        // Invalidate cache
        siteListCache.remove(url);
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
        siteListCache.remove(url);
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
        siteListCache.remove(url);
        return data;
      });
    }

    // Update an existing divesite, then invalidate the cache so
    // that the updated list will be reloaded
    function updateDivesite(id, data) {
      const url = DIVESITE_LIST_VIEW;
      return $http.patch(`${API_URL}/divesites/${id}/`, data)
      .then((data) => {
        // Invalidate divesite list cache
        siteListCache.remove(url);
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
        siteListCache.remove(url);
        return data;
      });
    }
  }

  placesApi.$inject = [
    '$http',
    'API_URL',
    'CacheFactory',
    'cachingService',
  ];
  angular.module('divesites.apis').factory('placesApi', placesApi);
})();
