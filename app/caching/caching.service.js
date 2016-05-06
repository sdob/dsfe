(function() {
  'use strict';

  function cachingService(CacheFactory) {
    return {
      getOrCreateCache,
    };

    function getOrCreateCache(name) {
      const existingCache = CacheFactory.get(name);
      if (existingCache) {
        return existingCache;
      }

      return CacheFactory(name);
    }
  }

  cachingService.$inject = [
    'CacheFactory',
  ];
  angular.module('divesites.caching').factory('cachingService', cachingService);
})();
