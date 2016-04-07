(function() {
  'use strict';

  function profileFeed() {
    return {
      controller: 'ProfileFeedController',
      controllerAs: 'vm',
      link,
      scope: {
        editable: '=',
        user: '=',
      },
      templateUrl: 'profile/profile-feed.template.html',
    };

    function link(scope, elem, attrs, ctrl) {
      console.log(scope);
    }
  }

  profileFeed.$inject = [
  ];
  angular.module('divesites.profile').directive('profileFeed', profileFeed);
})();
