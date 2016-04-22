(function() {
  'use strict';

  function followService($auth, dsactivity, localStorageService) {

    return {
      followUser,
      getOwnFollows,
      getSuggestions,
      unfollowUser,
      userIsFollowing,
    };

    function followUser(otherUser) {
      const userID = localStorageService.get('user');
      if (!userID) {
        return false;
      }

      return dsactivity.followUser(otherUser.id);
    }

    function getOwnFollows() {
      return dsactivity.getOwnFollows();
    }

    function getSuggestions() {
      return dsactivity.getOwnFollowSuggestions()
      .then((response) => {
        return response.data;
      });
    }

    function unfollowUser(otherUser) {
      return dsactivity.unfollowUser(otherUser.id);
    }

    function userIsFollowing(otherUser) {
      if (!$auth.isAuthenticated()) {
        return false;
      }

      const userID = localStorageService.get('user');
      return dsactivity.getOwnFollows()
      .then((response) => {
        const ids = response.data.map(u => u.id);
        return ids.indexOf(otherUser.id) > -1;
      });
    }
  }

  followService.$inject = [
    '$auth',
    'dsactivity',
    'localStorageService',
  ];

  angular.module('divesites.activity').factory('followService', followService);
})();
