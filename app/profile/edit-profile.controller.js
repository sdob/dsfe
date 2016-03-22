(function() {
  'use strict';
  function EditProfileController($location, $scope, $uibModal, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    function activate() {
      // Set bindable values
      vm.cancel = cancel;
      vm.saveProfile = saveProfile;

      const userId = localStorageService.get('user');
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
      });
    }

    function cancel() {
      if ($scope.editForm.$dirty) {
        const instance = $uibModal.open({
          templateUrl: 'profile/cancel-edit-profile-modal.template.html',
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
