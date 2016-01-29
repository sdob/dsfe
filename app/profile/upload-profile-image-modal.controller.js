(function() {
  'use strict';
  function ProfileImageUploadController($scope, $uibModalInstance, Upload, dsimg, user) {
    const vm = this;
    vm.user = user;
    activate();

    function activate() {
      vm.cancelUpload = cancelUpload;
      vm.submit = submit;
    }

    function cancelUpload() {
      // Close the modal instance
      // TODO: check whether a file has been previewed or is in mid-upload
      // and handle confirm/cancel accordingly
      $uibModalInstance.close();
    }

    function submit(file) {
      // Disable the upload button
      vm.isSaving = true;

      // Upload the file
      file.upload = Upload.upload({
        data: { image: file },
        url: `${dsimg.IMG_API_URL}/profile_image/`,
      })
      .then((response) => {
        // Return us to the profile view, closing the modal instance
        // on the way
        vm.isSaving = false;

        // Close the modal
        $uibModalInstance.close('uploaded');
      });
    }
  }

  ProfileImageUploadController.$inject = [
    '$scope',
    '$uibModalInstance',
    'Upload',
    'dsimg',
    'user',
  ];
  angular.module('divesites.profile').controller('ProfileImageUploadController', ProfileImageUploadController);
})();
