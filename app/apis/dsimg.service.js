(function() {
  'use strict';

  function dsimgService($http, API_URL) {

    /* These are potentially subject to change if there's a
     * major rewrite of the API.
     */
    const CONTENT_TYPES = {
      8: 'divesite',
      10: 'compressor',
      11: 'slipway',
    };

    return {
      API_URL,
      CONTENT_TYPES,
      clearSiteHeaderImage,
      deleteSiteImage,
      deleteUserProfileImage,
      getSiteHeaderImage,
      getSiteImages,
      getUserImages,
      getUserProfileImage,
      setSiteHeaderImage,
    };

    function clearSiteHeaderImage(site) {
      return $http.delete(`${API_URL}/${site.type}s/${site.id}/header_image/`);
    }

    function deleteUserProfileImage(id) {
      return $http.delete(`${API_URL}/users/${id}/profile_image/`);
    }

    function getSiteHeaderImage(site) {
      return $http.get(`${API_URL}/${site.type}s/${site.id}/header_image/`);
    }

    function deleteSiteImage(site, id) {
      return $http.delete(`${API_URL}/${site.type}s/${site.id}/images/${id}/`);
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

    function setSiteHeaderImage(site, id) {
      return $http.post(`${API_URL}/${site.type}s/${site.id}/header_image/`, { id });
    }
  }

  dsimgService.$inject = [
    '$http',
    'API_URL',
  ];
  angular.module('divesites.apis').factory('dsimg', dsimgService);
})();
