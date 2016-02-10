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
      $element.find(`#js-search-menu, #js-filter-menu, #js-add-something-menu`).removeClass('selected');
    }

    function selectSubmenu(submenuID) {
      // Remember whether this submenu was selected at the start
      const submenuWasSelected = $element.find(submenuID).hasClass('selected');
      console.log(`selecting ${submenuID}`);
      // Deselect all submenus (easier than maintaining a reference
      // to the selected menu
      deselectAll();
      // If the submenu *wasn't* selected when it was clicked on,
      // it should be selected
      if (!submenuWasSelected) {
        $element.find(submenuID).addClass('selected');
      }
    }

    function toggleOpened() {
      console.log('hamburger menu toggling');
      $element.find('#js-hamburger-menu').toggleClass('opened');
      deselectAll();
    }
  }

  HamburgerMenuController.$inject = [
    '$auth',
    '$element',
  ];
  angular.module('divesites.hamburgerMenu').controller('HamburgerMenuController', HamburgerMenuController);
})();
