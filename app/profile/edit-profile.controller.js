(function() {
  'use strict';
  function EditProfileController($location, $scope, $uibModal, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    function activate() {
      vm.cancel = cancel;
      vm.saveNewPassword = saveNewPassword;
      vm.saveProfile = saveProfile;
      vm.cancelEditingPassword = cancelEditingPassword;
      vm.startEditingPassword = startEditingPassword;

      const userId = localStorageService.get('user');
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
        console.log(vm.user);
      });
    }

    function cancel() {
      if ($scope.editForm.$dirty) {
        const instance = $uibModal.open({
          templateUrl: 'profile/cancel-edit-profile-modal.html',
          controller: 'CancelEditProfileModalController',
          controllerAs: 'vm',
        });
        instance.result.then((reason) => {
          if (reason === 'perform-cancel') {
            $location.path('/me');
          }
        });
      } else {
        $location.path('/me');
      }
    }

    function cancelEditingPassword() {
      vm.isEditingPassword = false;
      delete vm.newPassword1;
      delete vm.newPassword2;
    }

    function saveNewPassword() {
      console.log('saving new password');
      vm.isEditingPassword = false;
    }

    function saveProfile() {
      console.log(vm.user);
      dsapi.updateProfile(profileService.formatRequestData(vm.user))
      .then((response) => {
        console.log(response.data);
        $location.path('/me');
      })
      .catch((err) => {
        console.error(err);
      });
    }

    function startEditingPassword() {
      vm.isEditingPassword = true;
    }
  }

  EditProfileController.$inject = [
    '$location',
    '$scope',
    '$uibModal',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('EditProfileController', EditProfileController);
})();
