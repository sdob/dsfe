(function() {
  'use strict';

  function CompressorInformationCardController($auth, $document, $location, $rootScope, $scope, $timeout, $uibModal, commentService, dsapi, dscomments, dsimg, informationCardService, localStorageService) {
    const vm = this;
    vm.isLoading = true;
    activate();

    function activate() {
      const type = $scope.type;
      const id = $scope.id;
      const { apiCall } = informationCardService.apiCalls[type];

      // Retrieve site information from scope if we've got it
      $scope.site = $scope.site || {};
      $scope.site.comments = [];
      $scope.site.id = id;
      $scope.site.type = $scope.type;
      if ($scope.site.geocoding_data) {
        $scope.site.locData = informationCardService.formatGeocodingData($scope.site);
      }

      $scope.site.images = {};
      vm.siteType = type;
      vm.siteID = id;

      /* Wire up functions */
      vm.isAuthenticated = $auth.isAuthenticated;

      // Retrieve the site data
      apiCall(id)
      .then((response) => {
        vm.isLoading = false;
        $scope.site = Object.assign($scope.site, response.data);
        $scope.site.locData = $scope.site.locData ||  informationCardService.formatGeocodingData($scope.site);

        vm.userIsOwner = informationCardService.userIsOwner($scope.site);
      });

      // Retrieve comments
      updateCommentList();

      // Listen for comment-added events
      $scope.$on('comment-added', (event) => {
        console.log('heard comment-added');
        updateCommentList();
      });
    }

    function getCommenterProfileImages() {
      const ids = new Set($scope.site.comments.map(c => c.owner.id));
      ids.forEach((id) => {
        dsimg.getUserProfileImage(id)
        .then((response) => {
          if (response.data && response.data.image && response.data.image.public_id) {
            const profileImageUrl = $.cloudinary.url(response.data.image.public_id, {
              height: 60,
              width: 60,
              crop: 'fill',
              gravity: 'face',
            });
            $timeout(() => {
              $scope.site.comments.filter(c => c.owner.id === id).forEach((c) => {
                c.owner.profileImageUrl = profileImageUrl;
              });
            }, 0);
          }
        });
      });
    }

    function updateCommentList() {
      const apiCall = commentService.apiCalls[$scope.site.type].retrieve;
      apiCall($scope.site.id)
      .then((response) => {
        $timeout(() => {
          $scope.site.comments = response.data;
          getCommenterProfileImages();
        });
      });
    }
  }

  CompressorInformationCardController.$inject = ['$auth',
    '$document',
    '$location',
    '$rootScope',
    '$scope',
    '$timeout',
    '$uibModal',
    'commentService',
    'dsapi',
    'dscomments',
    'dsimg',
    'informationCardService',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('CompressorInformationCardController', CompressorInformationCardController);
})();
