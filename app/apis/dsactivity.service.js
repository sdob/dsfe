(function() {
  'use strict';

  function dsactivityService($http, API_URL) {
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
      return $http.post(`${API_URL}/users/${otherUserID}/follow/`);
    }

    function getOwnActivity(offset) {
      return $http.get(`${API_URL}/users/my_feed/?offset=${offset}`);
    }

    function getOwnFollowSuggestions() {
      return $http.get(`${API_URL}/users/my_suggestions/`);
    }

    function getOwnFollowers() {
      return $http.get(`${API_URL}/users/my_followers/`);
    }

    function getOwnFollows() {
      return $http.get(`${API_URL}/users/my_follows/`);
    }

    function getUserActivity(id, offset) {
      return $http.get(`${API_URL}/users/${id}/feed/?offset=${offset}`);
    }

    function getUserFollowers(id) {
      return $http.get(`${API_URL}/users/${id}/followers/`);
    }

    function getUserFollows(id) {
      return $http.get(`${API_URL}/users/${id}/follows/`);
    }

    function unfollowUser(otherUserID) {
      return $http.post(`${API_URL}/users/${otherUserID}/unfollow/`);
    }
  }

  dsactivityService.$inject = [
    '$http',
    'API_URL',
  ];
  angular.module('divesites.apis').factory('dsactivity', dsactivityService);
})();
