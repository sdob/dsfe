(function() {
  'use strict';
  function profileDirective() {
    return {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: 'profile/profile.template.html',
      restrict: 'E',
      link,
    };

    function link(scope, elem, attrs, controller) {
      // Handle whether the user is viewing the feed tab
      // or not
      const selector = 'a[data-target="#js-profile-feed-tab"]';
      $(selector).on('show.bs.tab', () => {
        console.log('showing profile feed');
        scope.$broadcast('show-feed');
      });
      $(selector).on('hide.bs.tab', () => {
        console.log('hiding profile feed');
        scope.$broadcast('hide-feed');
      });
    }
  }

  angular.module('divesites.profile').directive('profile', profileDirective);
})();
