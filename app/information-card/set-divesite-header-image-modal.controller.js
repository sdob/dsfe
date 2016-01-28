(function() {
  function SetDivesiteHeaderImageModalController($scope, $timeout, Upload, site, IMG_API_URL) {
    const vm = this;
    activate();

    function activate() {
      console.log(site);
      console.log(IMG_API_URL);
      vm.setDivesiteHeaderImage = setDivesiteHeaderImage;
      vm.site = site;
    }

    function setDivesiteHeaderImage(file) {
      console.log(`I should upload and close the modal`);
      console.log(file);
      // show the user that we're uploading
      vm.isUploading = true;
      $timeout(() => {
        console.log('finished uploading');
        vm.isUploading = false;
      }, 1000)
      .then((response) => {
      })
      .catch((err) => {
        // TODO: handle error situations
      });
    }
  }

  SetDivesiteHeaderImageModalController.$inject = [
    '$scope',
    '$timeout',
    'Upload',
    'site',
    'IMG_API_URL',
  ];
  angular.module('divesites.informationCard').controller('SetDivesiteHeaderImageModalController', SetDivesiteHeaderImageModalController);
})();
