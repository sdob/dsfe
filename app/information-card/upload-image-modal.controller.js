(function() {
  'use strict';

  function UploadImageModalController($uibModalInstance, Upload, dsimg, site) {
    const vm = this;
    activate();

    function activate() {
      vm.isUploading = false;
      vm.site = site;
      vm.submit = submit;
    }

    function submit(file) {
      vm.isUploading = true;
      const siteID = vm.site.id;
      const type = vm.site.type ? vm.site.type : 'divesite';
      console.log(`uploading for site ${siteID}`);
      file.upload = Upload.upload({
        data: { image: file },
        url: `${dsimg.IMG_API_URL}/${type}s/${siteID}`,
      })
      .then(() => {
        $uibModalInstance.close('image-uploaded');
      })
      .catch((err) => {
        vm.isUploading = false;
        // TODO: show error message
      })
      ;
    }
  }

  UploadImageModalController.$inject = [
    '$uibModalInstance',
    'Upload',
    'dsimg',
    'site',
  ];
  angular.module('divesites.informationCard').controller('UploadImageModalController', UploadImageModalController);
})();
