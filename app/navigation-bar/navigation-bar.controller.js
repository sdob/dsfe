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
    activate();

    function activate() {
      // Set bindable values
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.signOut = signOut;
      vm.summonLoginModal = summonLoginModal;

      // Try and download a thumbnail image if we have a user ID
      if (localStorageService.get('user')) {
        const userID = localStorageService.get('user');
        vm.userID = userID;
        retrieveAndFormatProfileThumbnailImage(userID)
        .then((url) => {
          vm.userProfileThumbnailImage = url;
        });
      }

      $scope.$on('profile-image-changed', () => {
        if (localStorageService.get('user')) {
          const userID = localStorageService.get('user');
          retrieveAndFormatProfileThumbnailImage(userID)
          .then((url) => {
            vm.userProfileThumbnailImage = url;
          });
        }
      });
    }

    function formatDsimgResponse(response) {
      if (response.data && response.data.public_id) {
        return $.cloudinary.url(response.data.public_id, {
          height: 18,
          width: 18,
          crop: 'fill',
          gravity: 'face',
        });
      }

      return undefined;
    }

    function retrieveAndFormatProfileThumbnailImage(id) {
      return dsimg.getUserProfileImage(id)
      .then(formatDsimgResponse);
    }

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
