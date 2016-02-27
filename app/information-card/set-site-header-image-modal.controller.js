(function() {
  function SetSiteHeaderImageModalController($scope, $timeout, $uibModalInstance, Upload, dsimg, images, site, IMG_API_URL) {
    const vm = this;
    activate();

    function activate() {
      vm.addNewImage = addNewImage;
      vm.clearHeaderImage = clearHeaderImage;
      vm.images = images;
      vm.isUploading = false;
      // vm.setSiteHeaderImage = setSiteHeaderImage;
      vm.site = site;
      console.log('setSiteHeader scope');
      console.log($scope);
      vm.select = select;
    }

    function addNewImage() {
    }

    function clearHeaderImage() {
    }

    function select(image) {
      console.log(image.id);
      // POST this image's ID to the API to tell it to set
      // this image as the header
      dsimg.setSiteHeaderImage(site, image.id)
      .then((response) => {
        console.log(response.data);
        $uibModalInstance.close('changed');
      });
      // console.log('selecting');
      // vm.selectedImage = image;
    }

    /*
    function setSiteHeaderImage(file) {
      console.log(`I should upload and close the modal`);
      console.log(file);

      // show the user that we're uploading
      vm.isUploading = true;

      const url = `${API_URL}/${site.type}s/${site.id}/images/`;
      console.log(`uploading to: ${url}`);
      // console.log(`{IMG_API_URL}/${site.type}s/${site.id}/header`);

      // Upload the file
      file.upload = Upload.upload({
        data: { image: file, is_header_image: true },
        url,
      }).then(() => {
        // On success, update UI and close us on out
        $timeout(() => {
          console.log('finished uploading');
          vm.isUploading = false;
          $uibModalInstance.close('uploaded');
        }, 200);
      })
      .then((response) => {
      })
      .catch((err) => {
        // TODO: handle error situations
      });
    }
    */
  }

  SetSiteHeaderImageModalController.$inject = [
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'Upload',
    'dsimg',
    'images',
    'site',
    'IMG_API_URL',
  ];
  angular.module('divesites.informationCard').controller('SetSiteHeaderImageModalController', SetSiteHeaderImageModalController);
})();
