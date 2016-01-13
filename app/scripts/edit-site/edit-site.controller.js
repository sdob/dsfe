(function () {
  'use strict';
  function EditSiteController($routeParams, $scope, $timeout, $uibModal, $window, Upload, dsapi, dsimg, mapSettings) {
    const vm = this;
    activate();

    function activate() {
      console.log('EditSiteController.activate()');
      console.log(`$routeParams.divesiteId: ${$routeParams.divesiteId}`);
      // Wire up functions
      vm.checkAtLeastOneEntryIsSelected = checkAtLeastOneEntryIsSelected;
      vm.maintainCoordinateMaxLength = maintainCoordinateMaxLength;
      vm.prepareToDeleteExistingHeaderImage = prepareToDeleteExistingHeaderImage;
      vm.removeImageThumbnail = removeImageThumbnail;
      vm.submit = submit;
      vm.summonCancelEditingModal = summonCancelEditingModal;
      vm.handleSuccessfulSave = handleSuccessfulSave;

      // Retrieve map settings
      vm.map = mapSettings.get();
      // Set default site
      vm.site = defaultSite();
      vm.maintainCoordinateMaxLength();
      // Set default marker
      vm.marker = mapSettings.defaultMarker(vm.site);
      vm.marker.events = {
        dragend: () => {
          vm.maintainCoordinateMaxLength();
        }
      };
      console.log('HELLLLLLLO');
      //console.log(vm.marker);
      //console.log(vm.marker.coords);

      // Pre-validate checkboxes (XXX: why?)
      vm.checkAtLeastOneEntryIsSelected();

      // If we were passed a divesite ID, then we're expecting to edit
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
        })
        .then(() => dsimg.getDivesiteHeaderImage(vm.site.id))
        .then((response) => {
          console.log('response...');
          console.log(response);
          if (response.data && response.data.image && response.data.image.url) {
            vm.site.headerImageUrl = response.data.image.url;
            console.log(vm.site.headerImageUrl);
          }
        });
        // TODO: handle invalid/missing divesite IDs
      }
    }

    function checkAtLeastOneEntryIsSelected() {
      vm.atLeastOneEntryIsSelected = (vm.site.boat_entry || vm.site.shore_entry);
    }


    function maintainCoordinateMaxLength() {
      // Truncate coordinate lengths (quick and dirty way to avoid
      // floating-point errors that break ng-maxlength)
      $timeout(() => {
        console.log('truncating');
        vm.site.coords = {
          latitude: truncateCoordinate(vm.site.coords.latitude),
          longitude: truncateCoordinate(vm.site.coords.longitude),
        };
      }, 0);
    }

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
      const data = Object.assign({}, vm.site);
      data.latitude = data.coords.latitude;
      data.longitude = data.coords.longitude;
      delete data.coords;
      console.log(data);

      // Our call to the API server depends on whether we're creating a new
      // divesite or editing an existing one --- which we can determine based
      // on whether we were passed a route parameter when the controller was
      // initialized
      let apiCall;
      if ($routeParams.divesiteId) {
        apiCall = () => dsapi.updateDivesite($routeParams.divesiteId, data);
      } else {
        apiCall = () => dsapi.postDivesite(data);
      }

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

      apiCall()
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

    function summonCancelEditingModal() {
      if ($scope.siteForm.$dirty) {
        // If the form has been edited, then confirm that the user
        // is OK with losing their changes
        const modalInstance = $uibModal.open({
          templateUrl: 'views/cancel-editing-modal.html',
          controller: 'CancelEditingModalController',
          controllerAs: 'vm',
          size: 'lg',
        });
      }
      else {
        // Otherwise, just send us back to wherever we came from
        $window.history.back();
      }
    } 


    function handleSuccessfulSave() {
      $window.history.back();
    }


    function truncateCoordinate(n) {
      return Math.round(n * 10e6) / 10e6;
    }


    function uploadHeaderImage(file) {
      return Upload.upload({
        data: {image: file},
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
    'dsapi',
    'dsimg',
    'mapSettings',
  ];
  angular.module('divesites.editSite').controller('EditSiteController', EditSiteController);
})();
