(function () {
  'use strict';

  function AddSite() {
    return {
      templateUrl: 'views/add-site.html',
      restrict: 'E',
      link: (scope, elem, attrs, ctrl) => {
        console.log('addSite.link()');
      },
    };
  }

  AddSite.$inject = [];

  angular.module('divesites').directive('addSite', AddSite);
})();
