(function() {
  'use strict';
  function FilterMenu() {
    return {
      templateUrl: 'map/filter-menu/filter-menu.template.html',
      restrict: 'EA',
      controller: 'FilterMenuController',
      controllerAs: 'fmvm',
      link,
    };

    function link(scope, element, attrs, ctrl) {
      angular.element(element).ready(() => {
        const prefs = ctrl.preferences;
        const slider = angular.element('#js-information-card__depth-range-slider').slider({
          tooltip: 'hide',
        });
        slider.slider('setValue', parseInt(ctrl.preferences.maximumDepth));
      });
      element.find('.floating-menu__header').on('click', toggleOpened);

      // Clean up
      element.on('$destroy', () => {
        element.find('.floating-menu__header').off('click', toggleOpened);
      });

      function toggleOpened(e) {
        $('.filter-menu').toggleClass('open');
        const slider  = angular.element('#js-information-card__depth-range-slider');
        slider.slider('relayout');
      }
    }

  }

  angular.module('divesites.filterMenu').directive('filterMenu', FilterMenu);
})();
