(function () {
  'use strict';
  function FilterPreferencesService ($rootScope, localStorageService) {
    const MAX_DEPTH = 100;
    const self = this;

    const defaults = {
      boatEntry: true,
      shoreEntry: true,
      maximumDepth: MAX_DEPTH,
      maximumLevel: "2",
    };

    const get = () => {
      return this.preferences;
    };

    // Set defaults to show everything initially
    self.preferences = {
      boatEntry: defaults.boatEntry,
      maximumDepth: defaults.maximumDepth,
      maximumLevel: defaults.maximumLevel,
      shoreEntry: defaults.shoreEntry,
    };

    const set = (key, value) => {
      self.preferences[key] = value;
      localStorageService.set(key, value);
      $rootScope.$broadcast('filter-preferences', self.preferences);
    };

    const validators = {
      boatEntry: (value) => {
        return true === value || false === value;
      },
      shoreEntry: (value) => {
        return true === value || false === value;
      },
      maximumDepth: (value) => {
        return value >= 0 && value <= 100;
      },
      maximumLevel: (value) => {
        return value === "0" || value === "1" || value === "2";
      },
    };

    initialize();
    return {
      get,
      preferences: self.preferences,
      set
    };

    function initialize() {
      // For each key, try to find a valid entry in localStorage. If we find
      // one, then set it to preferences (otherwise use the defaults); otherwise,
      // set a valid preference.
      const keys = [
        'boatEntry',
        'maximumDepth',
        'maximumLevel',
        'shoreEntry',
      ];
      keys.forEach((k) => {
        // Look for any entry
        if (localStorageService.keys().indexOf(k) > -1) {
          const storedValue = localStorageService.get(k);
          // Validate it
          if (validators[k](storedValue)) {
            self.preferences[k] = storedValue;
          }
          // Either way, set the localStorage key to something valid
          localStorageService.set(k, self.preferences[k]);
       }
      });
    }
  }

  FilterPreferencesService.$inject = ['$rootScope', 'localStorageService'];
  angular.module('divesites').factory('filterPreferences', FilterPreferencesService);
})();
