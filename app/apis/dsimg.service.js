(function() {
  'use strict';

  /*
   * Service wrapping HTTP calls to the back-end image server.
   */
  function dsimgService($http, IMG_API_URL) {
    return {
      IMG_API_URL,

      /* Generic site image retrieval stuff */
      getSiteImages: (site) => {
        return $http.get(`${IMG_API_URL}/${site.type}s/${site.id}/`);
      },

      /* Upload, retrieve, and delete compressor images */

      getCompressorImages: (compressorID) => {
        return $http.get(`${IMG_API_URL}/compressors/${compressorID}/`);
      },

      uploadCompressorImage: (compressorID, imgFile) => {
        return $http.post(`${IMG_API_URL}/compressors/${compressorID}/`);
      },

      deleteCompressorImage: (id) => {
        return $http.delete(`${IMG_API_URL}/compressor-images/${id}`);
      },

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

      /* Upload, retrieve, and delete slipway images */

      getSlipwayImages: (slipwayID) => {
        return $http.get(`${IMG_API_URL}/slipways/${slipwayID}/`);
      },

      uploadSlipwayImage: (slipwayID, imgFile) => {
        return $http.post(`${IMG_API_URL}/slipways/${slipwayID}/`);
      },

      deleteSlipwayImage: (id) => {
        return $http.delete(`${IMG_API_URL}/slipway-images/${id}`);
      },

      /*
       * Retrieve and delete divesite header images. Uploading is performed
       * by ng-file-upload.
      */

      getDivesiteHeaderImage: (divesiteID) => {
        return $http.get(`${IMG_API_URL}/divesites/${divesiteID}/header`);
      },

      deleteDivesiteHeaderImage: (divesiteID) => {
        return $http.delete(`${IMG_API_URL}/divesites/${divesiteID}/header`);
      },

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

      /* Retrieve user images */

      getUserImages: (userID) => {
        return $http.get(`${IMG_API_URL}/users/${userID}/images`);
      },
    };
  }

  dsimgService.$inject = [
    '$http',
    'IMG_API_URL',
  ];
  angular.module('divesites.apis').factory('dsimg', dsimgService);
})();
