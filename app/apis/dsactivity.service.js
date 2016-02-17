(function() {
  'use strict';

  function dsactivityService($http, API_URL) {
    return {
      followUser,
      getOwnActivity,
      getOwnFollows,
      getUserActivity,
      unfollowUser,
    };

    function followUser(otherUserID) {
      return $http.post(`${API_URL}/users/${otherUserID}/follow/`);
    }

    function getOwnActivity(offset) {
      return $http.get(`${API_URL}/users/my_feed/?offset=${offset}`);
    }

    function getOwnFollows() {
      return $http.get(`${API_URL}/users/my_follows/`);
    }

    function getUserActivity(id, offset) {
      return $http.get(`${API_URL}/users/${id}/feed/?offset=${offset}`);
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
