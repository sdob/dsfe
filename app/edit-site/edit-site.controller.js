(function() {
  'use strict';

  // Generic site-editing controller
  function EditSiteController($routeParams, $scope, $timeout, contextMenuService, editSiteService, mapService, seabedTypeService, type) {

    const vm = this;
    // Map event listeners
    vm.mapEvents = {
      center_changed: (evt) => {
        // When the map centre changes, update the site model
        vm.site.coords.latitude = evt.center.lat();
        vm.site.coords.longitude = evt.center.lng();
      },
    };
    vm.siteTypeString = type; // Passes to editable-site-map
    vm.submit = submit;
    vm.summonCancelEditingModal = editSiteService.summonCancelEditingModal;
    vm.updateMap = updateMap;

    // Bind type-specific values
    if (type === 'divesite') {
      vm.checkAtLeastOneEntryIsSelected = checkAtLeastOneEntryIsSelected;
      vm.seabedTypes = seabedTypesService.seabedTypes;
      vm.selectSeabedType = selectSeabedType;
    }

    activate();

    function activate() {
      console.log('EditSiteController.activate()');

      // Retrieve center/zoom settings from main map
      vm.map = mapService.get();
      // Assign map coordinates from context-menu click
      vm.map.center = assignContextMenuCoordinates(vm.map);
      // Generate site details from the map
      vm.site = mapService.defaultSite(vm.map);

      // If we were passed a site ID, then we're expecting to edit
      // an existing site
      if ($routeParams.id) {
        vm.title = `Edit this ${type}`;
        editSiteService.siteRetrievalCalls[type]($routeParams.id)
        .then((data) => {
          // When we get data back from the API, then update the map and site model
          vm.site = formatResponse(data);
          vm.map.center = vm.site.coords;

          // Do type-specific stuff
          if (type === 'divesite') {
            vm.checkAtLeastOneEntryIsSelected();
          }
        });
      } else {
        vm.title = `Add a new ${type}`;
      }

    }

    // Look for context-menu coordinates and return them if found; otherwise,
    // return the original coordinates
    function assignContextMenuCoordinates(map) {
      const defaultCoordinates = {
        latitude: map.center.latitude,
        longitude: map.center.longitude,
      };
      const contextMenuCoordinates = editSiteService.getContextMenuCoordinates();
      if (contextMenuCoordinates !== undefined) {
        return contextMenuCoordinates;
      }

      return defaultCoordinates;
    }

    // Set a flag that tells us whether the selection of entry types is valid
    function checkAtLeastOneEntryIsSelected() {
      vm.atLeastOneEntryIsSelected = (vm.site.boatEntry || vm.site.shoreEntry);
    }

    // Update the site model with the selected seabed type
    function selectSeabedType(seabed) {
      vm.site.seabed = seabed;
    }

    // Submit the site data to the API to create/update it
    function submit() {
      // Set the form's $submitted property to true, triggering
      // validation
      $scope.siteForm.$submitted = true;
    }

    // Update the map in the next tick
    function updateMap() {
      $timeout(() => {
        vm.map.center.latitude = vm.site.coords.latitude;
        vm.map.center.longitude = vm.site.coords.longitude;
      });
    }
  }

  EditSiteController.$inject = [
    '$routeParams',
    '$scope',
    '$timeout',
    'contextMenuService',
    'editSiteService',
    'mapService',
    'type',
  ];
  angular.module('divesites.editSite').controller('EditSiteController', EditSiteController);
})();
