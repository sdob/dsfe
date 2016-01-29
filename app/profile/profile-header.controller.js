(function() {
  'use strict';
  function ProfileHeaderController($scope, $timeout, $uibModal, dsapi, dsimg, profileService) {
    const vm = this;
    activate();

    function activate() {
      vm.dsimgHasResponded = false;
      vm.summonProfileImageUploadModal = summonImageUploadModal;

      const userId = $scope.userId;
      console.log(userId);
      // Retrieve the user profile
      profileService.getUserProfile(userId)
      .then((profile) => {
        console.log('profileheadercontroller got user profile');
        // Put profile data into scope
        $scope.user = profileService.formatResponseData(profile);
        // Look for a profile image
        return dsimg.getUserProfileImage(profile.id);
      })
      .then((response) => {
        // If we get a successful response, use it
        console.log('then from dsimg');
        vm.dsimgHasResponded = true;
        const cloudinaryIdKey = 'public_id';
        const url = $.cloudinary.url(response.data.image[cloudinaryIdKey], {
          width: 318,
          height: 318,
          crop: 'fill',
        });
        vm.profileImageUrl = url;
      })
      .catch((err) => {
        // On failure (including 404) jus tmake sure that
        // the UI is clean
        console.log('catch from dsimg');
        $timeout(() => {
          vm.dsimgHasResponded = true;
        }, 0);
      });
    }

    function summonImageUploadModal() {
      // Summon a modal dialog to allow the user to upload a new image
      const instance = $uibModal.open({
        templateUrl: 'views/upload-profile-image-modal.html',
        controller: 'ProfileImageUploadController',
        controllerAs: 'vm',
        resolve: {
          user: () => $scope.user,
        },
      });
    }
  }

  ProfileHeaderController.$inject = [
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'dsimg',
    'profileService',
  ];
  angular.module('divesites.profile').controller('ProfileHeaderController', ProfileHeaderController);
})();
