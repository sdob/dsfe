(function() {
  'use strict';

  function dsactivityService($http, API_URL, cachingService, localStorageService) {

    const followCache = cachingService.getOrCreateCache('followCache');

    const OWN_FOLLOWERS_LIST = `${API_URL}/users/my_followers/`;
    const OWN_FOLLOWS_LIST = `${API_URL}/users/my_follows/`;

    return {
      followUser,
      getOwnActivity,
      getOwnFollowSuggestions,
      getOwnFollowers,
      getOwnFollows,
      getUserActivity,
      getUserFollowers,
      getUserFollows,
      unfollowUser,
    };

    function followUser(otherUserID) {
      return $http.post(`${API_URL}/users/${otherUserID}/follow/`)
      .then((response) => {
        // If we have succeeded, it means that we're definitely signed in,
        // so we can access the signed-in user's ID
        const userID = localStorageService.get('user');
        // Invalidate cache
        followCache.remove(followListURL(userID));
        followCache.remove(followerListURL(otherUserID));
        followCache.remove(OWN_FOLLOWS_LIST);
        return response;
      });
    }

    // Given a user ID, return the URL for retrieving the list of users they follow
    function followListURL(id) {
      return `${API_URL}/users/${id}/follows/`;
    }

    // Given a user ID, return the URL for retrieving the list of users following them
    function followerListURL(id) {
      return `${API_URL}/users/${id}/followers/`;
    }

    function getOwnActivity(offset) {
      return $http.get(`${API_URL}/users/my_feed/?offset=${offset}`);
    }

    function getOwnFollowSuggestions() {
      return $http.get(`${API_URL}/users/my_suggestions/`);
    }

    function getOwnFollowers() {
      return $http.get(OWN_FOLLOWERS_LIST, {
        cache: followCache,
      });
    }

    function getOwnFollows() {
      return $http.get(OWN_FOLLOWS_LIST, {
        cache: followCache,
      });
    }

    function getUserActivity(id, offset) {
      return $http.get(`${API_URL}/users/${id}/feed/?offset=${offset}`);
    }

    function getUserFollowers(id) {
      return $http.get(followerListURL(id), {
        cache: followCache,
      });
    }

    function getUserFollows(id) {
      return $http.get(followListURL(id), {
        cache: followCache,
      });
    }

    function unfollowUser(otherUserID) {
      return $http.post(`${API_URL}/users/${otherUserID}/unfollow/`)
      .then((response) => {
        // If we have succeeded, it means that we're definitely signed in,
        // so we can access the signed-in user's ID
        const userID = localStorageService.get('user');
        // Invalidate caches
        followCache.remove(followListURL(userID));
        followCache.remove(followerListURL(otherUserID));
        followCache.remove(OWN_FOLLOWS_LIST);
        return response;
      });
    }
  }

  dsactivityService.$inject = [
    '$http',
    'API_URL',
    'cachingService',
    'localStorageService',
  ];
  angular.module('divesites.apis').factory('dsactivity', dsactivityService);
})();
