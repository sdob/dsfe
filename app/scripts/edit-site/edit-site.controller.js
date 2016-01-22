(function() {
  'use strict';
  function EditSiteController(
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
    mapService
  ) {
    const vm = this;
    activate();

    function activate() {
      vm.siteTypeString = 'divesite';

      // Wire up functions
      vm.checkAtLeastOneEntryIsSelected = checkAtLeastOneEntryIsSelected;
      vm.prepareToDeleteExistingHeaderImage = prepareToDeleteExistingHeaderImage;
      vm.removeImageThumbnail = removeImageThumbnail;
      vm.submit = submit;
      vm.summonCancelEditingModal = editSiteService.summonCancelEditingModal;
      vm.handleSuccessfulSave = handleSuccessfulSave;

      // By default, we're adding a new site
      vm.title = 'Add a new divesite';

      // Retrieve map settings
      vm.map = mapService.get();
      // If we arrived here via the map context menu, 
      // then there will be a lat/lng pair for us to centre on;
      // use that instead
      console.log(contextMenuService.latLng());
      if (contextMenuService.latLng() !== undefined) {
        vm.map.center = {
          latitude: contextMenuService.latLng()[0],
          longitude: contextMenuService.latLng()[1],
        };
      }

      // Create a default site
      vm.site = mapService.defaultSite(vm.map);
      // Create a default marker from the map
      vm.marker = mapService.defaultMarker(vm.map);
      vm.marker.events = { };

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

          // Set up map and marker
          vm.map.center = vm.site.coords;
          vm.marker = {
            id: vm.site.id,
            coords: vm.site.coords,
            options: {
              draggable: true,
            },
          };
        })
        .then(() => dsimg.getDivesiteHeaderImage(vm.site.id))
        .then((response) => {
          // Handle image data from dsimg
          if (response.data && response.data.image && response.data.image.url) {
            vm.site.headerImageUrl = response.data.image.url;
            console.log(vm.site.headerImageUrl);
          }
        });

        // TODO: handle invalid/missing divesite IDs
      }
    }

    function checkAtLeastOneEntryIsSelected() {
      vm.atLeastOneEntryIsSelected = (vm.site.boatEntry || vm.site.shoreEntry);
    }

    function formatResponse(data) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
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
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function formatRequest(data) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
      const obj = Object.assign(data);

      // Convert lat/lng data to a format that dsapi expects
      obj.latitude = obj.coords.latitude;
      obj.longitude = obj.coords.longitude;
      delete obj.coords;

      // Convert camel-cased entry types to the format dsapi expects
      obj.boat_entry = obj.boatEntry;
      obj.shore_entry = obj.shoreEntry;
      delete obj.boatEntry;
      delete obj.shoreEntry;

      console.log(obj);
      return obj;

    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function prepareToDeleteExistingHeaderImage() {
      vm.site.headerImageUrl = null;
    }

    function removeImageThumbnail() {
      delete vm.imgFile;
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
      console.log(data);

      // Based on whether $routeParams.id is defined, decide which
      // API call to use (create/update)
      const apiCall = editSiteService.selectSubmissionApiCall($routeParams.id);

      // We are either:
      // (a) creating or replacing the current divesite header image;
      // (b) deleting the divesite header image; or
      // (c) doing nothing with the header image (the default)
      let imgServerCall = () => Promise.resolve(); // nop (default)
      if (vm.imgFile) { // creating or replacing
        imgServerCall = () => uploadHeaderImage(vm.imgFile);
      } else if (!vm.site.headerImageUrl) { // deleting or not adding
        imgServerCall = () => dsimg.deleteDivesiteHeaderImage(vm.site.id);
      }

      apiCall(data)
      .then((response) => {
        vm.site.id = response.data.id; // This is the edited/created site's ID
        return imgServerCall();
      })
      .then((response) => {
        console.log('return from api');
        console.log(response);
        vm.isSaving = false;

        // TODO: summon a modal offering to take the user back
        vm.handleSuccessfulSave();
      })
      .catch((err) => {
        vm.isSaving = false;
        console.log('I GOT AN ERROR');
        console.log(err);

        // TODO: handle 4xx and 5xx errors
      });
    }

    function handleSuccessfulSave() {
      $window.history.back();
    }

    function truncateCoordinate(n) {
      return Math.round(n * 10e6) / 10e6;
    }

    function uploadHeaderImage(file) {
      return Upload.upload({
        data: { image: file },
        url: `${dsimg.IMG_API_URL}/divesites/${vm.site.id}/header`,
      });
    }
  }

  EditSiteController.$inject = [
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
    'mapService',
  ];
  angular.module('divesites.editSite').controller('EditSiteController', EditSiteController);
})();
