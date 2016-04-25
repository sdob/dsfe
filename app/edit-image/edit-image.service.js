(function() {
  'use strict';

  function editImageService($uibModal) {
    return {
      summonEditImageModal,
    };

    function summonEditImageModal(image) {
      $uibModal.open({
        controller: 'EditImageModalController',
        controllerAs: 'vm',
        resolve: {
          image: () => image,
        },
        size: 'lg',
        templateUrl: 'edit-image/edit-image-modal.template.html',
      });
    }
  }

  editImageService.$inject = [
    '$uibModal',
  ];
  angular.module('divesites.editImage').factory('editImageService', editImageService);
})();
