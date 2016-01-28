(function() {
  'use strict';
  function ProfileHeaderController($scope, $uibModal, dsapi, dsimg) {
    const vm = this;
    activate();

    function activate() {
      vm.dsimgHasResponded = false;
      vm.summonProfileImageUploadModal = summonImageUploadModal;
      console.log('ProfileHeaderController.activate()');
      console.log($scope);

      $scope.$on('profile-data-loaded', (evt, user) => {
        dsimg.getUserProfileImage(user.id)
        .then((response) => {
          vm.dsimgHasResponded = true;
          // Format image URL
          const cloudinaryIdKey = 'public_id';
          const url = $.cloudinary.url(response.data.image[cloudinaryIdKey], {
            width: 318,
            height: 318,
            crop: 'fill',
          });
          vm.profileImageUrl = url;
        })
        .catch((err) => {
          vm.dsimgHasResponded = true;
        });
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
    '$uibModal',
    'dsapi',
    'dsimg',
  ];
  angular.module('divesites.profile').controller('ProfileHeaderController', ProfileHeaderController);
})();
