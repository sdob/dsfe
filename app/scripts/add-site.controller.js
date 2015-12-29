(function () {
  'use strict';
  function AddSiteController() {
    activate();

    function activate() {
      console.log('AddSiteController.activate()');
    }
  }

  AddSiteController.$inject = [];
  angular.module('divesites').controller('AddSiteController', AddSiteController);
})();
