(function () {
  function UploadImageFormController($scope, $timeout, Upload, dsimg) {
    const vm = this;
    // TODO: there must be a better way to get 'icvm' into scope
    const icvm = $scope.$parent.icvm;
    activate();

    function activate() {
      vm.submit = submit;
    }

    function submit(file) {
      console.log('submitting!!!!!!!');
      console.log($scope);
      // TODO: there must be a better way to get the parent scope's site prop
      // into this controller
      const siteID = $scope.$parent.site.id;
      //dsimg.uploadDivesiteImage(siteID, vm.dsImg);
      vm.isSaving = true;
      file.upload = Upload.upload({
        data: {image: file},
        url: `${dsimg.IMG_API_URL}/divesites/${siteID}`,
      })
      .then((response) => {
        if (response.data) {
          // TODO: check everything is ok
        }
        // TODO: again, I just want icvm to be in scope
        // TODO: update the image list
        return icvm.getDivesiteImages();
      })
      .then(() => {
        $timeout(() => {
          vm.isSaving = false;
          icvm.toggleSectionVisibility('default');
        }, 500);
      });
    }
  }
  UploadImageFormController.$inject = [
    '$scope',
    '$timeout',
    'Upload',
    'dsimg',
  ];
  angular.module('divesites.informationCard').controller('UploadImageFormController', UploadImageFormController);
})();
