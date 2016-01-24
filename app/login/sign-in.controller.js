(function() {
  'use strict';
  function SignInController($auth, $scope, dsapi, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.loginFacebook = loginFacebook;
      vm.loginGoogle = loginGoogle;
      vm.submit = submit;
      vm.user = {
      };
    }

    function loginFacebook() {
      console.log('trying to log in with facebook');
      $auth.authenticate('facebook')
      .then(() => {
        console.log('finished authenticating w/ facebook');
      });
    }

    function loginGoogle() {
      console.log('trying to log in with google');
      $auth.authenticate('google')
      .then(() => {
        console.log('finished authenticating with google');
      });
    }

    function submit() {
      console.log($scope.modalInstance);

      // Set the login form to submitted (this will flag validation errors)
      $scope.signInForm.$setSubmitted();
      if (!$scope.signInForm.$valid) {
        return;
      }

      vm.hasError = false;
      vm.isSubmitting = true; // disable the save button
      const user = vm.user.email;
      const password = vm.user.password;
      console.log({ username: user, password: password });
      $auth.login({ username: user, password: password })
      .then((response) => {
        // Dismiss the login modal
        $scope.modalInstance.close();
      })
      .then(dsapi.getOwnProfile) // Get the user's profile from the API server
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

  SignInController.$inject = [
    '$auth',
    '$scope',
    'dsapi',
    'localStorageService',
  ];
  angular.module('divesites.login').controller('SignInController', SignInController);
})();
