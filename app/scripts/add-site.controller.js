(function () {
  'use strict';
  function AddSiteController($timeout, mapSettings) {
    const vm = this;
    activate();

    function activate() {
      console.log('AddSiteController.activate()');
      vm.map = mapSettings.get();
      vm.site = vm.site || {
        boat_entry: false,
        shore_entry: false,
        coords: {
          latitude: vm.map.center.latitude,
          longitude: vm.map.center.longitude,
        },
      };
      console.log(vm.map);
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
    }
    function submit() {
      console.log('submitted!');
      // Re-format site data
      const data = Object.assign({}, vm.site);
      data.latitude = data.coords.latitude;
      data.longitude = data.coords.longitude;
      delete data.coords;
      console.log(data);
      // Disable the save button while we contact the API server
      vm.isSaving = true;
      $timeout(() => {
        console.log('finished saving');
        vm.isSaving = false;
      }, 1000);
    }
  }

  AddSiteController.$inject = ['$timeout', 'mapSettings'];
  angular.module('divesites').controller('AddSiteController', AddSiteController);
})();
