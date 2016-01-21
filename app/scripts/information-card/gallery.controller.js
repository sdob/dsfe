(function() {
  'use strict';
  function GalleryController($scope, Lightbox) {
    const vm = this;
    activate();

    function activate() {
      // We're just looking for the object that contains the url property
      vm.images = $scope.vm.site.images.map(i => i.image);
      vm.openLightboxModal = openLightboxModal;
    }

    function openLightboxModal(index) {
      Lightbox.openModal(vm.images, index);
    }
  }

  GalleryController.$inject = [
    '$scope',
    'Lightbox',
  ];
  angular.module('divesites.informationCard').controller('GalleryController', GalleryController);
})();
