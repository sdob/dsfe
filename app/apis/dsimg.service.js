(function() {
  'use strict';

  function dsimgService($http, API_URL) {
    return {
      API_URL,
      deleteUserProfileImage,
      getSiteHeaderImage,
      getSiteImages,
      getUserImages,
      getUserProfileImage,
    };

    function deleteUserProfileImage(id) {
      return $http.delete(`${API_URL}/users/${id}/profile_image/`);
    }

    function getSiteHeaderImage(site) {
      return $http.get(`${API_URL}/${site.type}s/${site.id}/header/`);
    }

    function getSiteImages(site) {
      return $http.get(`${API_URL}/${site.type}s/${site.id}/images/`);
    }

    function getUserImages(id) {
      return $http.get(`${API_URL}/users/${id}/images/`);
    }

    function getUserProfileImage(id) {
      return $http.get(`${API_URL}/users/${id}/profile_image/`);
    }
  }

  dsimgService.$inject = [
    '$http',
    'API_URL',
  ];
  angular.module('divesites.apis').factory('dsimg', dsimgService);
})();
