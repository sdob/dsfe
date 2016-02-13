(function() {
  'use strict';
  function editSlipway() {
    return {
      templateUrl: 'edit-site/edit-slipway.template.html',
    };
  }

  angular.module('divesites.editSite').directive('editSlipway', editSlipway);
})();
