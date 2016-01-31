(function() {
  'use strict';

  function CompressorInformationCardController($auth, $document, $location, $rootScope, $scope, $timeout, $uibModal, dsapi, dsimg, informationCardService, localStorageService) {
    const vm = this;
    vm.isLoading = true;
    activate();

    function activate() {
      console.log('CompressorInformationCardController.activate()');
      const type = $scope.type;
      const id = $scope.id;
      const { apiCall } = informationCardService.apiCalls[type];

      /* Wire up functions */
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.toggleSectionVisibility = toggleSectionVisibility;

      vm.sectionVisibilities = {
        defaultSection: true,
        uploadImageForm: false,
      };

      // Retrieve the site data
      apiCall(id)
      .then((response) => {
        vm.site = response.data;
        vm.userIsOwner = informationCardService.userIsOwner(vm.site);
      });

      $timeout(() => {
        vm.isLoading = false;
      });
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

  CompressorInformationCardController.$inject = ['$auth',
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
  angular.module('divesites.informationCard').controller('CompressorInformationCardController', CompressorInformationCardController);
})();
