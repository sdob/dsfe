(function() {
  'use strict';

  function dscommentsService($auth, $http, API_URL) {
    return {

      /* Divesite comments */

      getDivesiteComments: (id) => {
        return $http.get(`${API_URL}/divesites/${id}/comments/`);
      },

      postDivesiteComment: (data) => {
        return $http.post(`${API_URL}/comments/divesites/`, data);
      },

      updateDivesiteComment: (id, data) => {
        return $http.patch(`${API_URL}/comments/divesites/${id}/`, data);
      },

      deleteDivesiteComment: (id) => {
        return $http.delete(`${API_URL}/comments/divesites/${id}/`);
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
    };
  }

  dscommentsService.$inject = [
    '$auth',
    '$http',
    'API_URL',
  ];
  angular.module('divesites.apis').factory('dscomments', dscommentsService);
})();
