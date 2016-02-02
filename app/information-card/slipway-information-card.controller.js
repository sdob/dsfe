(function() {
  'use strict';

  function SlipwayInformationCardController($auth, $document, $location, $rootScope, $scope, $timeout, $uibModal, dsapi, dsimg, informationCardService, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.isLoading = true;
      console.log('SlipwayInformationCardController.activate()');
      const id = $scope.id;
      const type = $scope.type;
      const { apiCall } = informationCardService.apiCalls[type];

      vm.siteID = id;
      vm.siteType = type;

      /* Wire up functions */
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.toggleSectionVisibility = toggleSectionVisibility;

      apiCall(id)
      .then((response) => {
        vm.site = response.data;
        vm.userIsOwner = informationCardService.userIsOwner(vm.site);
        $timeout(() => {
          vm.isLoading = false;
        });
      });

      vm.sectionVisibilities = {
        defaultSection: true,
        uploadImageForm: false,
      };
    }

    function toggleSectionVisibility(section) {
      // If we've been passed garbage, just return
      if (!vm.sectionVisibilities.hasOwnProperty(section)) return;

      // Otherwise, render the selected section visible
      if (vm.sectionVisibilities[section]) {
        // If the section is currently visible, hide it, then
        // show the dive list (the default view)
        vm.sectionVisibilities[section] = false;
        vm.sectionVisibilities.defaultSection = true;
      } else {
        // If the section is currently invisible, set
        // all other section visibilities to false and the upload image
        // form's visibility to true
        Object.keys(vm.sectionVisibilities).forEach((k) => {
          vm.sectionVisibilities[k] = false;
        });
        vm.sectionVisibilities[section] = true;
      }
    }
  }

  SlipwayInformationCardController.$inject = ['$auth',
    '$document',
    '$location',
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'dsimg',
    'informationCardService',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('SlipwayInformationCardController', SlipwayInformationCardController);
})();
