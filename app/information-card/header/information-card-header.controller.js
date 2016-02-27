(function() {
  'use strict';
  function InformationCardHeaderController($scope, dsapi, dsimg, informationCardService) {
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
      getAndApplySiteHeaderImage();

      $scope.$on('header-image-changed', () => {
        // The main information card handles the logic for changing
        // the header image; we just listen and obediently make calls
        // to DSAPI. (In the future, we should probably pass the image
        // URL up the chain to avoid having to do this, but let's ship
        // for now.)
        console.log(`information card header heard 'header-image-changed`);
        getAndApplySiteHeaderImage();
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

    function getAndApplySiteHeaderImage() {
      dsimg.getSiteHeaderImage($scope.site)
      .then((headerImage) => {
        console.log('I found a header image!');
        console.log(headerImage);
        if (headerImage && headerImage.data && headerImage.data.public_id) {
          vm.headerImageUrl = $.cloudinary.url(headerImage.data.public_id, {});
          console.log('header image should be');
          console.log(vm.headerImageUrl);
          vm.backgroundStyle = {
            background: `url(${vm.headerImageUrl}) center / cover`,
          };
        }
      });
      /*
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
      */
    }
  }

  InformationCardHeaderController.$inject = [
    '$scope',
    'dsapi',
    'dsimg',
    'informationCardService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardHeaderController', InformationCardHeaderController);
})();
