(function () {
  'use strict';
  function dsimgService($http, IMG_API_URL) {
    return {
      IMG_API_URL,
      uploadImage: (divesiteID, imgFile) => {
        console.log(`uploading to ${IMG_API_URL}`);
        return $http.post(`${IMG_API_URL}/divesites/${divesiteID}/`);
      },
      getDivesiteImages: (divesiteID) => {
        console.log(`dsimg.getDivesiteImages(${divesiteID})`);
        return $http.get(`${IMG_API_URL}/divesites/${divesiteID}/`);
      },
      getUserProfileImage: (userID) => {
        console.log(`dsimg.getUserProfileImage(${userID})`);
        return $http.get(`${IMG_API_URL}/users/${userID}/profile`);
      },
    };
  }

  dsimgService.$inject = [
    '$http',
    'IMG_API_URL',
  ];
  angular.module('divesites').factory('dsimg', dsimgService);
})();
