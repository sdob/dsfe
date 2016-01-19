(function() {
  'use strict';
  function EditSlipwayController($location, $routeParams, $scope, $timeout, dsapi, mapSettings) {

    const TEMPLATE_STRINGS = {
      add: {
        name: {
          label: 'Slipway name',
          helpText: 'Give this slipway a name.',
        },
        description: {
          label: 'Description',
          helpText: '(Optional) Describe this slipway.',
        },
        title: 'Add a new slipway',
      },
      edit: {
        name: {
          label: 'Slipway name',
          helpText: 'This slipway requires a name.',
        },
        description: {
          label: 'Description',
          helpText: '(Optional) Describe this slipway.',
        },
      },
    };

    const vm = this;
    activate();

    function activate() {
      // Wire up functions
      vm.submit = submit;

      // Initialize
      vm.siteTypeString = 'slipway';
      vm.map = mapSettings.get();
      vm.site = mapSettings.defaultSite(vm.map);
      vm.marker = mapSettings.defaultMarker(vm.map);
      vm.marker.events = {
        dragend: () => {
          console.log('dragend');
          $timeout(() => {
          }, 0);
        },
      };

      if ($routeParams.id) {

        // We're editing a slipway
        vm.templateStrings = TEMPLATE_STRINGS.edit;

        // Retrieve slipway data
        dsapi.getSlipway($routeParams.id)
        .then((response) => {

          // TODO: check whether the data returned are OK
          // Format site data for angular-google-maps
          vm.site = formatResponse(response);
          vm.map.center = vm.site.coords;
          vm.marker = {
            id: vm.site.id,
            coords: vm.site.coords,
            options: {
              draggable: true,
            },
          };

          // TODO: this is subject to change when the slipway's name changes
          vm.title = 'Edit this slipway';
        })
        .then((response) => {

          // TODO: get header image from dsimg server
        });
      } else {

        // We're adding a slipway
        vm.title = 'Add a slipway';
        vm.templateStrings = TEMPLATE_STRINGS.add;
      }
    }

    function formatResponse(response) {

      // Convert DSAPI response data to a format that angular-google-maps
      // understands.
      const site = Object.assign({}, response.data);
      site.coords = {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
      };
      delete site.latitude;
      delete site.longitude;
      return site;
    }

    function formatRequest(site) {

      // Convert Angular model to a format that DSAPI understands.
      const requestData = Object.assign({}, site);
      requestData.latitude = site.coords.latitude;
      requestData.longitude = site.coords.longitude;
      delete requestData.coords;
      return requestData;
    }

    function submit() {
      if (Object.keys($scope.siteForm.$error).length) {
        console.log($scope.siteForm.$error);
        return;
      }

      $scope.siteForm.$submitted = true;
      vm.isSaving = true;
      const requestData = formatRequest(vm.site);
      console.log(requestData);

      if ($routeParams.id) {

        // We're editing an existing slipway
        dsapi.updateSlipway(vm.site.id, requestData)
        .then((response) => {
          console.log(response);
          vm.isSaving = false;

          // Return to the slipway information card
          $location.path('/');
          $location.search(`slipway=${response.data.id}`);
        })
        .catch((err) => {
          console.error(err);

          // TODO: handle server-side errors
        });
      } else {

        // We're adding a new slipway
        dsapi.postSlipway(requestData)
        .then((response) => {
          console.log(response);
          $timeout(() => {

            // Add a bit of latency so that it's obvious that the request
            // was handled
            vm.isSaving = false;

            // Return to the slipway information card
            $location.path('/');
            $location.search(`slipway=${response.data.id}`);
          }, 500);
        })
        .catch((error) => {
          vm.isSaving = false;
          console.error(error);

          // TODO: handle server-side errors
        });
      }

    }
  }

  EditSlipwayController.$inject = [
    '$location',
    '$routeParams',
    '$scope',
    '$timeout',
    'dsapi',
    'mapSettings',
  ];
  angular.module('divesites.editSite').controller('EditSlipwayController', EditSlipwayController);
})();
