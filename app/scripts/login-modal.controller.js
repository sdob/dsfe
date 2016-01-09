(function () {
  'use strict';
  function LoginModalController($auth, $scope, $uibModalInstance, API_URL, dsapi, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.submit = submit;
    }

    function submit() {
      // Set the login form to submitted (this will flag validation errors)
      $scope.loginModalForm.$setSubmitted();
      // XXX: hardcoded for now
      const user = 'testuser@example.com';
      const password = 'password';
      // Use Satellizer to login on the API server
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
        console.error('error from api server');
        console.error(response.data);
      });
    }
  }

  LoginModalController.$inject = ['$auth', '$scope', '$uibModalInstance', 'API_URL', 'dsapi', 'localStorageService',];
  angular.module('divesites').controller('LoginModalController', LoginModalController);
})();
