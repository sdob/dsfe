(function () {
  'use strict';
  function EditableSiteMap() {
    return {
      restrict: 'E',
      templateUrl: 'views/editable-site-map.html',
      link: (elem, scope, attrs, ctrl) => {
      },
    };
  }

  EditableSiteMap.$inject = [];
  angular.module('divesites').directive('editableSiteMap', EditableSiteMap);
})();
