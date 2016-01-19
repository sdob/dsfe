(function() {
  'use strict';

  function SlipwayInformationCardController($auth, $document, $location, $rootScope, $scope, $uibModal, dsapi, dsimg, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      /* Wire up functions */
      vm.dismiss = dismiss;
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.userIsOwner = userIsOwner;

      vm.site = $scope.site;
      console.log('site');
      console.log(vm.site);
      vm.visible = true;

      // handle keydown events (listening for ESC keypress)
      $document.on('keydown', keydownListener);
      $rootScope.$on('$destroy', () => {
        $document.off('keydown', keydownListener);
      });
    }

    function dismiss() {
      console.log('dismissing...');
      $location.search('');
      $('information-card').remove();
    }

    function keydownListener(evt) {
      if (evt.isDefaultPrevented()) {
        return evt;
      }

      switch (evt.which) {
        // Handle ESC keypress
      case 27: {
        // Wrapping this in $scope.$apply forces the
        // search params to update immediately
        evt.preventDefault();
        $scope.$apply(() => {
          $location.search('');
          $('information-card').remove();
        });
      }

      break;
      }
    }

    // Show a full-size version of the image in a modal
    function showBiggerImage(img) {
      console.log('showBiggerImage');
      console.log(img);
      $uibModal.open({
        controller: ($scope, image) => {
          // TODO: assigning to 'vm.image' doesn't seem to work; I
          // need to work out why.
          $scope.image = image;
        },

        controllerAs: 'vm',
        resolve: {
          image: () => img,
        },
        templateUrl: 'views/show-full-size-image.html',
        size: 'lg',
      });
    }

    function userIsOwner() {
      return localStorageService.get('user') === vm.site.owner.id;
    }

  }

  SlipwayInformationCardController.$inject = ['$auth',
    '$document',
    '$location',
    '$rootScope',
    '$scope',
    '$uibModal',
    'dsapi',
    'dsimg',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('SlipwayInformationCardController', SlipwayInformationCardController);
})();
