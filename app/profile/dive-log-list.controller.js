(function() {
  'use strict';

  function DiveLogListController($uibModal) {
    console.log('DiveLogListController.activate()');
    const vm = this;
    activate();

    function activate() {
      vm.summonDiveLogModal = summonDiveLogModal;
    }

    function summonDiveLogModal() {
    }
  }

  DiveLogListController.$inject = [
    '$uibModal',
  ];
  angular.module('divesites.profile').controller('DiveLogListController', DiveLogListController);
})();
