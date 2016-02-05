(function() {
  'use strict';
  function profileDirective() {
    return {
      templateUrl: 'profile/profile.html',
      restrict: 'E',
      controllerAs: 'vm',
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
