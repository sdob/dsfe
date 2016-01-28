// jscs: disable requireCamelCaseOrUpperCaseIdentifiers
(function() {
  'use strict';
  function profileService(dsapi) {
    let ownProfile; // cache the user's profile information here
    return {
      formatRequestData,
      formatResponseData,
      getUserProfile,
    };

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
  ];
  angular.module('divesites.profile').factory('profileService', profileService);
})();
