(function() {
  'use strict';

  function confirmCancelService($uibModal) {
    return {
      summonConfirmCancelModal,
    };

    function summonConfirmCancelModal(opts) {
      const defaults = {
        controller: 'ConfirmCancelModalController',
        controllerAs: 'vm',
        size: 'sm',
        windowClass: 'modal-center',
      };
      const mergedOpts = Object.assign(defaults, opts);
      return $uibModal.open(mergedOpts);
    }
  }

  confirmCancelService.$inject = [
    '$uibModal',
  ];
  angular.module('divesites.widgets').factory('confirmCancelService', confirmCancelService);
})();
