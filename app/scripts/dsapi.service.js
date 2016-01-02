(function () {
  'use strict';
  function dsapiService($auth, $http) {
    const API_URL = 'http://localhost:8000';
    return {
      getDivesite: (id) => {
        console.log(`dsapi.getDivesite(${id}`);
        return $http.get(`${API_URL}/divesites/${id}/`);
      },
      getDivesites: () => $http.get(`${API_URL}/divesites/`),
      // TODO: insert auth token into all api requests
      getOwnId: () => {
        console.log('dsapi.getOwnId()');
        return $http.get(`${API_URL}/users/whoami/`, {
        });
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
    };
  }

  dsapiService.$inject = ['$auth', '$http',];
  angular.module('divesites').factory('dsapi', dsapiService);
})();
