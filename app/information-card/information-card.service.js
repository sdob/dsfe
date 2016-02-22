// jscs: disable requireCamelCaseOrUpperCaseIdentifiers
(function() {
  'use strict';
  function informationCardService($uibModal, dsapi, dsimg, localStorageService) {

    const apiCalls = {
      compressor: {
        apiCall: (id) => {
          return dsapi.getCompressor(id);
        },

        directiveString: '<compressor-information-card></compressor-information-card>',
      },

      slipway: {
        apiCall: (id) => {
          return dsapi.getSlipway(id);
        },

        directiveString: '<slipway-information-card>',
      },

      divesite: {
        apiCall: (id) => {
          return dsapi.getDivesite(id);
        },

        directiveString: '<information-card></information-card>',
      },
    };

    return {
      apiCalls,
      escapeKeydownListener,
      formatGeocodingData,
      getSiteImages,
      getDivesiteHeaderImage,
      getDivesiteImages,
      getCompressorImages,
      getSlipwayImages,
      getNearbySlipways,
      toggleOpened,
      userIsOwner,
    };

    /*
     * Return a listener for escape keypresses that runs the callback
     * when it triggers
     */
    function escapeKeydownListener(cb) {
      return (evt) => {
        if (evt.isDefaultPrevented()) {
          return evt;
        }

        switch (evt.which) {
          // Handle ESC keypress
        case 27: {
          // Wrapping this in $scope.$apply forces the
          // search params to update immediately
          evt.preventDefault();
          cb();
        }

        break;
        }
      };
    }

    function formatGeocodingData(site) {
      const locData = [];
      if (site.geocoding_data) {
        const geocodingData = JSON.parse(site.geocoding_data);
        if (geocodingData.results && geocodingData.results.length) {

          // For the moment, let's assume that the first result is the most detailed
          // TODO: check that this is in the Google geocoding docs
          const res = geocodingData.results[0];
          const ADMIN_AREA_1 = 'administrative_area_level_1';
          const COUNTRY = 'country';
          const highestAdminComponent = res.address_components.filter(x => x.types.indexOf(ADMIN_AREA_1) >= 0)[0];
          const countryComponent = res.address_components.filter(x => x.types.indexOf(COUNTRY) >= 0)[0];

          // Derive the country name (if present) and the highest-level
          // administrative area name (if present) from the JSON
          if (highestAdminComponent !== undefined) {
            locData.push(highestAdminComponent.long_name);
          }

          if (countryComponent !== undefined) {
            locData.push(countryComponent.long_name);
          }
        }
      }

      return locData;
    }

    function getDiverProfileImages(site) {
      // TODO: check whether this binds properly

      // Contact image server for divers' profile images
      site.dives.forEach((dive) => {
        dsimg.getUserProfileImage(dive.diver.id)
        .then((response) => {
          if (response.data) {
            // We're expecting a JSON object containing at least {image: {public_id: String}}
            if (response.data && response.data.image && response.data.image.public_id) {
              dive.diver.profileImageUrl = $.cloudinary.url(response.data.image.public_id, {
                height: 60,
                width: 60,
                crop: 'fill',
                gravity: 'face',
              });
            }
          }
        });
      });
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function getNearbySlipways(site) {
      // Contact API server for nearby slipways
      return dsapi.getNearbySlipways(site.id)
      .then((response) => {
        return response.data.map((slipway) => {
          const s = slipway;

          // Global 'haversine' variable
          s.distanceFromDivesite = haversine(
            { latitude: site.latitude, longitude: site.longitude },
            { latitude: slipway.latitude, longitude: slipway.longitude }
          );
          return s;
        });
      });
    }

    function getDivesiteHeaderImage(id) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers

      // Contact image server for header image
      return dsimg.getDivesiteHeaderImage(id)
      .then((response) => {
        if (response.data && response.data.image && response.data.image.public_id) {
          const public_id = response.data.image.public_id;
          const headerImageUrl = $.cloudinary.url(public_id, {
          });
          return headerImageUrl;
        }
      });
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function getCompressorImages(site) {
      // Contact image server for compressor images
      return dsimg.getCompressorImages(site.id)
      .then((response) => {
        const images = response.data;
        // This could be an empty response with a 204, so we need to check
        // that there's content in the response body
        if (images) {
          images.forEach((image) => {
            image.image.transformedUrl = $.cloudinary.url(image.image.public_id, {
              height: 80,
              width: 80,
              crop: 'fill',
            });
          });
          return images;
        }
      });
    }

    function getDivesiteImages(site) {
      // Contact image server for divesite images
      return dsimg.getDivesiteImages(site.id)
      .then((response) => {
        const images = response.data;
        // This could be an empty response with a 204, so we need to check
        // that there's content in the response body
        if (images) {
          images.forEach((image) => {
            image.image.transformedUrl = $.cloudinary.url(image.image.public_id, {
              height: 80,
              width: 80,
              crop: 'fill',
            });
          });
          return images;
        }
      });
    }

    function getSiteImages(site) {
      return dsimg.getSiteImages(site)
      .then((response) => {
        const images = response.data;
        // This could be an empty response with a 204, so we need to check
        // that there's content in the response body
        if (images) {
          images.forEach((image) => {
            image.image.transformedUrl = $.cloudinary.url(image.image.public_id, {
              height: 80,
              width: 80,
              crop: 'fill',
            });
          });
          return images;
        }
      });
    }

    function getSlipwayImages(site) {
      // Contact image server for slipway images
      return dsimg.getSlipwayImages(site.id)
      .then((response) => {
        const images = response.data;
        // This could be an empty response with a 204, so we need to check
        // that there's content in the response body
        if (images) {
          images.forEach((image) => {
            image.image.transformedUrl = $.cloudinary.url(image.image.public_id, {
              height: 80,
              width: 80,
              crop: 'fill',
            });
          });
          return images;
        }
      });
    }

    function toggleOpened(element) {
      return (e) => {
        // toggle between 'opened' and 'closed' on the main card body
        element.find('.information-card').toggleClass('opened');
      };
    }

    function userIsOwner(site) {
      const fn = () => localStorageService.get('user') === site.owner.id;
      return fn;
    }
  }

  informationCardService.$inject = [
    '$uibModal',
    'dsapi',
    'dsimg',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').factory('informationCardService', informationCardService);
})();
