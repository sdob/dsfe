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
      // If the cache doesn't have this ID, make the request
      if (cache[id] === undefined) {
        console.log(`userThumbnailCache has nothing for ${id}`);
        console.log('retrieving from API');

        return dsimg.getUserProfileImage(id)
        .then(formatResponse)
        .then((value) => set(id, value));
      } else {
        // If we have something stored, wrap it in a Promise and return it
        return Promise.resolve(cache[id]);
      }

      function formatResponse(response) {
        // Acquire the URL for a 60x60 Cloudinary image
        if (response.data && response.data.public_id) {
          const thumbnailURL = $.cloudinary.url(response.data.public_id, {
            height: 60,
            width: 60,
            crop: 'fill',
            gravity: 'face',
          });
          return thumbnailURL;
        }

        return undefined;
      }

      function retrieveFromApi(id) {
        // Request the user profile image from our API
        return dsimg.getUserProfileImage(id);
      }

    }

    /* Insert or overwrite the cached value */
    function set(id, value) {
      cache[id] = value;
      return value;
    }
  }

  userThumbnailCache.$inject = [
    'dsimg',
    'localStorageService',
  ];
  angular.module('divesites.caching').factory('userThumbnailCache', userThumbnailCache);
})();
