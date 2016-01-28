(function() {
  'use strict';
  function EditProfileController($location, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    function activate() {
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
        $location.path('/users/me');
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
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('EditProfileController', EditProfileController);
})();
