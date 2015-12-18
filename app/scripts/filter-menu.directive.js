(function () {
  'use strict';
  function FilterMenu() {
    return {
      templateUrl: 'views/filter-menu.html',
      restrict: 'EA',
      controller: 'FilterMenuController',
      controllerAs: 'fmvm',
      link: (scope, elem, attrs, ctrl) => {
        angular.element(elem).ready(() => {
          const prefs = ctrl.preferences;
          // Set the filter menu states before MDL
          // handles them
          $('#filter-menu-boatEntry').prop('checked', prefs.boatEntry);
          $('#filter-menu-shoreEntry').prop('checked', prefs.shoreEntry);
          $(`#filter-menu-maximumLevel-${prefs.maximumLevel}`)
          .prop('checked', true);

          // Apply MDL behaviours
          componentHandler.upgradeAllRegistered();
          // Put the depth slider into the correct position
          document
          .querySelector('.filter-menu .mdl-slider')
          .MaterialSlider
          .change(ctrl.preferences.maximumDepth);
        });
      },
    };
  }
  angular.module('divesites').directive('filterMenu', FilterMenu);
})();
