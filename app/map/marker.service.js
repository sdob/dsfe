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
      shouldBeVisible,
      transformAmenityToMarker,
      transformSiteToMarker,
    };

    /*
     * Check site data against filter preferences to see if it should be
     * visible on the map
     */
    function shouldBeVisible(marker, preferences) {
      // Bail out early if we were called with garbage
      if (!marker) return false;

      // If this marker is a slipway, handle visibility preferences for it
      if (marker.type === 'slipway') {
        return preferences.slipways;
      }

      // If this marker is a compressor, handle visibility preferences for it
      if (marker.type === 'compressor') {
        return preferences.compressors;
      }

      // Default case: this is a divesite marker, and things are more complex.

      // First of all, if preferences.divesites is false, then that's an easy
      // one
      if (!preferences.divesites) {
        return false;
      }
      // Site depth should be less than or equal to preferred maximum depth
      const depth = marker.depth <= preferences.maximumDepth;

      // Site level should be less than or equal to preferred maximum level
      const level = marker.level <= preferences.maximumLevel;

      // A site with boat entry should be visible if preferences want it to be
      const boatEntry = (marker.boatEntry && preferences.boatEntry);

      // A site with shore entry should be visible if preferences want it to be
      const shoreEntry = (marker.shoreEntry && preferences.shoreEntry);

      // A site has to meet all of these criteria in order to be visible, except
      // that it only has to match one entry preference
      return depth && level && (boatEntry || shoreEntry);
    }

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
