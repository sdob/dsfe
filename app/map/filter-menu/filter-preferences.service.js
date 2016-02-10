(function() {
  'use strict';
  function FilterPreferencesService($rootScope, localStorageService) {
    const MAX_DEPTH = 100;
    const vm = this;

    const defaults = {

      // Divesites
      boatEntry: true,
      shoreEntry: true,
      maximumDepth: MAX_DEPTH,
      maximumLevel: '2',

      // Categories
      divesites: true,
      compressors: true,
      slipways: true,
    };

    const get = () => {
      return this.preferences;
    };

    // Set defaults to show everything initially
    vm.preferences = {
      boatEntry: defaults.boatEntry,
      maximumDepth: defaults.maximumDepth,
      maximumLevel: defaults.maximumLevel,
      shoreEntry: defaults.shoreEntry,
      divesites: defaults.divesites,
      compressors: defaults.compressors,
      slipways: defaults.slipways,
    };

    const set = (key, value) => {
      vm.preferences[key] = value;
      localStorageService.set(key, value);
      $rootScope.$broadcast('filter-preferences', vm.preferences);
    };

    const validateBoolean = (value) => value === true || value === false;

    const validators = {
      boatEntry: (value) => {
        return value === true || value === false;
      },

      shoreEntry: (value) => {
        return value === true || value === false;
      },

      maximumDepth: (value) => {
        return value >= 0 && value <= 100;
      },

      maximumLevel: (value) => {
        return value === '0' || value === '1' || value === '2';
      },

      divesites: validateBoolean,
      compressors: validateBoolean,
      slipways: validateBoolean,
    };

    initialize();
    return {
      get,
      preferences: vm.preferences,
      set,
    };

    function initialize() {

      // For each key, try to find a valid entry in localStorage. If we find
      // one, then set it to preferences (otherwise use the defaults); otherwise,
      // set a valid preference.
      const keys = [
        'boatEntry',
        'compressors',
        'maximumDepth',
        'maximumLevel',
        'shoreEntry',
        'slipways',
      ];
      keys.forEach((k) => {

        // Look for any entry
        if (localStorageService.keys().indexOf(k) > -1) {
          const storedValue = localStorageService.get(k);

          // Validate it and set it if valid
          if (validators[k](storedValue)) {
            vm.preferences[k] = storedValue;
          }

          // Either way, set the localStorage key to something valid
          localStorageService.set(k, vm.preferences[k]);
        }
      });
    }
  }

  FilterPreferencesService.$inject = ['$rootScope', 'localStorageService'];
  angular.module('divesites.filterMenu').factory('filterPreferences', FilterPreferencesService);
})();
