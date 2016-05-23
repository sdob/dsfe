(function() {
  'use strict';
  function ProfileImageUploadController($scope, $uibModalInstance, Upload, dsimg, user) {
    const vm = this;

    vm.cancelUpload = cancelUpload;
    vm.submit = submit;
    vm.user = user;

    activate();

    /*
     * Activation-time code
     */
    function activate() {
    }

    /*
     * Cancel uploading a file (not implemented yet in the UI)
     */
    function cancelUpload() {
      // Close the modal instance
      // TODO: check whether a file has been previewed or is in mid-upload
      // and handle confirm/cancel accordingly
      $uibModalInstance.close();
    }

    /*
     * Upload the file, and on success close the modal, sending back the CLoudinary
     * public_id for the new file
     */
    function submit(file) {
      // Disable the upload button
      vm.isSaving = true;

      // Upload the file
      file.upload = Upload.upload({
        data: { image: file },
        url: `${dsimg.API_URL}/users/${user.id}/profile_image/`,
      })
      .then((response) => {
        // Update the UI flag
        vm.isSaving = false;
        // Close the modal, sending the public_id as part of the reason
        $uibModalInstance.close({
          reason: 'uploaded',
          public_id: response.data.public_id,
        });
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
