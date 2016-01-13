(function () {
  'use strict';
  function InformationCardActions() {
    return {
      controller: 'InformationCardActionsController',
      controllerAs: 'vm',
      templateUrl: 'views/information-card/actions.html',
      link: (scope, element, attrs, controller) => {
        console.log('actions link');
        console.log(scope);
      },
    };
  }
  InformationCardActions.$inject = [];
  angular.module('divesites.informationCard').directive('informationCardActions', InformationCardActions);
})();
