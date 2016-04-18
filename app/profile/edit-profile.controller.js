(function() {
  'use strict';
  function EditProfileController($location, $scope, $uibModal, dsapi, dsimg, localStorageService, profileService) {
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
        const instance = $uibModal.open({
          templateUrl: 'profile/cancel-edit-profile-modal.template.html',
          controller: 'CancelEditProfileModalController',
          controllerAs: 'vm',
        });
        instance.result.then((reason) => {
          if (reason === 'perform-cancel') {
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
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('EditProfileController', EditProfileController);
})();
