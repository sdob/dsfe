(function () {
  'use strict';
  function logDiveForm() {
    return {
      templateUrl: 'views/information-card/log-dive-form.html',
    };
  }
  logDiveForm.$inject = [];
  angular.module('divesites.informationCard').directive('logDiveForm', logDiveForm);
})();
