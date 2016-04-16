(function() {
  'use strict';

  function imagesAddedList() {
    return {
      controller: 'ImagesAddedListController',
      controllerAs: 'vm',
      scope: {
        editable: '=',
        user: '=',
      },
      templateUrl: 'profile/images-added-list.template.html',
    };
  }

  imagesAddedList.$inject = [
  ];
  angular.module('divesites.profile').directive('imagesAddedList', imagesAddedList);
})();
