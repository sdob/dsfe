(function() {
  'use strict';
  function EditProfileController($location, $scope, $uibModal, confirmModalService, dsapi, dsimg, localStorageService, profileService) {
    const { summonConfirmModal } = confirmModalService;
    const vm = this;
    activate();

    function activate() {
      // Set bindable values
      vm.cancel = cancel;
      vm.isSaving = false;
      vm.saveProfile = saveProfile;

      const userId = localStorageService.get('user');
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
      });
    }

    function cancel() {
      // Check whether the form has been changed and summon a confirmation
      // modal
      if ($scope.editForm.$dirty) {
        const instance = summonConfirmModal({
          templateUrl: 'profile/cancel-edit-profile-modal.template.html',
        });
        instance.result.then((reason) => {
          if (reason === 'confirmed') {
            $location.path(`/users/${vm.user.id}`);
          }
        });
      } else {
        $location.path(`/users/${vm.user.id}`);
      }
    }

    function saveProfile() {
      vm.isSaving = true;
      console.log(vm.user);
      dsapi.updateProfile(profileService.formatRequestData(vm.user))
      .then((response) => {
        vm.isSaving = false;
        console.log(response.data);
        $location.path(`/users/${vm.user.id}`);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }

  EditProfileController.$inject = [
    '$location',
    '$scope',
    '$uibModal',
    'confirmModalService',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('EditProfileController', EditProfileController);
})();
