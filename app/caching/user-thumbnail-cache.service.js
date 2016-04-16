(function() {
  'use strict';

  /*
   * This is a very basic storehouse for user profile images. It'll prevent
   * the site from making a call to DSAPI every time the user selects a marker
   * (since we want to show user thumbnails in the info card header), but
   * at the moment there are two obvious issues:
   *
   * 1. The cache is unlimited in size. This is unlikely to become an enormous problem
   * since we're just storing string->string k-v pairs, but it might be sensible to
   * limit the cache size just in case.
   *
   * 2. There's no built-in way to invalidate the cache; we may need to have a cache
   * controller that listens for updates. Right now, the only profile image that creates
   * a listenable event is the user's own. In theory you could have divesit.es open for
   * months and fail to see user profile image changes.
   *
   */
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
