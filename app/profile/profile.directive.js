(function() {
  'use strict';
  function profileDirective($location) {
    return {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: 'profile/profile.template.html',
      restrict: 'E',
      link,
    };

    function link(scope, elem, attrs, controller) {
      const validTabs = [
        'feed',
        'dives',
        'places',
        'images',
      ];
      const defaultTab = 'feed';
      // Examine the search path to see which tab we should be displaying;
      // if it matches
      if (validTabs.indexOf($location.$$search.tab) > -1) {
        let whichTab = $location.$$search.tab;
        const selector = `a[data-target="#js-profile-${whichTab}-tab"]`;
        $(selector).tab('show');
      } else {
        // If our requested tab isn't one of the valid tabs, then just
        // show the default (and replace the state so that we lose the
        // bogus tab selection from history
        $location.search('tab', defaultTab).replace();
      }

      // When tab changes, change the 'tabs' parameter in the search path
      validTabs.forEach(tab => {
        const selector = `a[data-target="#js-profile-${tab}-tab"]`;
        console.log(selector);
        $(selector).on('shown.bs.tab', () => {
          // Update the search path so that we can do a history.back()
          // to the correct tab
          $location.search('tab', tab).replace();
        });
      });

      // Handle whether the user is viewing the feed tab
      // or not; this is so that we know whether to allow
      // the infinite scroll to happen
      const selector = 'a[data-target="#js-profile-feed-tab"]';
      $(selector).on('shown.bs.tab', () => {
        console.log('showing profile feed');
        scope.$broadcast('show-feed');
      });
      $(selector).on('hidden.bs.tab', () => {
        console.log('hiding profile feed');
        scope.$broadcast('hide-feed');
      });
    }
  }

  profileDirective.$inject = [
    '$location',
  ];
  angular.module('divesites.profile').directive('profile', profileDirective);
})();
