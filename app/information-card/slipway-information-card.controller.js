(function() {
  'use strict';

  function SlipwayInformationCardController($auth, $document, $location, $rootScope, $scope, $timeout, $uibModal, commentService, dsapi, dscomments, dsimg, informationCardService, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.isLoading = true;
      console.log('SlipwayInformationCardController.activate()');
      const id = $scope.id;
      const type = $scope.type;
      const { apiCall } = informationCardService.apiCalls[type];

      //vm.site = $scope.site || {};
      $scope.site = $scope.site || {};
      $scope.site.comments = [];
      $scope.site.id = id;
      $scope.site.type = $scope.type;
      if ($scope.site.geocoding_data) {
        $scope.site.locData = informationCardService.formatGeocodingData($scope.site);
      }

      vm.siteID = id;
      vm.siteType = type;

      /* Wire up functions */
      vm.isAuthenticated = $auth.isAuthenticated;

      // Retrieve slipway data
      apiCall(id)
      .then((response) => {
        $scope.site = Object.assign($scope.site, response.data);
        $scope.site.locData = $scope.site.locData || informationCardService.formatGeocodingData($scope.site);

        vm.userIsOwner = informationCardService.userIsOwner($scope.site);
        $timeout(() => {
          vm.isLoading = false;
        });
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
      console.log('getting commenter profile images');
      const ids = new Set($scope.site.comments.map(c => c.owner.id));
      console.log(ids);
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
                console.log('setting commenter profile image');
                console.log(c);
                c.owner.profileImageUrl = profileImageUrl;
              });
            }, 0);
          }
        });
      });
    }

    function updateCommentList() {
      console.log($scope.site.type);
      console.log(commentService);
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

  SlipwayInformationCardController.$inject = ['$auth',
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
  angular.module('divesites.informationCard').controller('SlipwayInformationCardController', SlipwayInformationCardController);
})();
