(function() {
  'use strict';
  function DeleteProfileImageModalController($scope, $timeout, $uibModalInstance, dsimg, user) {
    const vm = this;
    activate();

    function activate() {
      vm.cancel = cancel;
      vm.delete = deleteProfileImage;
      console.log($scope);
      console.log(user);
    }

    function cancel() {
      $uibModalInstance.close('cancelled');
    }

    function deleteProfileImage() {
      vm.isDeleting = true;
      dsimg.deleteProfileImage(user.id)
      .then((response) => {
        $timeout(() => {
          $uibModalInstance.close('deleted');
        }, 1000);
      })
      .catch((err) => {
        console.log('i fucked up deleting');
        console.log(err);
      });
    }
  }

  DeleteProfileImageModalController.$inject = [
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'dsimg',
    'user',
  ];
  angular.module('divesites.profile').controller('DeleteProfileImageModalController', DeleteProfileImageModalController);
})();
