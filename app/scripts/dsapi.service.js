(function () {
  'use strict';
  function dsapiService($auth, $http, API_URL) {
    return {
      getCompressors: () => {
        return $http.get(`${API_URL}/compressors/`);
      },
      getDivesite: (id) => {
        console.log(`dsapi.getDivesite(${id}`);
        return $http.get(`${API_URL}/divesites/${id}/`);
      },
      getDivesites: () => $http.get(`${API_URL}/divesites/`),
      getNearbySlipways: (id) => {
        return $http.get(`${API_URL}/divesites/${id}/nearby_slipways/`);
      },
      getOwnProfile: () => {
        console.log('dsapi.getOwnProfile()');
        const token = $auth.getToken();
        return $http.get(`${API_URL}/users/me/`, {
          headers: {
            Authorization: `Token ${token}`,
          }
        });
      },
      getSlipway: (id) => {
        return $http.get(`${API_URL}/slipways/${id}/`);
      },
      getSlipways: () => {
        return $http.get(`${API_URL}/slipways/`);
      },
      getUserDives: (id) => $http.get(`${API_URL}/users/${id}/dives/`),
      getUserDivesites: (id) => $http.get(`${API_URL}/users/${id}/divesites/`),
      getUserRecentActivity: (id) => $http.get(`${API_URL}/users/${id}/recent_activity/`),
      getUser: (id) => {
        console.log(`dsapi.getUser(${id}`);
        return $http.get(`${API_URL}/users/${id}/`);
      },
      /* POST methods */
      postDive: (data) => {
        console.log(`dsapi.postDive()`);
        console.log(data);
        return $http.post(`${API_URL}/dives/`, data);
      },
      postDivesite: (data) => {
        console.log(`dsapi.postDivesite()`);
        console.log(data);
        return $http.post(`${API_URL}/divesites/`, data);
      },
      postSlipway: (data) => {
        console.log(`dsapi.postSlipway()`);
        console.log(data);
        return $http.post(`${API_URL}/slipways/`, data);
      },
      /* UPDATE methods */
      updateDivesite: (id, data) => {
        console.log(`dsapi.UpdateDivesite()`);
        console.log(data);
        return $http.patch(`${API_URL}/divesites/${id}/`, data);
      },
    };
  }

  dsapiService.$inject = ['$auth', '$http', 'API_URL',];
  angular.module('divesites').factory('dsapi', dsapiService);
})();
