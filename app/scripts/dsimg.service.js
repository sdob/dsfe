(function () {
  'use strict';
  function dsimgService($http, IMG_API_URL) {
    return {
      IMG_API_URL,

      /* GET methods */
      getDivesiteImages: (divesiteID) => {
        console.log(`dsimg.getDivesiteImages(${divesiteID})`);
        return $http.get(`${IMG_API_URL}/divesites/${divesiteID}/`);
      },
      getDivesiteHeaderImage: (divesiteID) => {
        console.log(`dsimg.getDivesiteHeaderImage(${divesiteID})`);
        return $http.get(`${IMG_API_URL}/divesites/${divesiteID}/header`);
      },
      getUserProfileImage: (userID) => {
        console.log(`dsimg.getUserProfileImage(${userID})`);
        return $http.get(`${IMG_API_URL}/users/${userID}/profile`);
      },

      /* POST methods */
      uploadDivesiteImage: (divesiteID, imgFile) => {
        console.log(`uploading to ${IMG_API_URL}`);
        return $http.post(`${IMG_API_URL}/divesites/${divesiteID}/`);
      },

      /* DELETE methods */
      deleteDivesiteHeaderImage: (divesiteID) => {
        console.log(`dsimg.deleteDivesiteHeaderImage(${divesiteID})`);
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
