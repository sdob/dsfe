(function () {
  'use strict';
  function ShowFullSizeImageController($scope, $uibModalInstance, dsapi, dsimg, image) {
    const vm = this;
    activate();

    function activate() {
      vm.dismiss = dismiss;
      $scope.image = image;
      console.log($scope.image);
      // Get the uploader's details from the API
      dsapi.getUser($scope.image.ownerID)
      .then((response) => {
        vm.user = response.data;
        console.log(vm.user);
      })
      .then(() => dsimg.getUserProfileImage(vm.user.id))
      .then((response) => {
        console.log(response.data);
      });

    }

    function dismiss() {
      $uibModalInstance.close();
    }
  }

  ShowFullSizeImageController.$inject = [
    '$scope',
    '$uibModalInstance',
    'dsapi',
    'dsimg',
    'image',
  ];
  angular.module('divesites').controller('ShowFullSizeImageController', ShowFullSizeImageController);
})();
