(function() {
  'use strict';
  function GalleryController($scope, Lightbox) {
    const vm = this;
    activate();

    function activate() {
      console.log('GalleryController.activate()');
      console.log($scope);

      // We're just looking for the object that contains the url property
      // vm.images = $scope.site.images.map(i => i.image);
      vm.openLightboxModal = openLightboxModal;
    }

    function openLightboxModal(index) {
      Lightbox.openModal($scope.images, index);
    }
  }

  GalleryController.$inject = [
    '$scope',
    'Lightbox',
  ];
  angular.module('divesites.informationCard').controller('GalleryController', GalleryController);
})();
