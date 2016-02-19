(function() {
  'use strict';
  function ownProfile() {
    return {
      controller: 'OwnProfileController',
      controllerAs: 'vm',
      link,
      templateUrl: 'profile/profile.template.html',
      restrict: 'E',
    };

    function link(scope, elem) {
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

  ownProfile.$inject = [];
  angular.module('divesites.profile').directive('ownProfile', ownProfile);
})();
