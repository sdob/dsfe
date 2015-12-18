(function () {
  'use strict';
  function ProfileController($routeParams, dsapi) {
    const vm = this;
    activate();

    function activate() {
      console.debug('ProfileController.activate()');
      const userId = parseInt($routeParams.userId);
      // TODO: fix circular import problem in the backend so
      // I can return all this in one request
      dsapi.getUser(userId)
      .then((response) => {
        //console.info(response.data);
        vm.user = response.data;
        // XXX: For dev only!
        vm.user.divesites.forEach((site) => {
          //site.header_image_url = 'http://lorempixel.com/512/178/nature/' + (parseInt(Math.random() * 15) + 1);
          //console.info(site.header_image_url);
        });
        console.info(vm.user);
      });
    }
  }

  ProfileController.$inject = ['$routeParams', 'dsapi'];
  angular.module('divesites').controller('ProfileController', ProfileController);
})();
