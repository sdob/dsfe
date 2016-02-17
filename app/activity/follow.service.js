(function() {
  'use strict';

  function followService($auth, dsactivity, localStorageService) {

    return {
      followUser,
      userIsFollowing,
    };

    function followUser(otherUser) {
      const userID = localStorageService.get('user');
      if (!userID) {
        return false;
      }

      return dsactivity.followUser(otherUser);
    }

    function userIsFollowing(otherUser) {
      if (!$auth.isAuthenticated()) {
        return false;
      }

      const userID = localStorageService.get('user');
      return dsactivity.getOwnFollows()
      .then((response) => {
        console.log(response.data);
        return response.data.indexOf(otherUser.id) > -1;
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
