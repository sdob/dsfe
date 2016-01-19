(function() {
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
          const slider = angular.element('#js-information-card__depth-range-slider').slider({
            tooltip: 'hide',
          });
          slider.slider('setValue', parseInt(ctrl.preferences.maximumDepth));
        });
      },
    };
  }

  angular.module('divesites').directive('filterMenu', FilterMenu);
})();
