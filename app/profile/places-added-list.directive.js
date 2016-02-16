(function() {
  'use strict';

  function placesAddedList() {
    return {
      templateUrl: 'profile/places-added-list.template.html',
    };
  }

  placesAddedList.$inject = [
  ];
  angular.module('divesites.profile').directive('placesAddedList', placesAddedList);
})();
