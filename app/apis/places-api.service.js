(function() {
  'use strict';

  function placesApi($http, $q, API_URL,  siteCacheService) {

    const { siteDetailCache, siteListCache } = siteCacheService;

    // URL constants
    const COMPRESSOR_LIST_VIEW = `${API_URL}/compressors/`;
    const DIVESITE_LIST_VIEW = `${API_URL}/divesites/`;
    const SLIPWAY_LIST_VIEW = `${API_URL}/slipways/`;

    const SITE_LIST_VIEWS = {
      compressor: COMPRESSOR_LIST_VIEW,
      divesite: DIVESITE_LIST_VIEW,
      slipway: SLIPWAY_LIST_VIEW,
    };

    const SITE_DETAIL_VIEWS = {
      compressor: (id) => `${COMPRESSOR_LIST_VIEW}${id}/`,
      divesite: (id) => `${DIVESITE_LIST_VIEW}${id}/`,
      slipway: (id) => `${SLIPWAY_LIST_VIEW}${id}/`,
    };

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

    function addToListCache(response, type) {
      response.data.forEach((site) => {
        const cachedData = siteListCache.get(site.id) || { type };
        siteListCache.put(site.id, Object.assign(cachedData, site));
      });
      return response;
    }

    function getCompressor(id) {
      return retrieveOrRequest(id, 'compressor');
    }

    // Retrieve compressor list
    function getCompressors() {
      return $http.get(COMPRESSOR_LIST_VIEW)
      .then(response => addToListCache(response, 'compressor'));
    }

    // Retrieve divesite detail, from cache or by API request
    function getDivesite(id) {
      return retrieveOrRequest(id, 'divesite');
    }

    // Retrieve divesite list
    function getDivesites() {
      return $http.get(DIVESITE_LIST_VIEW)
      .then(response => addToListCache(response, 'divesite'));
    }

    // Retrieve slipway detail, from cache or by API request
    function getSlipway(id) {
      return retrieveOrRequest(id, 'slipway');
    }

    // Retrieve slipway list
    function getSlipways() {
      return $http.get(SLIPWAY_LIST_VIEW)
      .then(response => addToListCache(response, 'slipway'));
    }

    function patchAndClearCache(id, type, data) {
      const url = SITE_DETAIL_VIEWS[type](id);
      return $http.patch(url, data)
      .then((response) => {
        const data = response.data;
        // Invalidate the list of sites of this type
        siteListCache.remove(SITE_LIST_VIEWS[type]);
        // Replace the site-detail cache entry for this site
        siteDetailCache.remove(id);
        // siteDetailCache.put(id, data);
        return data;
      });
    }

    // Create a new site of type 'type', then clear the cache for
    // that type
    function postAndClearCache(type, data) {
      const url = SITE_LIST_VIEWS[type];
      return $http.post(url, data)
      .then((response) => {
        siteListCache.remove(url);
        return response.data;
      });
    }

    function postCompressor(data) {
      return postAndClearCache('compressor', data);
    }

    function postDivesite(data) {
      return postAndClearCache('divesite', data);
    }

    function postSlipway(data) {
      return postAndClearCache('slipway', data);
    }

    // Look for a site with UUID 'id' in the site detail cache. If it
    // exists, return it immediately; otherwise, make an API request
    // and cache the returned data
    function retrieveOrRequest(id, type) {
      const deferred = $q.defer();
      if (siteDetailCache.get(id)) {
        deferred.resolve(siteDetailCache.get(id));
      } else {
        const url = SITE_DETAIL_VIEWS[type](id);
        $http.get(url)
        .then((response) => {
          siteDetailCache.put(id, response.data);
          deferred.resolve(response.data);
        });
      }

      return deferred.promise;
    }

    // Update an existing compressor, then invalidate the cache so
    // that the updated list will be reloaded
    function updateCompressor(id, data) {
      return patchAndClearCache(id, 'compressor', data);
    }

    // Update an existing divesite, then invalidate the cache so
    // that the updated list will be reloaded
    function updateDivesite(id, data) {
      return patchAndClearCache(id, 'divesite', data);
    }

    // Update an existing slipway, then invalidate the cache so
    // that the updated list will be reloaded
    function updateSlipway(id, data) {
      return patchAndClearCache(id, 'slipway', data);
    }

    function unpackResponseData(response) {
      return response.data;
    }
  }

  placesApi.$inject = [
    '$http',
    '$q',
    'API_URL',
    'siteCacheService',
  ];
  angular.module('divesites.apis').factory('placesApi', placesApi);
})();
