(function() {
  'use strict';
  function modalMask() {
    return {
      link,
      templateUrl: 'widgets/modal-mask.template.html',
    };

    function link(scope, element, attrs) {
      scope.message = attrs.message;
    }
  }

  angular.module('divesites.widgets').directive('modalMask', modalMask);
})();
