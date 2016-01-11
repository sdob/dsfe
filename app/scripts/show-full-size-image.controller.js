(function () {
  'use strict';
  function ShowFullSizeImageController($scope, $uibModalInstance, image) {
    const vm = this;
    activate();

    function activate() {
      vm.dismiss = dismiss;
      $scope.image = image;
    }

    function dismiss() {
      $uibModalInstance.close();
    }
  }

  ShowFullSizeImageController.$inject = [
    '$scope',
    '$uibModalInstance',
    'image',
  ];
  angular.module('divesites').controller('ShowFullSizeImageController', ShowFullSizeImageController);
})();
