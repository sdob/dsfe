(function () {
  'use strict';

  function AddSite() {
    return {
      templateUrl: 'views/add-site.html',
      restrict: 'E',
      link: (scope, elem, attrs, ctrl) => {
        console.log('addSite.link()');
        console.log(scope);
        $('#add-site__boat-entry').on('click', () => {
          scope.vm.checkAtLeastOneEntryIsSelected();
        });
        $('#add-site__shore-entry').on('click', () => {
          scope.vm.checkAtLeastOneEntryIsSelected();
        });
      },
    };
  }

  AddSite.$inject = [];

  angular.module('divesites').directive('addSite', AddSite);
})();
