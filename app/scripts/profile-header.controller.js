(function() {
  'use strict';
  function ProfileHeaderController($scope, $uibModal) {
    const vm = this;
    activate();

    function activate() {
      vm.summonProfileImageUploadModal = summonImageUploadModal;
    }

    function summonImageUploadModal() {
      // Summon a modal dialog to allow the user to upload a new image
      const instance = $uibModal.open({
        templateUrl: 'views/upload-profile-image-modal.html',
        controller: 'ProfileImageUploadController',
        controllerAs: 'vm',
        resolve: {
          user: () => $scope.user,
        },
      });
    }
  }

  ProfileHeaderController.$inject = [
    '$scope',
    '$uibModal',
  ];
  angular.module('divesites').controller('ProfileHeaderController', ProfileHeaderController);
})();
