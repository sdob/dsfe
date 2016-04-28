(function() {
  'use strict';

  /*
   * Service wrapping HTTP calls to the main REST API. Everything returns
   * a Promise.
   */
  function dsapiService($auth, $http, API_URL) {

    return {

      /* DELETE methods */
      deleteDive,

      /* GET methods */
      getCompressor,
      getCompressors,
      getDive,
      getDivesite,
      getDivesites,
      getDivesiteComments,
      getDivesiteDives,
      getNearbySlipways,
      getOwnProfile,
      getStatistics,
      getSlipway,
      getSlipways,
      getUser,
      getUserDives,
      getUserDivesites,
      getUserMinimal,

      /* POST methods */
      postCompressor,
      postDive,
      postDivesite,
      postSlipway,

      /* UPDATE methods */
      updateCompressor,
      updateDive,
      updateDivesite,
      updateSlipway,
      updateProfile,

    };

    function getCompressor(id) {
      return $http.get(`${API_URL}/compressors/${id}/`);
    }

    function getCompressors() {
      return $http.get(`${API_URL}/compressors/`);
    }

    function getDive(id) {
      return $http.get(`${API_URL}/dives/${id}/`);
    }

    function getDivesite(id) {
      return $http.get(`${API_URL}/divesites/${id}/`);
    }

    function getDivesites() {
      return $http.get(`${API_URL}/divesites/`);
    }

    function getDivesiteComments(id) {
      return $http.get(`${API_URL}/divesites/${id}/comments/`);
    }

    function getDivesiteDives(id) {
      return $http.get(`${API_URL}/divesites/${id}/dives/`);
    }

    function getNearbySlipways(id) {
      return $http.get(`${API_URL}/divesites/${id}/nearby_slipways/`);
    }

    function getOwnProfile() {
      const token = $auth.getToken();
      return $http.get(`${API_URL}/users/me/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    }

    function getStatistics() {
      return $http.get(`${API_URL}/statistics/`);
    }

    function getSlipway(id) {
      return $http.get(`${API_URL}/slipways/${id}/`);
    }

    function getSlipways() {
      return $http.get(`${API_URL}/slipways/`);
    }

    function getUser(id) {
      return $http.get(`${API_URL}/users/${id}/`);
    }

    function getUserDives(id) {
      return $http.get(`${API_URL}/users/${id}/dives/`);
    }

    function getUserDivesites(id) {
      return $http.get(`${API_URL}/users/${id}/divesites/`);
    }

    function getUserMinimal(id) {
      return $http.get(`${API_URL}/users/${id}/minimal/`);
    }

    function postCompressor(data) {
      return $http.post(`${API_URL}/compressors/`, data);
    }

    function postDive(data) {
      return $http.post(`${API_URL}/dives/`, data);
    }

    function postDivesite(data) {
      return $http.post(`${API_URL}/divesites/`, data);
    }

    function postSlipway(data) {
      return $http.post(`${API_URL}/slipways/`, data);
    }

    function updateCompressor(id, data) {
      return $http.patch(`${API_URL}/compressors/${id}/`, data);
    }

    function updateDive(id, data) {
      return $http.patch(`${API_URL}/dives/${id}/`, data);
    }

    function updateDivesite(id, data) {
      return $http.patch(`${API_URL}/divesites/${id}/`, data);
    }

    function updateSlipway(data) {
      return $http.patch(`${API_URL}/slipways/${id}/`, data);
    }

    function updateProfile(data) {
      const id = data.id;
      return $http.patch(`${API_URL}/users/${id}/`, data);
    }

    function deleteDive(id) {
      return $http.delete(`${API_URL}/dives/${id}/`);
    }
  }

  dsapiService.$inject = [
    '$auth',
    '$http',
    'API_URL',
  ];
  angular.module('divesites.apis').factory('dsapi', dsapiService);
})();
