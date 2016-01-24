(function() {
  'use strict';
  function ProfileHeaderController($scope, $uibModal, dsimg) {
    const vm = this;
    activate();

    function activate() {
      vm.dsimgHasResponded = false;
      vm.summonProfileImageUploadModal = summonImageUploadModal;
      console.log('ProfileHeaderController.activate()');

      // TODO: get this into scope more elegantly
      vm.userId = $scope.$parent.userId;
      console.log(vm.userId);

      dsimg.getUserProfileImage(vm.userId)
      .then((response) => {
        // We've received a response, so remove the spinner
        vm.dsimgHasResponded = true;

        // Format image URL
        const cloudinaryIdKey = 'public_id';
        const url = $.cloudinary.url(response.data.image[cloudinaryIdKey], {
          width: 318,
          height: 318,
          crop: 'fill',
        });
        vm.profileImageUrl = url;
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
    'dsimg',
  ];
  angular.module('divesites').controller('ProfileHeaderController', ProfileHeaderController);
})();
