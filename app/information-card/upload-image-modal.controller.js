(function() {
  'use strict';

  function UploadImageModalController($uibModalInstance, site) {
    const vm = this;
    activate();

    function activate() {
      vm.site = site;
      vm.submit = submit;
    }

    function submit() {
    }
  }

  UploadImageModalController.$inject = [
    '$uibModalInstance',
    'site',
  ];
  angular.module('divesites.informationCard').controller('UploadImageModalController', UploadImageModalController);
})();
