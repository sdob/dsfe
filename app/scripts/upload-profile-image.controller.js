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
      .then(() => {
        // Check the image server for the new Cloudinary public ID
        return dsimg.getUserProfileImage(vm.user.id);
      })
      .then((response) => {
        // Return us to the profile view, closing the modal instance
        // on the way
        vm.isSaving = false;

        // Generate the new profile image URL
        const idKey = 'public_id';
        const url = $.cloudinary.url(response.data.image[idKey], {
          width: 318,
          height: 318,
          crop: 'fill',
        });

        // Assign it to the model
        vm.user.profileImageUrl = url;

        // Close the modal
        $uibModalInstance.close();
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
  angular.module('divesites').controller('ProfileImageUploadController', ProfileImageUploadController);
})();
