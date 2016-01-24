(function() {
  'use strict';
  function OwnProfileController($scope, $uibModal, cloudinaryTransformation, dsapi, dsimg, profileService) {
    const vm = this;
    activate();

    function activate() {
      console.log('OwnProfileController.activate()');
      vm.editable = true; // editing own profile
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);

        // Hit the image server for this user's profile image
        return dsimg.getUserProfileImage(vm.user.id);
      })
      .then((response) => {
        // If we get a meaningful response from the image server,
        // generate a URL for the profile image
        console.log('op: dsimg has responded');
        $scope.dsimgHasResponded = true;
        const cloudinaryIdKey = 'public_id';
        if (response.data && response.data.image && response.data.image[cloudinaryIdKey]) {
          const publicID = response.data.image[cloudinaryIdKey];
          const url = $.cloudinary.url(publicID, {
            width: 318,
            height: 318,
            crop: 'fill',
          });
          vm.user.profileImageUrl = url;
        }
      });
    }
  }

  OwnProfileController.$inject = [
    '$scope',
    '$uibModal',
    'cloudinaryTransformation',
    'dsapi',
    'dsimg',
    'profileService',
  ];
  angular.module('divesites').controller('OwnProfileController', OwnProfileController);
})();
