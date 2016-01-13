(function () {
  'use strict';
  function LoginModalController($auth, $scope, $timeout, $uibModalInstance, API_URL, dsapi, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.submit = submit;
    }

    function submit() {
      // Set the login form to submitted (this will flag validation errors)
      $scope.loginModalForm.$setSubmitted();
      if (!$scope.loginModalForm.$valid) {
        return;
      }
      vm.hasError = false;
      vm.isSubmitting = true; // disable the save button
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
        vm.isSubmitting = false;
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
