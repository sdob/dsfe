(function() {
  'use strict';

  function editSite() {
    return {
      templateUrl: 'edit-site/edit-site.template.html',
      restrict: 'E',
      link: (scope, elem, attrs, ctrl) => {
        $('#add-site__boat-entry').on('click', () => {
          scope.vm.checkAtLeastOneEntryIsSelected();
        });
        $('#add-site__shore-entry').on('click', () => {
          scope.vm.checkAtLeastOneEntryIsSelected();
        });
      },
    };
  }

  editSite.$inject = [];

  angular.module('divesites.editSite').directive('editSite', editSite);
})();
