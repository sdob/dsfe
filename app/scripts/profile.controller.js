(function() {
  'use strict';
  function ProfileController($routeParams, dsapi, dsimg) {
    const vm = this;
    activate();

    function activate() {
      // Get the user's ID
      const userId = parseInt($routeParams.userId);

      // Get this user's profile information from the API server
      dsapi.getUser(userId)

      // Query the image server for a profile image for this user
      .then((response) => {
        console.log(response);
        vm.user = response.data;
        return dsimg.getUserProfileImage(userId);
      })
      .then((response) => {
        const cloudinaryIdKey = 'public_id';
        const url = $.cloudinary.url(response.data.image[cloudinaryIdKey], {
          width: 318,
          height: 318,
          crop: 'fill',
        });
        vm.user.profileImageUrl = url;
      });
    }
  }

  ProfileController.$inject = [
    '$routeParams',
    'dsapi',
    'dsimg',
  ];
  angular.module('divesites').controller('ProfileController', ProfileController);
})();
