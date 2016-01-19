(function() {
  'use strict';

  function DivesiteDetailController($routeParams, dsapi) {
    const vm = this;
    activate();

    function activate() {
      const divesiteId = $routeParams.divesiteId;
      dsapi.getDivesite(divesiteId)
      .then((response) => {
        console.info(response.data);
        vm.divesite = response.data;

        // build depth chart
        const depths = vm.divesite.dives.map(d => d.depth);
      });
    }
  }

  DivesiteDetailController.$inject = ['$routeParams', 'dsapi'];
  angular.module('divesites').controller('DivesiteDetailController', DivesiteDetailController);
})();
