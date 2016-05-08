(function() {
  'use strict';

  /*
   * Service wrapping HTTP calls to the main REST API. Everything returns
   * a Promise. Since refactoring, this service collects and exposes the
   * methods from smaller, feature-specific services.
   */
  function dsapiService($auth, $http, API_URL, divesApi, placesApi) {

    const {
      deleteDive,
      getDive,
      getDivesiteDives,
      postDive,
      updateDive,
    } = divesApi;

    const {
      getCompressor,
      getCompressors,
      getDivesite,
      getDivesites,
      getSlipway,
      getSlipways,
      postCompressor,
      postDivesite,
      postSlipway,
      updateCompressor,
      updateDivesite,
      updateSlipway,
    } = placesApi;

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

    function getDivesiteComments(id) {
      return $http.get(`${API_URL}/divesites/${id}/comments/`);
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

    function updateProfile(data) {
      const id = data.id;
      return $http.patch(`${API_URL}/users/${id}/`, data);
    }
  }

  dsapiService.$inject = [
    '$auth',
    '$http',
    'API_URL',
    'divesApi',
    'placesApi',
  ];
  angular.module('divesites.apis').factory('dsapi', dsapiService);
})();
