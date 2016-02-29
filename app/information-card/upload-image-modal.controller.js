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
      const url = `${dsimg.API_URL}/${site.type}s/${site.id}/images/`;
      file.upload = Upload.upload({
        data: { image: file },
        url,
      })
      .then((response) => {
        console.log('response from upload');
        console.log(response);
        $uibModalInstance.close({
          reason: 'uploaded',
          image: response.data,
        });
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
