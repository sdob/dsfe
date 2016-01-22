(function() {
  'use strict';
  function EditableSiteMap() {
    return {
      restrict: 'E',
      templateUrl: 'edit-site/editable-site-map.html',
      link: (elem, scope, attrs, ctrl) => {
      },
    };
  }

  EditableSiteMap.$inject = [];
  angular.module('divesites.editSite').directive('editableSiteMap', EditableSiteMap);
})();
