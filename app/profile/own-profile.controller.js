(function() {
  'use strict';
  function OwnProfileController($element, $rootScope, $scope, $timeout, $uibModal, dsactivity, dsapi, dsimg, localStorageService, profileService) {
    const SLIPWAY_CTID = 10;
    const DIVESITE_CTID = 8;
    const COMPRESSOR_CTID = 11;

    $scope.editable = true;

    const vm = this;
    // This flag sets the profile as editable, which we'll pass to the
    // header and other components so that they know to display editing
    // action buttons
    vm.editable = true;
    vm.user = vm.user || {
      id: localStorageService.get('user'),
    };

    // Run the activation block
    activate();

    function activate() {
      console.log('OwnProfileController.activate()');

      // Retrieve the user's own (expanded) profile data
      retrieveAndFormatOwnProfile();

      // Listen for events telling us that the dive log has changed, so
      // that we can update the user's statistics in the header
      $scope.$on('dive-log-updated', (e) => {
        console.log('heard dive-log-updated');
        // For now, we'll just do a complete reload of the user profile
        // whenever the dive log has changed
        retrieveAndFormatOwnProfile();
      });
    }

    /*
     * Any error responses should be the fault of the API server, and not
     * something we can control ourselves. In the long term, we should
     * provide a UI update that indicates this, but for now we'll just
     * dump the error to the console.
     */
    function handleErrorResponse(err) {
      console.error(err);
    }

    function retrieveAndFormatOwnProfile() {
      // Retrieve and format profile info
      dsapi.getOwnProfile()
      .then((response) => {
        // Format the user data
        vm.user = profileService.formatResponseData(response.data);
        // Format the places added
        vm.user.placesAdded = profileService.formatUserProfilePlacesAdded(vm.user);
        // Broadcast an event to force UI updates
        $scope.$broadcast('user-loaded', vm.user);
      })
      .catch(handleErrorResponse);
    }
  }

  OwnProfileController.$inject = [
    '$element',
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsactivity',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('OwnProfileController', OwnProfileController);
})();
