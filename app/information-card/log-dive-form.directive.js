(function() {
  'use strict';
  function logDiveForm($timeout) {
    return {
      controller: 'InformationCardLogDiveFormController',
      controllerAs: 'vm',
      templateUrl: 'information-card/log-dive-form.html',
    };
  }

  logDiveForm.$inject = [
    '$timeout',
  ];
  angular.module('divesites.informationCard').directive('logDiveForm', logDiveForm);
})();
