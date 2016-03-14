(function() {
  'use strict';
  function AboutUsController(dsapi) {
    const vm = this;
    activate();

    function activate() {
      dsapi.getStatistics()
      .then((response) => {
        vm.statistics = response.data;
      });

      dsapi.getDivesites()
      .then((response) => {
        vm.numberOfDivesites = response.data.length;
      });
      dsapi.getSlipways()
      .then((response) => {
        vm.numberOfSlipways = response.data.length;
      });
      dsapi.getCompressors()
      .then((response) => {
        vm.numberOfCompressors = response.data.length;
      });
    }
  }

  AboutUsController.$inject = [
    'dsapi',
  ];
  angular.module('divesites.aboutUs').controller('AboutUsController', AboutUsController);
})();
