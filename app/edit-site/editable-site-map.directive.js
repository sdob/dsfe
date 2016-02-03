(function() {
  'use strict';
  function EditableSiteMap(uiGmapGoogleMapApi) {
    return {
      restrict: 'E',
      templateUrl: 'edit-site/editable-site-map.html',
      link: (elem, scope, attrs, ctrl) => {
        uiGmapGoogleMapApi
        .then((maps) => {
          const mapContainer = $('.angular-google-map-container')[0];
          $('<div/>').addClass('editable-site-map__centre-marker')
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
