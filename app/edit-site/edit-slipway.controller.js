(function() {
  'use strict';
  function EditSlipwayController(
    $location,
    $routeParams,
    $scope,
    $timeout,
    dsapi,
    editSiteService,
    mapService
  ) {

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

    const { apiCalls, formatRequest, formatResponse, handleSuccessfulSave } = editSiteService;
    const vm = this;
    activate();

    function activate() {
      // Wire up functions
      vm.submit = submit;
      vm.summonCancelEditingModal = editSiteService.summonCancelEditingModal;
      vm.updateMap = updateMap;

      // Initialize
      vm.siteTypeString = 'slipway';
      vm.map = mapService.get();

      // Try to retrieve context menu coordinates and use them instead
      const contextMenuCoordinates = editSiteService.getContextMenuCoordinates();
      if (contextMenuCoordinates !== undefined) {
        vm.map.center = contextMenuCoordinates;
      }

      vm.site = mapService.defaultSite(vm.map);
      vm.mapEvents = {
        center_changed: (evt) => {
          vm.site.coords.latitude = evt.center.lat();
          vm.site.coords.longitude = evt.center.lng();
        },
      };

      if ($routeParams.id) {
        // We're editing an existing slipway
        vm.templateStrings = TEMPLATE_STRINGS.edit;

        // Retrieve slipway data
        dsapi.getSlipway($routeParams.id)
        .then((response) => {
          // Format site data for angular-google-maps
          vm.site = formatResponse(response.data);
          console.log('loaded in stuff');
          console.log(vm.site);
          vm.map.center = vm.site.coords;
          vm.marker = {
            id: vm.site.id,
            coords: vm.site.coords,
            options: {
              draggable: true,
            },
          };
          vm.title = 'Edit this slipway';
        })
        .then((response) => {
          // TODO: get header image from dsimg server
        });
      } else {
        // We're adding a new slipway
        vm.title = 'Add a slipway';
        vm.templateStrings = TEMPLATE_STRINGS.add;
      }
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

          return handleSuccessfulSave('slipway', response.data.id);

          // Return to the slipway information card
          // $location.path('/');
          // $location.search(`slipway=${response.data.id}`);
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

            return handleSuccessfulSave('slipway', response.data.id);

            // Return to the slipway information card
            // $location.path('/');
            // $location.search(`slipway=${response.data.id}`);
          }, 200);
        })
        .catch((error) => {
          vm.isSaving = false;
          console.error(error);

          // TODO: handle server-side errors
        });
      }

    }

    function updateMap() {
      // When the site coordinates change, update the map
      $timeout(() => {
        vm.map.center.latitude = vm.site.coords.latitude;
        vm.map.center.longitude = vm.site.coords.longitude;
      });
    }
  }

  EditSlipwayController.$inject = [
    '$location',
    '$routeParams',
    '$scope',
    '$timeout',
    'dsapi',
    'editSiteService',
    'mapService',
  ];
  angular.module('divesites.editSite').controller('EditSlipwayController', EditSlipwayController);
})();
