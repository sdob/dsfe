(function() {
  function SetSiteHeaderImageModalController($scope, $timeout, $uibModalInstance, Upload, site, IMG_API_URL) {
    const vm = this;
    activate();

    function activate() {
      vm.isUploading = false;
      // console.log(site);
      // console.log(IMG_API_URL);
      vm.setSiteHeaderImage = setSiteHeaderImage;
      vm.site = site;
    }

    function setSiteHeaderImage(file) {
      console.log(`I should upload and close the modal`);
      console.log(file);

      // show the user that we're uploading
      vm.isUploading = true;

      console.log('uploading to');
      console.log(`{IMG_API_URL}/${site.type}s/${site.id}/header`);

      // Upload the file
      file.upload = Upload.upload({
        data: { image: file },
        url: `${IMG_API_URL}/${site.type}s/${site.id}/header`,
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
  }

  SetSiteHeaderImageModalController.$inject = [
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'Upload',
    'site',
    'IMG_API_URL',
  ];
  angular.module('divesites.informationCard').controller('SetSiteHeaderImageModalController', SetSiteHeaderImageModalController);
})();
