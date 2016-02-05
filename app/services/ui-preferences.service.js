(function() {
  'use strict';
  function uiPreferencesService(localStorageService) {

    return {
      get,
    };

    function get() {
      const defaults = {
        clock: '24hr',
      };
      const preferences = localStorageService.get('preferences') || defaults;
      return preferences;
    }
  }

  uiPreferencesService.$inject = [
    'localStorageService',
  ];
  angular.module('divesites.services').factory('uiPreferencesService', uiPreferencesService);
})();
