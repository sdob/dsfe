(function() {
  'use strict';
  function ownProfile() {
    return {
      templateUrl: 'views/own-profile.html',
      restrict: 'E',
    };
  }

  ownProfile.$inject = [];
  angular.module('divesites').directive('ownProfile', ownProfile);
})();
