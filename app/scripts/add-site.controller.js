(function () {
  'use strict';
  function AddSiteController(mapSettings) {
    const vm = this;
    activate();

    function activate() {
      console.log('AddSiteController.activate()');
      vm.map = mapSettings.get();
      vm.submit = submit;
    }
    function submit() {
      console.log('submitted!');
    }
  }

  AddSiteController.$inject = ['mapSettings'];
  angular.module('divesites').controller('AddSiteController', AddSiteController);
})();
