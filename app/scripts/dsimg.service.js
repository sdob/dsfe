(function() {
  'use strict';
  function dsimgService($http, IMG_API_URL) {
    return {
      IMG_API_URL,

      /* GET methods */
      getDivesiteImages: (divesiteID) => {
        return $http.get(`${IMG_API_URL}/divesites/${divesiteID}/`);
      },

      getDivesiteHeaderImage: (divesiteID) => {
        return $http.get(`${IMG_API_URL}/divesites/${divesiteID}/header`);
      },

      getUserProfileImage: (userID) => {
        return $http.get(`${IMG_API_URL}/users/${userID}/profile`);
      },

      /* POST methods */
      uploadDivesiteImage: (divesiteID, imgFile) => {
        return $http.post(`${IMG_API_URL}/divesites/${divesiteID}/`);
      },

      /* DELETE methods */
      deleteDivesiteHeaderImage: (divesiteID) => {
        return $http.delete(`${IMG_API_URL}/divesites/${divesiteID}/header`);
      },

    };
  }

  dsimgService.$inject = [
    '$http',
    'IMG_API_URL',
  ];
  angular.module('divesites').factory('dsimg', dsimgService);
})();
