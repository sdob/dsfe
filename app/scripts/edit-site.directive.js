(function () {
  'use strict';

  function EditSite() {
    return {
      templateUrl: 'views/edit-site.html',
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

  EditSite.$inject = [];

  angular.module('divesites').directive('editSite', EditSite);
})();
