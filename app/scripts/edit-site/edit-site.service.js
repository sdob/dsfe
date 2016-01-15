(function () {
  'use strict';
  function editSiteService(dsapi) {
    return {
      selectSubmissionApiCall: (id) => {
        // If passed an ID, then we're updating an existing site;
        // otherwise, we're adding a new one
        if (id !== undefined) {
          return (data) => dsapi.updateDivesite(id, data);
        }
        return (data) => dsapi.postDivesite(data);
      },
    };
  }

  editSiteService.$inject = [
    'dsapi',
  ];
  angular.module('divesites.editSite').factory('editSiteService', editSiteService);
})();
