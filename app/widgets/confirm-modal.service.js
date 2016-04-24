(function() {
  'use strict';

  function confirmModalService($uibModal) {
    return {
      summonConfirmModal,
    };

    function summonConfirmModal(opts) {
      const defaults = {
        controller: 'ConfirmModalController',
        controllerAs: 'vm',
        size: 'sm',
        windowClass: 'modal-center',
      };
      const mergedOpts = Object.assign(defaults, opts);
      return $uibModal.open(mergedOpts);
    }
  }

  confirmModalService.$inject = [
    '$uibModal',
  ];
  angular.module('divesites.widgets').factory('confirmModalService', confirmModalService);
})();
