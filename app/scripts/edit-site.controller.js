(function () {
  'use strict';
  function EditSiteController($routeParams, $scope, $timeout, $uibModal, $window, dsapi, mapSettings) {
    const vm = this;
    activate();

    function activate() {
      console.log('EditSiteController.activate()');
      console.log(`$routeParams.divesiteId: ${$routeParams.divesiteId}`);
      vm.checkAtLeastOneEntryIsSelected = checkAtLeastOneEntryIsSelected;
      vm.map = mapSettings.get();
      // Set default marker
      vm.marker = {
        id: 0,
        coords: {
          latitude: vm.map.center.latitude,
          longitude: vm.map.center.longitude,
        },
        options: {
          draggable: true,
        },
      };
      // Set default site
      vm.site = vm.site || {
        boat_entry: false,
        shore_entry: false,
        coords: {
          latitude: vm.map.center.latitude,
          longitude: vm.map.center.longitude,
        },
      };
      vm.submit = submit;
      vm.summonCancelEditingModal = summonCancelEditingModal;
      // Pre-validate checkboxes
      vm.checkAtLeastOneEntryIsSelected();
      //console.log(`is at least one entry selected? ${vm.atLeastOneEntryIsSelected}`);

      // If we're passed a divesite ID, then we're expecting to edit
      // an existing divesite.
      if ($routeParams.divesiteId) {
        // We are editing a site...
        dsapi.getDivesite($routeParams.divesiteId)
        .then((response) => {
          vm.site = Object.assign({}, response.data);
          vm.site.coords = {
            latitude: response.data.latitude,
            longitude: response.data.longitude,
          };
          delete vm.site.latitude;
          delete vm.site.longitude;
          vm.map.center = vm.site.coords;
          vm.marker = {
            id: vm.site.id,
            coords: vm.site.coords,
            options: {
              draggable: true,
            },
          };
          vm.checkAtLeastOneEntryIsSelected();
        });
        // TODO: handle invalid/missing divesite IDs
      }
    }

    function checkAtLeastOneEntryIsSelected() {
      vm.atLeastOneEntryIsSelected = (vm.site.boat_entry || vm.site.shore_entry);
    }

    function submit() {
      console.log('EditSiteController.submit()');
      // Set the site form's $submitted property to true
      // (this will check validation for untouched forms)
      $scope.siteForm.$submitted = true;
      // If the form is invalid, just return
      if (!$scope.siteForm.$valid) {
        console.error('form is invalid; returning');
        console.log($scope.siteForm);
        return;
      }


      // Re-format site data
      const data = Object.assign({}, vm.site);
      data.latitude = data.coords.latitude;
      data.longitude = data.coords.longitude;
      delete data.coords;
      console.log(data);
      // Disable the save button while we contact the API server
      vm.isSaving = true;
      // method depends on whether we're editing or adding
      if ($routeParams.divesiteId) {
        dsapi.updateDivesite($routeParams.divesiteId)
        .then((response) => {
          console.log('return from api');
          console.log(response);
          vm.isSaving = false;
        });
      } else {
        dsapi.postDivesite(data)
        .then((response) => {
          console.log('return from api');
          console.log(response);
          vm.isSaving = false;
        });
      }
    }

    function summonCancelEditingModal() {
      console.log($window);
      if ($scope.siteForm.$dirty) {
        // If the form has been edited, then confirm that the user
        // is OK with losing their changes
        const modalInstance = $uibModal.open({
          templateUrl: 'views/cancel-editing-modal.html',
          controller: 'CancelEditingModalController',
          controllerAs: 'cevm',
          size: 'lg',
        });
      }
      else {
        // Otherwise, just send us back to wherever we came from
        $window.history.back();
      }
    } 
  }

  EditSiteController.$inject = ['$routeParams', '$scope', '$timeout', '$uibModal', '$window', 'dsapi', 'mapSettings'];
  angular.module('divesites').controller('EditSiteController', EditSiteController);
})();
