(function() {
  'use strict';

  function HamburgerMenuController($auth, $element) {
    const vm = this;
    activate();

    function activate() {
      console.log('hmc activate');
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.selectSubmenu = selectSubmenu;
      vm.toggleOpened = toggleOpened;
    }

    function deselectAll() {
      $element.find(`.hamburger-menu__icon`).removeClass('selected');
      $element.find(`.hamburger-menu__submenu`).removeClass('selected');
    }

    function selectSubmenu(submenuID) {
      // Remember whether this submenu was selected at the start
      const submenuWasSelected = $element.find(submenuID).hasClass('selected');
      // Deselect all submenus (easier than maintaining a reference
      // to the selected menu
      deselectAll();
      // If the submenu *wasn't* selected when it was clicked on,
      // it should be selected
      if (!submenuWasSelected) {
        console.log(`selecting ${submenuID}`);
        $element.find(submenuID).addClass('selected');
        $element.find(`${submenuID}__content`).addClass('selected');
      }
    }

    function toggleOpened() {
      console.log('hamburger menu toggling');
      $element.find('#js-hamburger-collapsible-menu').toggleClass('opened');
      $element.find('.hamburger-menu__menu-expander').toggleClass('opened');
      deselectAll();
    }
  }

  HamburgerMenuController.$inject = [
    '$auth',
    '$element',
  ];
  angular.module('divesites.hamburgerMenu').controller('HamburgerMenuController', HamburgerMenuController);
})();
