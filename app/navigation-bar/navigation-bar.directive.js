(function() {
  'use strict';
  function NavigationBar() {
    return {
      controller: 'NavigationBarController',
      controllerAs: 'nbvm',
      link,
      templateUrl: 'navigation-bar/navigation-bar.template.html',
    };

    function link() {
      // Collapse navigation bar dropdown when one of its items is clicked; see
      // http://stackoverflow.com/questions/21203111/bootstrap-3-collapsed-menu-doesnt-close-on-click
      $(document).on('click', '.navbar-collapse.in', function(e) {
        if ($(e.target).is('a') && $(e.target).attr('class') !== 'dropdown-toggle') {
          $(this).collapse('hide');
        }
      });
    }
  }

  angular.module('divesites.navigationBar').directive('navigationBar', NavigationBar);
})();
