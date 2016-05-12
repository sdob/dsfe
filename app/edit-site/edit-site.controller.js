(function() {
  'use strict';

  // Generic site-editing controller
  function EditSiteController(type) {
  }

  EditSiteController.$inject = [
    'type',
  ];
  angular.module('divesites.editSite').controller('EditSiteController', EditSiteController);
})();
