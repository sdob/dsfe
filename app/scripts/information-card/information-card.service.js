(function() {
  'use strict';
  function informationCardService(dsapi, dsimg, localStorageService) {

    const apiCalls = {
      'slipway': {
        apiCall: (id) => {
          return dsapi.getSlipway(id);
        },
        directiveString: '<slipway-information-card>',
      },

      'default': {
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
      getDivesiteHeaderImage,
      getDivesiteImages,
      getNearbySlipways,
      showFullSizeImage,
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

    function formatGeocodingData(site) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
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
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function getDiverProfileImages(site) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
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

    function getDivesiteHeaderImage(site) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers

      // Contact image server for header image
      return dsimg.getDivesiteHeaderImage(site.id)
      .then((response) => {
        if (response.data && response.data.image && response.data.image.public_id) {
          const public_id = response.data.image.public_id;
          const headerImageUrl = $.cloudinary.url(public_id, {
          });
          return headerImageUrl;
        }
      });
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function getDivesiteImages(site) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
      // Contact image server for divesite images
      return dsimg.getDivesiteImages(site.id)
      .then((response) => {
        //vm.site.images = response.data.map((item) => item.image);
        const images = response.data;
        images.forEach((image) => {
          image.transformedUrl = $.cloudinary.url(image.image.public_id, {
            height: 60,
            width: 60,
            crop: 'fill',
          });
        });
        return images;
      });
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    // Show a full-size version of the image in a modal
    function showFullSizeImage(img) {
      $uibModal.open({
        controller: 'ShowFullSizeImageController',
        controllerAs: 'vm',
        resolve: {
          image: () => img,
        },
        templateUrl: 'views/show-full-size-image.html',
        windowClass: 'show-full-size-image',
        size: 'lg',
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
    'dsapi',
    'dsimg',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').factory('informationCardService', informationCardService);
})();
