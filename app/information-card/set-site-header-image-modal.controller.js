(function() {
  function SetSiteHeaderImageModalController($rootScope, $scope, $timeout, $uibModal, $uibModalInstance, Upload, dsimg, images, site, IMG_API_URL) {
    const vm = this;
    activate();

    function activate() {
      vm.summonUploadImageModal = summonUploadImageModal;
      vm.clearSiteHeaderImage = clearSiteHeaderImage;
      // vm.images = images;
      console.log(images);
      vm.isUploading = false;
      // vm.setSiteHeaderImage = setSiteHeaderImage;
      vm.site = site;
      console.log('setSiteHeader scope');
      console.log($scope);
      vm.select = select;
      $scope.images = images;
      console.log($scope.images);
    }

    function clearSiteHeaderImage() {
      dsimg.clearSiteHeaderImage(site)
      .then((response) => {
        $scope.images.forEach((i) => {
          i.is_header_image = false;
        });
      });
      $rootScope.$broadcast('header-image-changed');
    }

    function summonUploadImageModal() {
      const instance = $uibModal.open({
        controller: 'UploadImageModalController',
        controllerAs: 'vm',
        resolve: {
          site: () => vm.site,
        },
        templateUrl: 'information-card/upload-image-modal.template.html',
      });
      instance.result.then((val) => {
        if (val.reason === 'uploaded') {
          // If we've uploaded a new image, we want to add it to the
          // set and flag it as selected
          const image = val.image;
          image.url = $.cloudinary.url(image.public_id);
          image.transformedUrl = $.cloudinary.url(image.public_id, {
            height: 80,
            width: 80,
            crop: 'fill',
          });
          // We're updating an inherited scope value here
          $scope.images.push(image);

          // And while we're at it: make this new image the selected header
          select(image);
        }
      });
    }

    function select(image) {
      console.log(image.id);
      // POST this image's ID to the API to tell it to set
      // this image as the header
      dsimg.setSiteHeaderImage(site, image.id)
      .then((response) => {
        console.log(response.data);
        // We don't need to do a full refresh; we just need to indicate
        // to the UI that this image is now the header
        $scope.images.forEach((i) => {
          i.is_header_image = false;
        });
        image.is_header_image = true;
        // Modal doesn't seem to be attaching to information card as
        // child: TODO why is this? Workaround: $broadcast from $rootScope
        // instead.
        $rootScope.$broadcast('header-image-changed');
      });
    }
  }

  SetSiteHeaderImageModalController.$inject = [
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    '$uibModalInstance',
    'Upload',
    'dsimg',
    'images',
    'site',
    'IMG_API_URL',
  ];
  angular.module('divesites.informationCard').controller('SetSiteHeaderImageModalController', SetSiteHeaderImageModalController);
})();
