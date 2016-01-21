(function() {
  'use strict';
  function profileService() {
    return {
      formatResponseData,
    };

    function formatResponseData(data) {
      const obj = Object.assign({}, data);
      // Convert snake-cased fields to camelCased fields
      obj.aboutMe = obj.about_me;
      delete obj.about_me;
      return obj;
    }
  }

  angular.module('divesites').factory('profileService', profileService);
})();
