(function() {
  'use strict';
  function EditSiteController(
    $location,
    $routeParams,
    $scope,
    $timeout,
    $uibModal,
    $window,
    Upload,
    contextMenuService,
    dsapi,
    dsimg,
    editSiteService,
    localStorageService,
    mapService,
    seabedTypesService
  ) {
    const { formatRequest, formatResponse } = editSiteService;
    const { seabedTypes } = seabedTypesService;
    const vm = this;
    activate();

    function activate() {
      console.log('EditSiteController.activate()');

      // Wire up functions
      vm.checkAtLeastOneEntryIsSelected = checkAtLeastOneEntryIsSelected;
      vm.handleSuccessfulSave = handleSuccessfulSave;
      vm.seabedTypes = seabedTypes;
      vm.selectSeabedType = selectSeabedType;
      vm.summonCancelEditingModal = editSiteService.summonCancelEditingModal;
      vm.submit = submit;
      vm.updateMap = updateMap;

      // Retrieve map settings
      vm.map = mapService.get();

      // By default, we're adding a new site
      vm.siteTypeString = 'divesite';
      vm.title = 'Add a new divesite';

      // Register map event listeners
      vm.mapEvents = {
        center_changed: (evt) => {
          // When the map center changes, update the site coords
          vm.site.coords.latitude = evt.center.lat();
          vm.site.coords.longitude = evt.center.lng();
        },
      };

      // Try to retrieve context menu coordinates and use them instead of defaults
      const contextMenuCoordinates = editSiteService.getContextMenuCoordinates();
      if (contextMenuCoordinates !== undefined) {
        vm.map.center = contextMenuCoordinates;
      }

      // Clear the context menu's stored settings
      contextMenuService.clear();

      // Create a default site
      vm.site = mapService.defaultSite(vm.map);

      // Pre-validate checkboxes (XXX: why?)
      vm.checkAtLeastOneEntryIsSelected();

      // If we were passed a divesite ID, then we're expecting to edit
      // an existing divesite.
      if ($routeParams.id) {
        vm.title = 'Edit this divesite';

        // Retrieve this site's data from dsapi
        dsapi.getDivesite($routeParams.id)
        .then((response) => {
          // Format the site data
          vm.site = formatResponse(response.data);
          // Validate the entry checkboxes
          vm.checkAtLeastOneEntryIsSelected();
          // Set up map
          vm.map.center = vm.site.coords;
        });
        // TODO: handle invalid/missing divesite IDs
      }
    }

    function checkAtLeastOneEntryIsSelected() {
      vm.atLeastOneEntryIsSelected = (vm.site.boatEntry || vm.site.shoreEntry);
    }

    function handleSuccessfulSave() {
      // On successful save, check the location params
      console.log($location.$$search);
      if ($location.$$search.next) {
        switch ($location.$$search.next) {
          case 'profile':
            // If the user is logged in, head to their profile page
            if (localStorageService.get('user')) {
              return $location.url(`/users/${localStorageService.get('user')}`);
            }
            // This shouldn't happen, but degrade gracefully
            return $location.url(`/?${vm.siteTypeString}=${vm.site.id}`);
          default:
            return $location.url(`/?${vm.siteTypeString}=${vm.site.id}`);
        }
      }
    }

    function selectSeabedType(seabed) {
      vm.site.seabed = seabed;
      console.log(vm.site.seabed);
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

      // Disable the save button while we contact the API server
      vm.isSaving = true;

      // Re-format site data
      const data = formatRequest(vm.site);

      // Based on whether $routeParams.id is defined, decide which
      // API call to use (create/update)
      const apiCall = editSiteService.selectSubmissionApiCall($routeParams.id);

      console.log(data);

      apiCall(data)
      .then((response) => {
        vm.site.id = response.data.id; // This is the edited/created site's ID
      })
      .then((response) => {
        // Save was successful
        vm.isSaving = false;
        vm.handleSuccessfulSave();
      })
      .catch((err) => {
        // Problem with saving
        vm.isSaving = false;
        console.log('I GOT AN ERROR');
        console.log(err);
        // TODO: handle 4xx and 5xx errors
      });
    }

    function truncateCoordinate(n) {
      return Math.round(n * 10e6) / 10e6;
    }

    function updateMap() {
      // When the site coordinates change, update the map
      $timeout(() => {
        vm.map.center.latitude = vm.site.coords.latitude;
        vm.map.center.longitude = vm.site.coords.longitude;
      });
    }
  }

  EditSiteController.$inject = [
    '$location',
    '$routeParams',
    '$scope',
    '$timeout',
    '$uibModal',
    '$window',
    'Upload',
    'contextMenuService',
    'dsapi',
    'dsimg',
    'editSiteService',
    'localStorageService',
    'mapService',
    'seabedTypesService',
  ];
  angular.module('divesites.editSite').controller('EditSiteController', EditSiteController);
})();
