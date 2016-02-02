(function() {
  'use strict';
  function InformationCardHeaderController($scope, dsapi, informationCardService) {
    const vm = this;
    console.log($scope);

    activate();

    function activate() {
      const id = $scope.id;
      const type = $scope.type;

      // Retrieve divesite information
      const { apiCall } = informationCardService.apiCalls[type];
      apiCall(id)
      .then((response) => {
        vm.site = response.data;
        vm.site.locData = informationCardService.formatGeocodingData(vm.site);
        vm.userIsOwner = informationCardService.userIsOwner(vm.site);
      });

      // Get the divesite header image (if it exists)
      informationCardService.getDivesiteHeaderImage(id)
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

  InformationCardHeaderController.$inject = [
    '$scope',
    'dsapi',
    'informationCardService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardHeaderController', InformationCardHeaderController);
})();
