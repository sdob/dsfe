(function() {
  'use strict';
  function dsimgService($http, IMG_API_URL) {
    return {
      IMG_API_URL,

      /* Upload, retrieve, and delete divesite images */

      getDivesiteImages: (divesiteID) => {
        return $http.get(`${IMG_API_URL}/divesites/${divesiteID}/`);
      },

      uploadDivesiteImage: (divesiteID, imgFile) => {
        return $http.post(`${IMG_API_URL}/divesites/${divesiteID}/`);
      },

      deleteDivesiteImage: (id) => {
        return $http.delete(`${IMG_API_URL}/divesite-images/${id}`);
      },

      /* Upload, retrieve, and delete divesite header images */

      getDivesiteHeaderImage: (divesiteID) => {
        return $http.get(`${IMG_API_URL}/divesites/${divesiteID}/header`);
      },

      deleteDivesiteHeaderImage: (divesiteID) => {
        return $http.delete(`${IMG_API_URL}/divesites/${divesiteID}/header`);
      },

      // TODO: upload divesite header image

      /* Upload, retrieve, and delete profile images */

      getUserProfileImage: (userID) => {
        return $http.get(`${IMG_API_URL}/users/${userID}/profile_image`);
      },

      uploadUserProfileImage: (userID, imgFile) => {
        return $http.post(`${IMG_API_URL}/profile_image`);
      },

      deleteProfileImage: () => {
        return $http.delete(`${IMG_API_URL}/profile_image/`);
      },
    };
  }

  dsimgService.$inject = [
    '$http',
    'IMG_API_URL',
  ];
  angular.module('divesites.apis').factory('dsimg', dsimgService);
})();
