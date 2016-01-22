(function() {
  'use strict';
  function editSiteService($uibModal, $window, dsapi) {
    return {
      selectSubmissionApiCall,
      summonCancelEditingModal,
    };

    function selectSubmissionApiCall(id) {
      // If passed an ID, then we're updating an existing site;
      // otherwise, we're adding a new one
      if (id !== undefined) {
        return (data) => dsapi.updateDivesite(id, data);
      }

      return (data) => dsapi.postDivesite(data);
    }

    function summonCancelEditingModal(form) {
      // If the form has been edited, then confirm that the user
      // is OK with losing their changes
      if (form.$dirty) {
        const modalInstance = $uibModal.open({
          templateUrl: 'views/cancel-editing-modal.html',
          controller: 'CancelEditingModalController',
          controllerAs: 'vm',
          size: 'lg',
          windowClass: 'cancel-editing',
          link: () => {
          },
        });
      } else {

        // Otherwise, just send us back to wherever we came from
        $window.history.back();
      }
    }
  }

  editSiteService.$inject = [
    '$uibModal',
    '$window',
    'dsapi',
  ];
  angular.module('divesites.editSite').factory('editSiteService', editSiteService);
})();
