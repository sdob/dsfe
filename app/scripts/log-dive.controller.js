(function () {
  'use strict';
  function LogDiveController($routeParams, dsapi) {
    const vm = this;
    activate();

    function activate() {
      console.log('LogDiveController.activate()');
      vm.dive = {
      };
      vm.settings = {
        maxDate: moment()
      };
      dsapi.getDivesite($routeParams.divesiteId)
      .then((response) => {
        console.log(response.data);
        vm.site = response.data;
      });
    }

    function submit() {
      console.log('submitted!');
    }
  }

  LogDiveController.$inject = ['$routeParams', 'dsapi'];
  angular.module('divesites').controller('LogDiveController', LogDiveController);
})();
