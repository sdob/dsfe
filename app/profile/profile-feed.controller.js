(function() {
  'use strict';

  function ProfileFeedController($auth, $scope, $timeout, dsapi, dsimg, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.feed = {
        results: [],
      };
      vm.loadFeed = loadFeed;
      vm.next = false;
      vm.offset = 0;
      // We'll maintain a set of user profile image URLs
      vm.userProfileImageURLs = {};

      vm.apiCall = $scope.user.id === localStorageService.get('user') ? dsapi.getOwnActivity : dsapi.getUserActivity;

      vm.loadFeed();
    }

    function loadFeed() {
      vm.apiCall(vm.offset)
      .then((response) => {
        vm.next = !!response.data.next;
        console.log(`vm.next? ${vm.next}`);
        vm.offset += response.data.results.length;
        vm.feed.results.push(...response.data.results);
        console.log('feed length: ' + vm.feed.results.length);
        // console.log(vm.feed);
        vm.feed.results.forEach((i) => {
          const id = i.actor.id;
          if (vm.userProfileImageURLs.hasOwnProperty(id)) {
            console.log('already got profile image url');
            vm.feed.results.filter(i => i.actor.id === id).forEach((i) => {
              i.actor.profileImageUrl = vm.userProfileImageURLs[id];
            });
          } else {
            dsimg.getUserProfileImage(id)
            .then((response) => {
              const profileImageUrl = $.cloudinary.url(response.data.image.public_id, {
                height: 60,
                width: 60,
                crop: 'fill',
                gravity: 'face',
              });
              vm.userProfileImageURLs[id] = profileImageUrl;
              $timeout(() => {
                console.log('updating profile image url');
                vm.feed.results.filter(i => i.actor.id === id).forEach((i) => {
                  i.actor.profileImageUrl = profileImageUrl;
                });
              });
            });
          }
        });
      });
    }

  }

  ProfileFeedController.$inject = [
    '$auth',
    '$scope',
    '$timeout',
    'dsapi',
    'dsimg',
    'localStorageService',
  ];
  angular.module('divesites.profile').controller('ProfileFeedController', ProfileFeedController);
})();
