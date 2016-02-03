(function() {
  'use strict';
  function modalMask() {
    return {
      controller: function() {
        console.log('modalMask controller');
      },

      link,

      templateUrl: 'widgets/modal-mask.html',
    };

    function link(scope, element, attrs) {
      console.log('modal mask!');
      scope.message = attrs.message;
    }
  }

  angular.module('divesites.widgets').directive('modalMask', modalMask);
})();
