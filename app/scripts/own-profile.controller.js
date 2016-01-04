(function () {
  'use strict';
  function OwnProfileController ($uibModal, cloudinaryTransformation, dsapi) {
    const vm = this;
    activate();

    function activate() {
      console.log('OwnProfileController.activate()');
      vm.editable = true; // editing own profile
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = response.data;
        vm.user.profileImage = cloudinaryTransformation.cropSquare(vm.user.profile_image_url, 318);
      });
    }
  }

  OwnProfileController.$inject = ['$uibModal', 'cloudinaryTransformation', 'dsapi'];
  angular.module('divesites').controller('OwnProfileController', OwnProfileController);
})();
