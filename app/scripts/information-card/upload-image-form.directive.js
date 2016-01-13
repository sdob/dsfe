(function () {
  'use strict';
  function uploadImageForm() {
    return {
      templateUrl: 'views/information-card/upload-image-form.html',
    };
  }
  uploadImageForm.$inject = [];
  angular.module('divesites.informationCard').directive('uploadImageForm', uploadImageForm);
})();
