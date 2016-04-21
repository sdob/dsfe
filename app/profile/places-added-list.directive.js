(function() {
  'use strict';

  function placesAddedList() {
    return {
      controller: 'PlacesAddedListController',
      controllerAs: 'vm',
      scope: {
        editable: '=',
        user: '=',
      },
      templateUrl: 'profile/places-added-list.template.html',
    };
  }

  placesAddedList.$inject = [
  ];
  angular.module('divesites.profile').directive('placesAddedList', placesAddedList);
})();
