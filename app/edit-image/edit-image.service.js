(function() {
  'use strict';

  function editImageService($uibModal) {
    return {
      summonEditImageModal,
    };

    function summonEditImageModal() {
      $uibModal.open({
        controller: 'EditImageModalController',
        controllerAs: 'vm',
        templateUrl: 'edit-image/edit-image-modal.template.html',
      });
    }
  }

  editImageService.$inject = [
    '$uibModal',
  ];
  angular.module('divesites.editImage').factory('editImageService', editImageService);
})();
