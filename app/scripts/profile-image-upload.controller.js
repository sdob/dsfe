(function () {
  'use strict';
  function ProfileImageUploadController($scope, $uibModalInstance, user) { const vm = this;
    vm.user = user;
    activate();

    function activate() {
      //console.log(vm);
      //console.log($scope);
      //console.log(user);
    }
  }

 ProfileImageUploadController.$inject = [
   '$scope',
   '$uibModalInstance',
   'user',
 ];
  angular.module('divesites').controller('ProfileImageUploadController', ProfileImageUploadController);
})();
