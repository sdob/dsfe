(function () {
  'use strict';

  function UploadDivesiteImage() {
    return {
      templateUrl: 'views/upload-divesite-image.html',
      restrict: 'E',
      link: () => {
        console.log('uploadDivesiteImage.link()');
      },
    };
  }

  UploadDivesiteImage.$inject = [];
  angular.module('divesites').directive('uploadDivesiteImage', UploadDivesiteImage);
})();
