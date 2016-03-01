(function() {
  'use strict';

  function modalService($uibModalStack) {
    return {
      dismiss,
    };

    function dismiss() {
      const top = $uibModalStack.getTop();
      if (top) {
        $uibModalStack.dismiss(top.key);
      }
    }
  }

  modalService.$inject = [
    '$uibModalStack',
  ];
  angular.module('divesites').factory('modalService', modalService);
})();
