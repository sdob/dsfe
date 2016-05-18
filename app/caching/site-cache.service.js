(function() {
  'use strict';

  /*
   * The siteCacheService should handle most things.
   */
  function siteCacheService(cachingService) {
    // Caches
    const siteDetailCache = cachingService.getOrCreateCache('siteDetailCache');
    const siteListCache = cachingService.getOrCreateCache('siteListCache');

    const siteCache = cachingService.getOrCreateCache('siteCache');

    return {
      siteDetailCache,
      siteListCache,
    };
  }

  siteCacheService.$inject = [
    'cachingService',
  ];
  angular.module('divesites.caching').factory('siteCacheService', siteCacheService);
})();
