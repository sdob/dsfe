(function () {
  'use strict';
  function ProfileImageUploadController($scope, $uibModalInstance, Upload, dsimg, user) { const vm = this;
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
        data: {image: file},
        url: dsimg.IMG_API_URL + '/set_profile_image/',
      })
      // Check the image server for the new Cloudinary public ID
      .then(() => {
        return dsimg.getUserProfileImage(vm.user.id);
      })
      // Return us to the profile view, closing the modal instance
      // on the way
      .then((response) => {
        // We're no longer saving
        vm.isSaving = false;
        // Generate the new profile image URL
        const url = $.cloudinary.url(response.data.image.public_id, {
          width: 318,
          height: 318,
          crop: "fill",
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
