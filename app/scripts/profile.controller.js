(function () {
  'use strict';
  function ProfileController($routeParams, dsapi) {
    const vm = this;
    activate();

    function activate() {
      const userId = parseInt($routeParams.userId);
      // TODO: fix circular import problem in the backend so
      // I can return all this in one request
      dsapi.getUser(userId)
      .then((response) => {
        vm.user = response.data;
        return dsapi.getUserRecentActivity(userId);
      })
      .then((response) => {
      })
      .then(() => {
        // just for dev only...
        vm.user.divesites.forEach((site) => {
          site.header_image_url = 'http://res.cloudinary.com/divesites/image/upload/w_512,h_200,c_fill/sample.jpg';
        });
      });
      /*
      dsapi.getUser(userId)
      .then((response) => {
        //console.info(response.data);
        vm.user = response.data;
        // XXX: For dev only!
      })
      .then(() => {
        vm.user.divesites.forEach((site) => {
          console.log(site);
          site.header_image_url = 'http://res.cloudinary.com/divesites/image/upload/w_512,h_200,c_fill/sample.jpg';
        });
      })
      .then(() => dsapi.getUserRecentActivity(userId))
      .then((response) => {
        console.info('recent activity');
        console.info(response.data);
        vm.recentActivity = response.data.map((activity) => {
          if (activity.divesite) {
            console.log('created a divesite');
            return activity;
          }
          if (activity.dive) {
            console.log('logged a dive');
            return activity;
          }
        });
      })
      .then(() => {
        console.log(vm.recentActivity);
      });
      */
    }
  }

  ProfileController.$inject = ['$routeParams', 'dsapi'];
  angular.module('divesites').controller('ProfileController', ProfileController);
})();
