(function() {
  'use strict';
  function EditableSiteMap(uiGmapGoogleMapApi) {
    return {
      restrict: 'E',
      templateUrl: 'edit-site/editable-site-map.template.html',
      link: (scope, elem, attrs, ctrl) => {
        console.log(scope);
        uiGmapGoogleMapApi
        .then((maps) => {
          const mapContainer = $('.angular-google-map-container')[0];
          $('<div/>').addClass(`editable-site-map__centre-marker ${scope.vm.siteTypeString}`)
          .appendTo(mapContainer);
        });
      },
    };
  }

  EditableSiteMap.$inject = [
    'uiGmapGoogleMapApi',
  ];
  angular.module('divesites.editSite').directive('editableSiteMap', EditableSiteMap);
})();
