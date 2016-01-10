(function () {
  'use strict';
  function UploadDivesiteImageController($routeParams, $scope, $uibModal, $window, Upload, dsapi, dsimg) {
    const vm = this;
    activate();

    function activate() {
      vm.summonCancelUploadModal = summonCancelUploadModal;
      vm.submit = submit;
      dsapi.getDivesite($routeParams.id)
      .then((response) => {
        vm.site = response.data;
      })
      .then(() => dsimg.getDivesiteHeaderImage($routeParams.id))
      .then((response) => {
        // Set this flag to true if the site already has a header image
        vm.site.hasHeaderImage = !!response.data;
      });
    }

    function summonCancelUploadModal() {
      console.log('hello');
      if ($scope.uploadForm.$dirty) {
        return $uibModal.open({
          templateUrl: 'views/cancel-editing-modal.html',
          controller: 'CancelEditingModalController',
          controllerAs: 'vm',
          size: 'lg',
        });
      }
      return $window.history.back();
    }

    function submit(file) {
      vm.isSaving = true;
      file.upload = Upload.upload({
        data: {image: file},
        url: dsimg.IMG_API_URL + `/divesites/${vm.site.id}`,
      })
      .then((response) => {
        if (response.data) {
          // TODO: check all oK
        }
        vm.isSaving = false;
        $window.history.back();
      });
    }
  }

  UploadDivesiteImageController.$inject = [
    '$routeParams',
    '$scope',
    '$uibModal',
    '$window',
    'Upload', 
    'dsapi',
    'dsimg',
  ];
  angular.module('divesites').controller('UploadDivesiteImageController', UploadDivesiteImageController);
})();
