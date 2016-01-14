(function () {
  'use strict';
  function uiPreferencesService(localStorageService) {


    initialize();

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

    function initialize() {
    }
  }
  uiPreferencesService.$inject = [
    'localStorageService',
  ];
  angular.module('divesites').factory('uiPreferencesService', uiPreferencesService);
})();
