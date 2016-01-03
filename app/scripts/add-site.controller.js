(function () {
  'use strict';
  function AddSiteController($scope, $timeout, dsapi, mapSettings) {
    const vm = this;
    activate();

    function activate() {
      console.log('AddSiteController.activate()');
      vm.checkAtLeastOneEntryIsSelected = checkAtLeastOneEntryIsSelected;
      vm.map = mapSettings.get();
      vm.site = vm.site || {
        boat_entry: false,
        shore_entry: false,
        coords: {
          latitude: vm.map.center.latitude,
          longitude: vm.map.center.longitude,
        },
      };
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
      vm.submit = submit;

      vm.checkAtLeastOneEntryIsSelected();
      console.log(vm.atLeastOneEntryIsSelected);
    }

    function checkAtLeastOneEntryIsSelected() {
      console.log('checking entries');
        vm.atLeastOneEntryIsSelected = (vm.site.boat_entry || vm.site.shore_entry);
    }

    function submit() {
      console.log('submitted!');
      // Set the site form's $submitted property to true
      // (this will check validation for untouched forms)
      $scope.addSiteForm.$submitted = true;
      // If the form is invalid, just return
      if (!$scope.addSiteForm.$valid) return;

      // Re-format site data
      const data = Object.assign({}, vm.site);
      data.latitude = data.coords.latitude;
      data.longitude = data.coords.longitude;
      delete data.coords;
      console.log(data);
      // Disable the save button while we contact the API server
      vm.isSaving = true;
      //$timeout(() => {
        //console.log('finished saving');
        //vm.isSaving = false;
      //}, 1000);
      dsapi.postDivesite(data)
      .then((response) => {
        console.log('return from api');
        console.log(response);
        vm.isSaving = false;
      });
    }
  }

  AddSiteController.$inject = ['$scope', '$timeout', 'dsapi', 'mapSettings'];
  angular.module('divesites').controller('AddSiteController', AddSiteController);
})();
