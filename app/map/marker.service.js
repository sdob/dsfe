// jscs: disable requireCamelCaseOrUpperCaseIdentifiers
(function() {
  function markerService() {
    // Default marker icons
    const defaultCompressorMarkerIcon = '/img/gauge_28px.svg';
    const defaultMapMarkerIcon = '/img/place_48px.svg';
    const defaultSlipwayMarkerIcon = '/img/boatlaunch_28px.svg';
    const selectedMapMarkerIcon = '/img/place_selected_48px.svg';
    const selectedCompressorMarkerIcon = '/img/gauge_selected_28px.svg';
    const selectedSlipwayMarkerIcon = '/img/boatlaunch_selected_28px.svg';

    const defaultMarkerIcons = {
      compressor: defaultCompressorMarkerIcon,
      divesite: defaultMapMarkerIcon,
      slipway: defaultSlipwayMarkerIcon,
    };

    const selectedMarkerIcons = {
      compressor: selectedCompressorMarkerIcon,
      divesite: selectedMapMarkerIcon,
      slipway: selectedSlipwayMarkerIcon,
    };

    return {
      defaultMarkerIcons,
      selectedMarkerIcons,
      transformAmenityToMarker,
      transformSiteToMarker,
    };

    /*
     * Transform divesite data from the API to a marker object
     * that angular-google-maps understands. While we're at it, we'll
     * convert snake_cased fields to camelCased properties.
     */
    function transformSiteToMarker(s) {
      return {
        boatEntry: s.boat_entry,
        depth: s.depth,
        level: s.level,
        icon: defaultMarkerIcons.divesite,
        id: s.id,
        loc: {
          latitude: s.latitude,
          longitude: s.longitude,
        },
        options: {
          visible: false,
        },
        title: s.name,
        type: 'divesite',
        shoreEntry: s.shore_entry,
      };
    }

    /*
     * Transform non-divesite (amenity) data from dsapi to a marker object
     * that angular-google-maps understands. While we're at it, we'll
     * convert snake_cased fields to camelCased properties.
     */
    function transformAmenityToMarker(s, icon, type) {
      return {
        icon,
        id: s.id,
        loc: {
          latitude: s.latitude,
          longitude: s.longitude,
        },
        options: {
          visible: false,
        },
        title: s.name,
        type: type,
      };
    }
  }

  angular.module('divesites.map').factory('markerService', markerService);
})();
