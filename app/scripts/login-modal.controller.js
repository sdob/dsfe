(function () {
  'use strict';
  function LoginModalController($auth, $scope, $uibModalInstance, API_URL) {
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
        // On success, dismiss the login modal
        $uibModalInstance.close();
      })
      .catch((response) => {
        console.error('error from api server');
        console.error(response.data);
      });
    }
  }

  LoginModalController.$inject = ['$auth', '$scope', '$uibModalInstance', 'API_URL',];
  angular.module('divesites').controller('LoginModalController', LoginModalController);
})();
