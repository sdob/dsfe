(function() {
  'use strict';
  function LoginModalController($auth, $location, $scope, $timeout, $uibModalInstance, API_URL, dsapi, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.register = {
        isSubmitting: false,
        submit: registerSubmit,
        user: {
        },
      };
      $scope.signInModalForm = {};
      $scope.registerModalForm = {};
      $scope.modalInstance = $uibModalInstance;
    }

    function registerSubmit() {
      // Adding a new user
      console.log($scope.registerModalForm.passwordConfirm);
      if (!$scope.registerModalForm.$valid) {
        console.error('invalid form...');
        return;
      }

      vm.register.isSubmitting = true;
      $timeout(() => {
        vm.register.isSubmitting = false;

        // Dismiss the login modal
        $uibModalInstance.close();
        console.log('OK DOK');

        // Redirect to a welcome page (?)
        $location.path('/registration-successful/');
      }, 1000);
    }
  }

  LoginModalController.$inject = [
    '$auth',
    '$location',
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'API_URL',
    'dsapi',
    'localStorageService',
  ];
  angular.module('divesites').controller('LoginModalController', LoginModalController);
})();
