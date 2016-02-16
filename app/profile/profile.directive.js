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
      // Enable tab functionality
      $('#js-tab-menu a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
      });
    }
  }

  angular.module('divesites.profile').directive('profile', profileDirective);
})();
