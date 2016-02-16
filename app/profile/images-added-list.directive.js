(function() {
  'use strict';

  function imagesAddedList() {
    return {
      templateUrl: 'profile/images-added-list.template.html',
    };
  }

  imagesAddedList.$inject = [
  ];
  angular.module('divesites.profile').directive('imagesAddedList', imagesAddedList);
})();
