(function() {
  'use strict';

  function placesApi($http, $q, API_URL, CacheFactory, cachingService) {

    // URL constants
    const COMPRESSOR_LIST_VIEW = `${API_URL}/compressors/`;
    const DIVESITE_LIST_VIEW = `${API_URL}/divesites/`;
    const SLIPWAY_LIST_VIEW = `${API_URL}/slipways/`;

    // Caches
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
      const url = `${COMPRESSOR_LIST_VIEW}${id}/`;
      return $http.get(url, {
        cache: siteDetailCache,
      });
    }

    // Retrieve compressor list, from cache or by API request
    function getCompressors() {
      return $http.get(COMPRESSOR_LIST_VIEW, {
        cache: siteListCache,
      });
    }

    // Retrieve divesite detail, from cache or by API request
    function getDivesite(id) {
      const deferred = $q.defer();
      const start = new Date().getTime();
      const url = `${DIVESITE_LIST_VIEW}${id}/`;
      if (siteDetailCache.get(id)) {
        console.log(siteDetailCache.get(id));
        deferred.resolve(siteDetailCache.get(id));
      } else {
        $http.get(url)
        .then((data) => {
          console.log(`retrieved divesite in ${new Date().getTime() - start} ms`);
          siteDetailCache.put(id, data);
          deferred.resolve(data);
        });
      }

      return deferred.promise;
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
      const url = `${API_URL}/divesites/${id}/`;
      return $http.patch(url, data)
      .then((data) => {
        // Invalidate divesite list cache
        siteListCache.remove(DIVESITE_LIST_VIEW);
        // Invalidate divesite detail cache
        siteDetailCache.remove(url);
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
    '$q',
    'API_URL',
    'CacheFactory',
    'cachingService',
  ];
  angular.module('divesites.apis').factory('placesApi', placesApi);
})();
