(function() {
  'use strict';
  function editSlipway() {
    return {
      templateUrl: 'views/edit-site/edit-slipway.html',
    };
  }

  angular.module('divesites.editSite').directive('editSlipway', editSlipway);
})();
