(function() {
  'use strict';
  function uploadImageForm() {
    return {
      controller: 'UploadImageFormController',
      controllerAs: 'vm',
      templateUrl: 'information-card/upload-image-form.html',
      link: (scope, elem, attrs, ctrl) => {
        console.log('uicd.link');
        console.log(scope);
      },
    };
  }

  uploadImageForm.$inject = [];
  angular.module('divesites.informationCard').directive('uploadImageForm', uploadImageForm);
})();
