(function () {
  'use strict';
  function InformationCardActions() {
    return {
      templateUrl: 'views/information-card-actions.html',
    };
  }
  InformationCardActions.$inject = [];
  angular.module('divesites').directive('informationCardActions', InformationCardActions);
})();
