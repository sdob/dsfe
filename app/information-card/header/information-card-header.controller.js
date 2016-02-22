(function() {
  'use strict';
  function InformationCardHeaderController($scope, dsapi, informationCardService) {
    const vm = this;
    activate();

    function activate() {
      console.log('InformationCardHeadercontroller.activate()');
      console.log($scope);
      vm.site = $scope.site;
      {
        const apiCall = getApiCallByType(vm.site.type);
        // Get the divesite header image (if it exists)
        //informationCardService.getDivesiteHeaderImage(vm.site.id)
        apiCall(vm.site.id)
        .then((imageUrl) => {
          // If there's an image, dsimg will return 200 and a non-null object
          if (imageUrl) {
            vm.headerImageUrl = imageUrl;
            vm.backgroundStyle = {
              background: `blue url(${vm.headerImageUrl}) center / cover`,
            };
          }
        });
      }
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
  }

  InformationCardHeaderController.$inject = [
    '$scope',
    'dsapi',
    'informationCardService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardHeaderController', InformationCardHeaderController);
})();
