(function() {
  'use strict';
  function OwnProfileController($element, $rootScope, $scope, $timeout, $uibModal, dsapi, dsimg, localStorageService, profileService) {
    const vm = this;
    activate();

    function activate() {
      console.log('OwnProfileController.activate()');
      vm.editable = true;
      vm.user = vm.user || {
        id: localStorageService.get('user'),
      };
      vm.summonConfirmDeleteImageModal = summonConfirmDeleteImageModal;
      $scope.editable = true;

      // Retrieve profile info
      dsapi.getOwnProfile()
      .then((response) => {
        vm.user = profileService.formatResponseData(response.data);
        vm.user.imagesAdded = [];
        // Ensure that nothing is undefined
        vm.user.compressors = vm.user.compressors || [];
        vm.user.divesites = vm.user.divesites || [];
        vm.user.slipways = vm.user.slipways || [];

        // Build a 'contributions' list
        vm.user.placesAdded = [].concat(
          vm.user.divesites.map((x) => Object.assign({ type: 'divesite' }, x)),
            vm.user.compressors.map((x) => Object.assign({ type: 'compressor' }, x)),
              vm.user.slipways.map((x) => Object.assign({ type: 'slipway' }, x))
        );
        $scope.$broadcast('user-loaded', vm.user);
        return dsimg.getUserImages(vm.user.id);
      })
      .then((response) => {
        console.log(`response from dsimg: ${response.data.length}`);
        $timeout(() => {
          vm.user.imagesAdded = response.data;
          vm.user.imagesAdded.forEach((i) => {
            dsapi.getDivesite(i.divesiteID)
            .then((response) => {
              i.divesiteName = response.data.name;
            });
          });
        });
      })
      .catch((err) => {
        console.error(err);
      });
    }

    function summonConfirmDeleteImageModal(image, $index) {
      console.log('summoning delete image modal');
      console.log($index);
      const instance = $uibModal.open({
        controller: 'ConfirmDeleteImageModalController',
        controllerAs: 'vm',
        templateUrl: 'profile/confirm-delete-image-modal.template.html',
      });
      instance.result.then((reason) => {
        // Easier for us to handle deletion here
        if (reason === 'confirmed') {
          // We can give the user immediate feedback by removing
          // the element from the DOM while we contact DSIMG in the
          // background.
          vm.user.imagesAdded.splice($index, 1);
          // Now contact DSIMG to perform the deletion
          const id = image._id;
          return dsimg.deleteDivesiteImage(id)
          .then((response) => {
            console.log(response.data);
          });
        }
      });
    }
  }

  OwnProfileController.$inject = [
    '$element',
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'dsimg',
    'localStorageService',
    'profileService',
  ];
  angular.module('divesites.profile').controller('OwnProfileController', OwnProfileController);
})();
