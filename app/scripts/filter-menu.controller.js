(function () {
  'use strict';
  function FilterMenuController($scope, filterPreferences) {
    const self = this;
    self.updatePreferences = updatePreferences;

    activate();

    function activate() {
      self.preferences = filterPreferences.preferences;
      self.updatePreferences();
    }

    function updatePreferences () {
      Object.keys(self.preferences).forEach((k) => {
        filterPreferences.set(k, self.preferences[k]);
      });
    }
  }

  FilterMenuController.$inject = ['$scope', 'filterPreferences'];
  angular.module('divesites').controller('FilterMenuController', FilterMenuController);
})();
