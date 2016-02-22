(function() {
  'use strict';

  function dscommentsService($auth, $http, API_URL) {
    return {

      /* Generic comment functions */

      getSiteComments: (site) => {
        return $http.get(`${API_URL}/${site.type}s/${site.id}/comments/`);
      },

      postSiteComment: (site, data) => {
        return $http.post(`${API_URL}/comments/${site.type}s/`, data);
      },

      updateSiteComment: (site, data) => {
        return $http.patch(`${API_URL}/comments/${site.type}s/${site.id}/`, data);
      },

      deleteSiteComment: (id, site) => {
        return $http.delete(`${API_URL}/comments/${site.type}s/${id}/`);
      },

      /* Divesite comments */

      getDivesiteComments: (id) => {
        return $http.get(`${API_URL}/divesites/${id}/comments/`);
      },

      /* Slipway comments */

      getSlipwayComments: (id) => {
        return $http.get(`${API_URL}/slipways/${id}/comments/`);
      },

      postSlipwayComment: (data) => {
        return $http.post(`${API_URL}/comments/slipways/`, data);
      },

      updateSlipwayComment: (id, data) => {
        return $http.patch(`${API_URL}/comments/slipways/${id}/`, data);
      },

      deleteSlipwayComment: (id) => {
        return $http.delete(`${API_URL}/comments/slipways/${id}/`);
      },

      /* Compressor comments */

      getCompressorComments: (id) => {
        return $http.get(`${API_URL}/compressors/${id}/comments/`);
      },

      postCompressorComment: (data) => {
        return $http.post(`${API_URL}/comments/compressors/`, data);
      },

      updateCompressorComment: (id, data) => {
        return $http.patch(`${API_URL}/comments/compressors/${id}/`, data);
      },

      deleteCompressorComment: (id) => {
        return $http.delete(`${API_URL}/comments/compressors/${id}/`);
      },
    };
  }

  dscommentsService.$inject = [
    '$auth',
    '$http',
    'API_URL',
  ];
  angular.module('divesites.apis').factory('dscomments', dscommentsService);
})();
