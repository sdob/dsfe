(function() {
  'use strict';
  function SignInController($auth, $location, $scope, dsapi, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.loginFacebook = loginFacebook;
      vm.loginGoogle = loginGoogle;
      vm.submit = submit;
      vm.user = {
      };

      console.log('SignInController.activate()');
      console.log($scope);
      //console.log(`isLoggingIn: ${$scope.status.isLoggingIn}`);
      //console.log(`isLoggingIn: ${$scope.status.isLoggingIn}`);
    }

    function goToProfile() {
      $location.path('/me');
    }

    function loginFacebook() {
      // Set isLoggingIn status
      $scope.status.isLoggingIn = true;
      console.log('trying to log in with facebook');
      $auth.authenticate('facebook')
      .then(() => {
        // Remove isLoggingIn status
        $scope.status.isLoggingIn = false;
        console.log('finished authenticating w/ facebook');
        $scope.modalInstance.close();
      })
      .then(goToProfile)
      .catch((err) => {
        console.error(`couldn't log in with facebook`);
      });
    }

    function loginGoogle() {
      console.log('trying to log in with google');
      // Set isLoggingIn status
      $scope.status.isLoggingIn = true;
      $auth.authenticate('google')
      .then(() => {
        // remove isLoggingIn status
        $scope.status.isLoggingIn = false;
        console.log('finished authenticating with google');
        $scope.modalInstance.close();
      })
      .then(goToProfile);
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
      // Set form-wide isLoggingIn status
      $scope.status.isLoggingIn = true;
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
        // Remove form-wide isLoggingIn status
        $scope.status.isLoggingIn = false;
        console.error('error from api server');
        console.error(response.data);
        vm.hasError = true;

        // TODO: display error message on modal
      });
    }
  }

  SignInController.$inject = [
    '$auth',
    '$location',
    '$scope',
    'dsapi',
    'localStorageService',
  ];
  angular.module('divesites.login').controller('SignInController', SignInController);
})();
