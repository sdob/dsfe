(function() {
  'use strict';
  function editProfile() {
    return {
      templateUrl: 'profile/edit-profile.html',
    };
  }

  editProfile.$inject = [
  ];
  angular.module('divesites.profile').directive('editProfile', editProfile);
})();
