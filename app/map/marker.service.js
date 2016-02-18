// jscs: disable requireCamelCaseOrUpperCaseIdentifiers
(function() {
  function markerService() {
    // Default marker icons
    const defaultCompressorMarkerIcon = '/img/compressor.svg';
    const defaultMapMarkerIcon = '/img/divesite.svg';
    const defaultSlipwayMarkerIcon = '/img/boatlaunch.svg';
    const selectedMapMarkerIcon = '/img/divesite_selected.svg';
    const selectedCompressorMarkerIcon = '/img/compressor_selected.svg';
    const selectedSlipwayMarkerIcon = '/img/boatlaunch_selected.svg';

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

    // Selected sites of any types sit in front of unselected divesites,
    // which sit in front of unselected non-divesites
    const DEFAULT_SITE_Z_INDEX = 0;
    const DEFAULT_DIVESITE_Z_INDEX = 1;
    const SELECTED_SITE_Z_INDEX = 2;

    return {
      DEFAULT_SITE_Z_INDEX,
      DEFAULT_DIVESITE_Z_INDEX,
      SELECTED_SITE_Z_INDEX,
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
        geocoding_data: s.geocoding_data,
        level: s.level,
        icon: defaultMarkerIcons.divesite,
        id: s.id,
        loc: {
          latitude: s.latitude,
          longitude: s.longitude,
        },
        options: {
          visible: false,
          zIndex: DEFAULT_DIVESITE_Z_INDEX,
        },
        owner: s.owner,
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
        geocoding_data: s.geocoding_data,
        icon,
        id: s.id,
        loc: {
          latitude: s.latitude,
          longitude: s.longitude,
        },
        options: {
          visible: false,
          /*
           * Set z-index of the marker to ensure that divesites appear in front
           * of non-divesites.
           *
           * To future-proof this (if we decide to get rid of transformSitetoMarker)
           * we'll do a check against the type and assign a z-index accordingly.
          */
          zIndex: type === 'divesite' ? DEFAULT_DIVESITE_Z_INDEX : DEFAULT_SITE_Z_INDEX,
        },
        owner: s.owner,
        title: s.name,
        type: type,
      };
    }
  }

  angular.module('divesites.map').factory('markerService', markerService);
})();
