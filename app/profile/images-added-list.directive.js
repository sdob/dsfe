(function() {
  'use strict';

  function imagesAddedList() {
    return {
      templateUrl: 'profile/images-added-list.html',
    };
  }

  imagesAddedList.$inject = [
  ];
  angular.module('divesites.profile').directive('imagesAddedList', imagesAddedList);
})();
