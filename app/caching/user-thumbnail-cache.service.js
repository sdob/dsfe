(function() {
  'use strict';

  function userThumbnailCache(dsimg, localStorageService) {
    const cache = {
    };

    return {
      clear,
      get,
      set,
    };

    /* Remove this value from the cache */
    function clear(id) {
      delete cache[id];
    }

    /*
     * Look for this user ID in the cache keys.
     * If missing then retrieve from DSAPI and cache;
     * otherwise return the cached value
     */
    function get(id) {
      if (cache[id] === undefined) {
        console.log(`userThumbnailCache has nothing for ${id}`);
        // return something
        console.log('retrieving from API');
        return dsimg.getUserProfileImage(id)
        .then((response) => {
          if (response.data && response.data.public_id) {
            const thumbnailURL = $.cloudinary.url(response.data.public_id, {
              height: 60,
              width: 60,
              crop: 'fill',
              gravity: 'face',
            });
            // Add to cache
            set(id, thumbnailURL);
            return thumbnailURL;
          }

          return Promise.resolve(undefined);
        });
      }

      return Promise.resolve(cache[id]);
    }

    /* Insert or overwrite the cached value */
    function set(id, value) {
      cache[id] = value;
    }
  }

  userThumbnailCache.$inject = [
    'dsimg',
    'localStorageService',
  ];
  angular.module('divesites.caching').factory('userThumbnailCache', userThumbnailCache);
})();
