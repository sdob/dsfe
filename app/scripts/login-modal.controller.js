(function () {
  'use strict';
  function LoginModalController($auth, $scope, $timeout, $uibModalInstance, API_URL, dsapi, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.signIn = {
        isSubmitting: false,
        submit: signInSubmit,
      };
      vm.register = {
        isSubmitting: false,
        submit: registerSubmit,
      };
      vm.user = {
      };
    }

    function registerSubmit() {
      // Adding a new user
      $scope.registerModalForm.$setSubmitted();
      //console.log($scope.registerModalForm);
      console.log($scope.registerModalForm.passwordConfirm);
      if (!$scope.registerModalForm.$valid) {
        console.error('invalid form...');
        return;
      }
      vm.register.isSubmitting = true;
      $timeout(() => {
        vm.register.isSubmitting = false;
      }, 1000);
    }

    function signInSubmit() {
      // Set the login form to submitted (this will flag validation errors)
      $scope.loginModalForm.$setSubmitted();
      if (!$scope.loginModalForm.$valid) {
        return;
      }
      vm.hasError = false;
      vm.signIn.isSubmitting = true; // disable the save button
      const user = vm.email;
      const password = vm.password;
      console.log({username: user, password: password});
      $auth.login({username: user, password: password})
      .then((response) => {
        // Dismiss the login modal
        $uibModalInstance.close();
      })
      // Get the user's profile from the API server
      .then(dsapi.getOwnProfile)
      .then((response) => {
        // Store the user ID
        console.log(response);
        localStorageService.set('user', response.data.id);
      })
      .catch((response) => {
        vm.signIn.isSubmitting = false;
        console.error('error from api server');
        console.error(response.data);
        vm.hasError = true;
        // TODO: display error message on modal
      });
    }
  }

  LoginModalController.$inject = ['$auth', '$scope', '$timeout', '$uibModalInstance', 'API_URL', 'dsapi', 'localStorageService',];
  angular.module('divesites').controller('LoginModalController', LoginModalController);
})();
