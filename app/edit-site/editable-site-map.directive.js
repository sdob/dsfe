(function() {
  'use strict';
  function EditableSiteMap(uiGmapGoogleMapApi) {
    return {
      restrict: 'E',
      templateUrl: 'edit-site/editable-site-map.template.html',
      link: (scope, elem, attrs, ctrl) => {
        // Wait for the Google Maps API to load, then place a marker object
        // in front of it to indicate the site's location
        uiGmapGoogleMapApi
        .then((maps) => {
          const mapContainer = elem.find('.angular-google-map-container')[0];

          $('<div/>')
          .addClass(`editable-site-map__centre-marker ${scope.vm.siteTypeString}`)
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
