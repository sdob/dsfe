(function() {
  'use strict';
  function EditCompressorController(
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
          label: 'Compressor name',
          helpText: 'Give this compressor a name.',
        },
        description: {
          label: 'Description',
          helpText: '(Optional) Describe this compressor.',
        },
        title: 'Add a new compressor',
      },
      edit: {
        name: {
          label: 'Compressor name',
          helpText: 'This compressor requires a name.',
        },
        description: {
          label: 'Description',
          helpText: '(Optional) Describe this compressor.',
        },
      },
    };

    const { formatRequest, formatResponse } = editSiteService;
    const vm = this;
    activate();

    function activate() {
      // Wire up functions
      vm.submit = submit;
      vm.summonCancelEditingModal = editSiteService.summonCancelEditingModal;
      vm.updateMap = updateMap;

      // Initialize
      vm.siteTypeString = 'compressor';
      vm.map = mapService.get();

      // Try to retrieve context menu coordinates and use them instead
      const contextMenuCoordinates = editSiteService.getContextMenuCoordinates();
      if (contextMenuCoordinates !== undefined) {
        vm.map.center = contextMenuCoordinates;
      }

      vm.site = mapService.defaultSite(vm.map);
      vm.marker = mapService.defaultMarker(vm.map);
      vm.marker.events = {
        dragend: () => {
          console.log('dragend');
          $timeout(() => {
          }, 0);
        },
      };

      if ($routeParams.id) {

        // We're editing a compressor
        vm.templateStrings = TEMPLATE_STRINGS.edit;

        // Retrieve compressor data
        dsapi.getCompressor($routeParams.id)
        .then((response) => {

          // TODO: check whether the data returned are OK
          // Format site data for angular-google-maps
          vm.site = formatResponse(response.data);
          vm.map.center = vm.site.coords;
          vm.marker = {
            id: vm.site.id,
            coords: vm.site.coords,
            options: {
              draggable: true,
            },
          };

          // TODO: this is subject to change when the compressor's name changes
          vm.title = 'Edit this compressor';
        })
        .then((response) => {

          // TODO: get header image from dsimg server
        });
      } else {

        // We're adding a compressor
        vm.title = 'Add a compressor';
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

        // We're editing an existing compressor
        dsapi.updateCompressor(vm.site.id, requestData)
        .then((response) => {
          console.log(response);
          vm.isSaving = false;

          // Return to the compressor information card
          $location.path('/');
          $location.search(`compressor=${response.data.id}`);
        })
        .catch((err) => {
          console.error(err);

          // TODO: handle server-side errors
        });
      } else {

        // We're adding a new compressor
        dsapi.postCompressor(requestData)
        .then((response) => {
          console.log(response);
          $timeout(() => {

            // Add a bit of latency so that it's obvious that the request
            // was handled
            vm.isSaving = false;

            // Return to the compressor information card
            $location.path('/');
            $location.search(`compressor=${response.data.id}`);
          }, 500);
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

  EditCompressorController.$inject = [
    '$location',
    '$routeParams',
    '$scope',
    '$timeout',
    'dsapi',
    'editSiteService',
    'mapService',
  ];
  angular.module('divesites.editSite').controller('EditCompressorController', EditCompressorController);
})();
