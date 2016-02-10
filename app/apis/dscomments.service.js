(function() {
  'use strict';

  function dscommentsService($auth, $http, API_URL) {
    return {
      getDivesiteComments: (id) => {
        return $http.get(`${API_URL}/divesites/${id}/comments/`);
      },

      postDivesiteComment: (data) => {
        return $http.post(`${API_URL}/comments/divesites/`, data);
      },

      updateDivesiteComment: (id, data) => {
        return $http.patch(`${API_URL}/comments/divesites/${id}/`, data);
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
