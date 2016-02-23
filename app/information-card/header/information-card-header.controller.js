(function() {
  'use strict';
  function InformationCardHeaderController($scope, dsapi, informationCardService) {
    const vm = this;
    activate();

    function activate() {
      console.log('InformationCardHeadercontroller.activate()');
      console.log($scope);
      //$scope.site = $scope.site;
      // {
        //const apiCall = getApiCallByType($scope.site.type);
        // Get the divesite header image (if it exists)
        //informationCardService.getDivesiteHeaderImage($scope.site.id)
        //apiCall($scope.site.id)
      // }
      setSiteHeaderImage();

      $scope.$on('header-image-changed', () => {
        setSiteHeaderImage();
      });
    }

    function getApiCallByType(type) {
      // XXX Change the function calls
      if (type === 'compressor') {
        return informationCardService.getDivesiteHeaderImage;
      }
      if (type === 'slipway') {
        return informationCardService.getDivesiteHeaderImage;
      }
      return informationCardService.getDivesiteHeaderImage;
    }

    function setSiteHeaderImage() {
      informationCardService.getSiteHeaderImage($scope.site)
      .then((imageUrl) => {
        console.log('something came back from dsimg');
        // If there's an image, dsimg will return 200 and a non-null object
        if (imageUrl) {
          console.log(imageUrl);
          vm.headerImageUrl = imageUrl;
          vm.backgroundStyle = {
            background: `blue url(${vm.headerImageUrl}) center / cover`,
          };
        }
      });
    }
  }

  InformationCardHeaderController.$inject = [
    '$scope',
    'dsapi',
    'informationCardService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardHeaderController', InformationCardHeaderController);
})();
