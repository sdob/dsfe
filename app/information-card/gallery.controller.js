(function() {
  'use strict';
  function GalleryController($location, $scope, Lightbox) {
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
      const instance = Lightbox.openModal($scope.images, index);
      instance.result.then((reason) => {
        // If we closed the modal when the viewing user clicked the link
        // to the uploader's profile, then navigate to the uploader's profile
        if (reason.action === 'follow-user') {
          const id = reason.id;
          return goToProfile(id);
        }
      })
      .catch(() => {
        // In this block we handle the dismiss; nothing to do here in production
        console.log('handled lightbox dismiss');
      });

      function goToProfile(id) {
        $location.path(`/users/${id}`);
      }
    }
  }

  GalleryController.$inject = [
    '$location',
    '$scope',
    'Lightbox',
  ];
  angular.module('divesites.informationCard').controller('GalleryController', GalleryController);
})();
