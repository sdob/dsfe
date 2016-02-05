(function() {
  'use strict';

  function placesAddedList() {
    return {
      templateUrl: 'profile/places-added-list.html',
    };
  }

  placesAddedList.$inject = [
  ];
  angular.module('divesites.profile').directive('placesAddedList', placesAddedList);
})();
