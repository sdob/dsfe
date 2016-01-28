(function() {
  'use strict';
  function modalMask() {
    return {
      templateUrl: 'widgets/modal-mask.html',
    };
  }

  angular.module('divesites.widgets').directive('modalMask', modalMask);
})();
