(function() {
  'use strict';
  function ProfileHeaderController($scope, $timeout, $uibModal, dsapi, dsimg, profileService) {
    const cloudinaryIdKey = 'public_id';
    const vm = this;
    activate();

    function activate() {
      vm.dsimgHasResponded = false;
      vm.summonProfileImageUploadModal = summonImageUploadModal;

      $timeout(() => {
        console.log('editable?');
        console.log($scope);
        console.log($scope.editable);
      });

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
        const url = $.cloudinary.url(response.data.image[cloudinaryIdKey], {
          width: 318,
          height: 318,
          crop: 'fill',
        });
        // Push this into the next tick
        $timeout(() => {
          vm.profileImageUrl = url;
          vm.dsimgHasResponded = true;
        }, 0);
      })
      .catch((err) => {
        // On failure (including 404) jus tmake sure that
        // the UI is clean
        console.log('catch from dsimg');
        console.log(err);
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
      instance.result.then((reason) => {
        console.log(`modal dismissed with reason: ${reason}`);
        if (reason === 'uploaded') {
          dsimg.getUserProfileImage($scope.user.id)
          .then((response) => {
            console.log('received response from dsimg');
            console.log(response.data);
            const url = formatHeroImageUrl(response);
            $timeout(() => {
              console.log('updating vm.profileImageUrl');
              console.log(url);
              vm.profileImageUrl = url;
            }, 0);
          })
          .catch((err) => {
            console.error(`this shouldn't happen - we've uploaded an image`);
          });
        }
      });
    }

    function formatHeroImageUrl(response) {
      const url = $.cloudinary.url(response.data.image[cloudinaryIdKey], {
        width: 318,
        height: 318,
        crop: 'fill',
      });
      console.log('formatted hero image:');
      console.log(url);
      return url;
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
