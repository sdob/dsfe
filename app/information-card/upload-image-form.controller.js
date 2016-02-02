(function() {
  function UploadImageFormController($scope, $timeout, Upload, dsimg) {
    const vm = this;

    // TODO: there must be a better way to get 'icvm' into scope
    const icvm = $scope.$parent.icvm;
    activate();

    function activate() {
      vm.submit = submit;
    }

    function submit(file) {
      // TODO: there must be a better way to get the parent scope's site prop
      // into this controller
      const siteID = $scope.$parent.site.id;
      vm.isSaving = true;
      file.upload = Upload.upload({
        data: { image: file },
        url: `${dsimg.IMG_API_URL}/divesites/${siteID}`,
      })
      .then((response) => {
        // TODO: check everything is OK
        $scope.$emit('image-uploaded');
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
