(function() {
  'use strict';
  function NavigationBarController(
    $auth,
    $document,
    $location,
    $scope,
    $timeout,
    $uibModal,
    dsimg,
    localStorageService,
    profileService
  ) {
    const vm = this;
    // Set bindable values
    vm.isAuthenticated = $auth.isAuthenticated;
    vm.signOut = signOut;
    vm.summonLoginModal = summonLoginModal;

    activate();

    /*
     * Code to be executed on controller activation
     */
    function activate() {
      // Try and download a thumbnail image if we have a user ID
      if (localStorageService.get('user')) {
        const userID = localStorageService.get('user');
        vm.userID = userID;
        retrieveAndFormatProfileThumbnailImage(userID)
        .then((url) => {
          vm.userProfileThumbnailImage = url;
        });
      }

      // When the user changes their profile image, update the thumbnail
      // in the nav bar
      $scope.$on('profile-image-changed', (evt, obj) => {
        const { public_id } = obj;
        $timeout(() => {
          const url = formatAsThumbnail(public_id);
          vm.userProfileThumbnailImage = formatAsThumbnail(public_id);
        });
      });
    }

    /*
     * Given a public_id, convert it to a Cloudinary URL for an 18x18 version
     */
    function formatAsThumbnail(public_id) {
      return $.cloudinary.url(public_id, {
        height: 18,
        width: 18,
        crop: 'fill',
        gravity: 'face',
      });
    }

    /*
     * Take the API response, extract the public_id, and return its formatted
     * thumbnail URL
     */
    function formatDsimgResponse(response) {
      if (response.data && response.data.public_id) {
        return formatAsThumbnail(response.data.public_id);
      }

      return undefined;
    }

    /*
     * Make the API request and pass the response to a formatting function
     */
    function retrieveAndFormatProfileThumbnailImage(id) {
      return dsimg.getUserProfileImage(id)
      .then(formatDsimgResponse);
    }

    /*
     * Do signing-out clear-up
     * TODO: some of this is shared behaviour (e.g., clearing localStorage)
     * and should go into a shared service somewhere so that we can call it
     * from anywhere, not just this controller
     */
    function signOut() {
      localStorageService.remove('user');
      profileService.clear(); // remove own profile data from profileService
      vm.userProfileThumbnailImage = undefined;
      $auth.logout()
      .then(() => {
        // Clear search path if it's not empty, and take us to the front page
        $location.search('');
        $location.path('/');
      });
    }

    function summonLoginModal() {
      const modalInstance = $uibModal.open({
        templateUrl: 'login/login-modal.template.html',
        controller: 'LoginModalController',
        controllerAs: 'lmvm',
        size: 'sm',
        windowClass: 'sign-in',
      });
      modalInstance.result.then((reason) => {
        if (reason === 'signed-in') {
          // We've signed in successfully: retrieve the user profile thumbnail
          const userID = localStorageService.get('user');
          retrieveAndFormatProfileThumbnailImage(userID)
          .then((url) => {
            vm.userProfileThumbnailImage = url;
          });
        }
      });
    }
  }

  NavigationBarController.$inject = [
    '$auth',
    '$document',
    '$location',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.navigationBar').controller('NavigationBarController', NavigationBarController);
})();
