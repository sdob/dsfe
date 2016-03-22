// jscs: disable requireCamelCaseOrUpperCaseIdentifiers
(function() {
  'use strict';
  function editSiteService($uibModal, $window, contextMenuService, dsapi) {

    const apiCalls = {
      compressor: (id) => {
        return id ? dsapi.updateCompressor : dsapi.postCompressor;
      },

      divesite: (id) => {
        return id ? dsapi.updateDivesite : dsapi.postDivesite;
      },

      slipway: (id) => {
        return id ? dsapi.updateSlipway : dsapi.postSlipway;
      },
    };

    return {
      apiCalls,
      formatRequest,
      formatResponse,
      getContextMenuCoordinates,
      selectSubmissionApiCall,
      summonCancelEditingModal,
    };

    function formatRequest(data) {
      const obj = Object.assign({}, data);

      // Convert lat/lng data to a format that dsapi expects
      obj.latitude = obj.coords.latitude;
      obj.longitude = obj.coords.longitude;
      delete obj.coords;

      // Convert camel-cased entry types to the format dsapi expects
      obj.boat_entry = obj.boatEntry;
      obj.shore_entry = obj.shoreEntry;
      delete obj.boatEntry;
      delete obj.shoreEntry;

      return obj;
    }

    function formatResponse(data) {
      const site = Object.assign({}, data);

      // Format coordinates
      site.coords = {
        latitude: data.latitude,
        longitude: data.longitude,
      };
      delete site.latitude;
      delete site.longitude;

      // Format snake-cased fields
      site.boatEntry = site.boat_entry;
      site.shoreEntry = site.shore_entry;
      delete site.shore_entry;
      delete site.boat_entry;

      return site;
    }

    function getContextMenuCoordinates() {
      if (contextMenuService.latLng() !== undefined) {
        const coordinates = {
          latitude: contextMenuService.latLng()[0],
          longitude: contextMenuService.latLng()[1],
        };
        contextMenuService.clear(); // Read-once
        return coordinates;
      }

      return undefined;
    }

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
          templateUrl: 'templates/cancel-editing-modal.template.html',
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
    'contextMenuService',
    'dsapi',
  ];
  angular.module('divesites.editSite').factory('editSiteService', editSiteService);
})();
