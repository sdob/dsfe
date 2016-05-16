(function() {
  'use strict';

  function editDivesite() {
    return {
      templateUrl: 'edit-site/edit-divesite.template.html',
      restrict: 'E',
      link,
    };

    function link(scope, elem, attrs, ctrl) {
      console.log('editDivesite.link()');
      $('#add-site__boat-entry').on('click', () => {
        scope.vm.checkAtLeastOneEntryIsSelected();
      });
      $('#add-site__shore-entry').on('click', () => {
        scope.vm.checkAtLeastOneEntryIsSelected();
      });
    }
  }

  editDivesite.$inject = [];

  angular.module('divesites.editSite').directive('editDivesite', editDivesite);
})();
