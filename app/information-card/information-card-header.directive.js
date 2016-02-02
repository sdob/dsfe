(function() {
  'use strict';
  function informationCardHeader() {
    return {
      controller: 'InformationCardHeaderController',
      controllerAs: 'vm',
      link,
      templateUrl: 'information-card/information-card-header.html',
      scope: {
        id: '=',
        type: '=',
      },
    };

    function link(scope, element, attrs, controller) {
      console.log('informationCardHeader.link()');
      console.log(scope);
    }
  }

  informationCardHeader.$inject = [
  ];
  angular.module('divesites.informationCard').directive('informationCardHeader', informationCardHeader);
})();
