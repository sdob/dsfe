(function() {
  'use strict';

  function userSettingsService(localStorageService) {

    const defaults = {
      units: 'si',
    };

    return {
      getUserSettings,
    };

    function getUserSettings() {
      // If there are no user settings in local storage, put defaults in there
      if (!localStorageService.get('userSettings')) {
        localStorageService.set('userSettings', defaults);
      }

      // Return settings
      return localStorageService.get('userSettings');
    }
  }

  userSettingsService.$inject = [
    'localStorageService',
  ];
  angular.module('divesites.userSettings').factory('userSettingsService', userSettingsService);
})();
