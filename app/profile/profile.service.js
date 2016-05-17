// jscs: disable requireCamelCaseOrUpperCaseIdentifiers
(function() {
  'use strict';
  function profileService(dsapi, logDiveService) {
    let ownProfile; // cache the user's profile information here
    return {
      clear,
      editDive,
      formatRequestData,
      formatResponseData,
      formatUserProfileImagesAdded,
      formatUserProfilePlacesAdded,
      getUserProfile,
    };

    function clear() {
      ownProfile = undefined;
    }

    function editDive(dive) {
      // We need to retrieve the divesite details first
      return dsapi.getDivesite(dive.divesite.id)
      .then((response) => {
        const site = response.data;
        const instance = logDiveService.summonLogDiveModal(dive, site);
        console.log('editDive instance');
        console.log(instance);
        return instance.result;
      });
    }

    // Convert snake-cased fields to camelCased fields
    function formatResponseData(data) {
      const obj = Object.assign({}, data);
      obj.aboutMe = obj.about_me;
      delete obj.about_me;
      return obj;
    }

    // Convert camelCased fields to snake-cased fields
    function formatRequestData(data) {
      const obj = Object.assign({}, data);
      obj.about_me = obj.aboutMe;
      delete obj.aboutMe;
      return obj;
    }

    function formatUserProfileImagesAdded(response) {
      const images = response.data;
      images.forEach((i) => {
        i.url = $.cloudinary.url(i.public_id);
        let apiCall;
        const id = i.object_id;
        if (i.content_type_model === 'divesite') {
          apiCall = dsapi.getDivesite;
        } else if (i.content_type_model === 'slipway') {
          apiCall = dsapi.getSlipway;
        } else if (i.content_type_model === 'compressor') {
          apiCall = dsapi.getCompressor;
        }

        if (!(apiCall && id)) {
          console.error(`Expected a content_type_model and object_id for an image but didn't find one`);
          console.error(i);
          return;
        }

        return apiCall(id)
        .then((data) => {
          i.site = {
            id: data.id,
            name: data.name,
            type: i.content_type_model,
          };
        });
      });

      return images;
    }

    function formatUserProfilePlacesAdded(user) {
      const divesites = user.divesites || [];
      const compressors = user.compressors || [];
      const slipways = user.slipways || [];
      return [].concat(
        divesites.map((x) => Object.assign({ type: 'divesite' }, x))
      )
      .concat(
        compressors.map((x) => Object.assign({ type: 'compressor' }, x))
      )
      .concat(
        slipways.map((x) => Object.assign({ type: 'slipway' }, x))
      );
    }

    function getUserProfile(id) {
      if (id === undefined) {
        return new Promise((resolve, reject) => {
          if (ownProfile) {
            resolve(ownProfile);
          }

          dsapi.getOwnProfile()
          .then((response) => {
            console.log('profileService loaded user data');
            ownProfile = response.data;
            resolve(ownProfile);
          })
          .catch((err) => {
            reject(err);
          });
        });
      }

      // If we were given an ID
      return new Promise((resolve, reject) => {
        dsapi.getUser(id)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
      });
    }
  }

  profileService.$inject = [
    'dsapi',
    'logDiveService',
  ];
  angular.module('divesites.profile').factory('profileService', profileService);
})();
