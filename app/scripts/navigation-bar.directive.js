(function() {
  'use strict';
  function NavigationBar() {
    return {
      templateUrl: 'views/navigation-bar.html',
      controller: 'NavigationBarController',
      controllerAs: 'nbvm',
      link: () => {
        // Collapse navigation bar dropdown when one of its items is clicked; see
        // http://stackoverflow.com/questions/21203111/bootstrap-3-collapsed-menu-doesnt-close-on-click
        $(document).on('click', '.navbar-collapse.in', function (e) {
          if ($(e.target).is('a') && $(e.target).attr('class') !== 'dropdown-toggle') {
            $(this).collapse('hide');
          }
        });
      },
    };
  }

  angular.module('divesites').directive('navigationBar', NavigationBar);
})();
