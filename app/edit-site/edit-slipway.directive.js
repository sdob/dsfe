(function() {
  'use strict';
  function editSlipway() {
    return {
      templateUrl: 'edit-site/edit-slipway.html',
    };
  }

  angular.module('divesites.editSite').directive('editSlipway', editSlipway);
})();
