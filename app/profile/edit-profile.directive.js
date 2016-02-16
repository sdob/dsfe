(function() {
  'use strict';
  function editProfile() {
    return {
      templateUrl: 'profile/edit-profile.template.html',
    };
  }

  editProfile.$inject = [
  ];
  angular.module('divesites.profile').directive('editProfile', editProfile);
})();
