// jscs: disable requireCamelCaseOrUpperCaseIdentifiers
(function() {
  'use strict';
  function profileService() {
    return {
      formatResponseData,
    };

    // Convert snake-cased fields to camelCased fields
    function formatResponseData(data) {
      const obj = Object.assign({}, data);
      obj.aboutMe = obj.about_me;
      delete obj.about_me;
      return obj;
    }
  }

  angular.module('divesites').factory('profileService', profileService);
})();
