(function () {
  'use strict';
  function LoginModalController($auth, $scope, $uibModalInstance, API_URL) {
    const vm = this;
    activate();

    function activate() {
      console.log(`API_URL: ${API_URL}`);
      vm.submit = submit;
    }

    function submit() {
      console.log('LoginModalController.submit()');
      $scope.loginModalForm.$setSubmitted();
      const user = 'testuser@example.com';
      const password = 'password';
      $auth.login({username: user, password: password})
      .then((response) => {
        console.log('response from api server:');
        console.log(response.data);
        console.log(`user is authenticated: ${$auth.isAuthenticated()}`);
        $uibModalInstance.close();
      })
      .catch((response) => {
        console.log('error from api server');
        console.log(response.data);
      });
    }
  }

  LoginModalController.$inject = ['$auth', '$scope', '$uibModalInstance', 'API_URL',];
  angular.module('divesites').controller('LoginModalController', LoginModalController);
})();
