(function() {
  'use strict';

  /*
   * Service wrapping HTTP calls to the main REST API. Everything returns
   * a Promise.
   */
  function dsapiService($auth, $http, API_URL) {
    return {

      getCompressor: (id) => {
        return $http.get(`${API_URL}/compressors/${id}/`);
      },

      getCompressors: () => {
        return $http.get(`${API_URL}/compressors/`);
      },

      getDive: (id) => {
        return $http.get(`${API_URL}/dives/${id}/`);
      },

      getDivesite: (id) => {
        return $http.get(`${API_URL}/divesites/${id}/`);
      },

      getDivesites: () => {
        return $http.get(`${API_URL}/divesites/`);
      },

      getDivesiteComments: (id) => {
        return $http.get(`${API_URL}/divesites/${id}/comments/`);
      },

      getDivesiteDives: (id) => {
        return $http.get(`${API_URL}/divesites/${id}/dives/`);
      },

      getNearbySlipways: (id) => {
        return $http.get(`${API_URL}/divesites/${id}/nearby_slipways/`);
      },

      getOwnProfile: () => {
        const token = $auth.getToken();
        return $http.get(`${API_URL}/users/me/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      },

      getStatistics: () => {
        return $http.get(`${API_URL}/statistics/`);
      },

      getSlipway: (id) => {
        return $http.get(`${API_URL}/slipways/${id}/`);
      },

      getSlipways: () => {
        return $http.get(`${API_URL}/slipways/`);
      },

      getUser: (id) => {
        return $http.get(`${API_URL}/users/${id}/`);
      },

      getUserDives: (id) => {
        return $http.get(`${API_URL}/users/${id}/dives/`);
      },

      getUserDivesites: (id) => {
        return $http.get(`${API_URL}/users/${id}/divesites/`);
      },

      getUserMinimal: (id) => {
        return $http.get(`${API_URL}/users/${id}/minimal/`);
      },

      /* POST methods */

      postCompressor: (data) => {
        return $http.post(`${API_URL}/compressors/`, data);
      },

      postDive: (data) => {
        return $http.post(`${API_URL}/dives/`, data);
      },

      postDivesite: (data) => {
        return $http.post(`${API_URL}/divesites/`, data);
      },

      postSlipway: (data) => {
        return $http.post(`${API_URL}/slipways/`, data);
      },

      /* UPDATE methods */
      updateCompressor: (id, data) => {
        return $http.patch(`${API_URL}/compressors/${id}/`, data);
      },

      updateDive: (id, data) => {
        return $http.patch(`${API_URL}/dives/${id}/`, data);
      },

      updateDivesite: (id, data) => {
        return $http.patch(`${API_URL}/divesites/${id}/`, data);
      },

      updateSlipway: (id, data) => {
        return $http.patch(`${API_URL}/slipways/${id}/`, data);
      },

      updateProfile: (data) => {
        const id = data.id;
        return $http.patch(`${API_URL}/users/${id}/`, data);
      },

      /* DELETE methods */

      deleteDive: (id) => {
        return $http.delete(`${API_URL}/dives/${id}/`);
      },

    };
  }

  dsapiService.$inject = [
    '$auth',
    '$http',
    'API_URL',
  ];
  angular.module('divesites.apis').factory('dsapi', dsapiService);
})();
