(function() {
  'use strict';
  function SignInController($auth, $location, $scope,  dsapi, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.loginFacebook = loginFacebook;
      vm.loginGoogle = loginGoogle;
      vm.submit = submit;
      vm.user = {
      };
    }

    function goToProfile() {
      $location.path('/me');
    }

    function loginFacebook() {
      // Set isLoggingIn status
      $scope.status.isLoggingIn = true;
      $auth.authenticate('facebook')
      .then(() => {
        // Remove isLoggingIn status
        $scope.status.isLoggingIn = false;
      })
      .then(retrieveAndStoreUserID)
      .then(() => $scope.modalInstance.close('signed-in'))
      .then(goToProfile)
      .catch((err) => {
        // TODO: explain to the user that we couldn't log in
        console.error(`couldn't log in with facebook`);
      });
    }

    function loginGoogle() {
      // Set isLoggingIn status
      $scope.status.isLoggingIn = true;
      $auth.authenticate('google')
      .then(() => {
        // remove isLoggingIn status
        $scope.status.isLoggingIn = false;
      })
      .then(retrieveAndStoreUserID)
      .then(() => $scope.modalInstance.close('signed-in'))
      .then(goToProfile)
      .catch((err) => {
        // TODO: explain to the user that we couldn't log in
        console.error(`couldn't log in with google`);
      });
    }

    function retrieveAndStoreUserID() {
      return dsapi.getOwnProfile()
      .then((response) => {
        localStorageService.set('user', response.data.id);
        return response.data;
      });
    }

    function submit() {
      // Log in with username and password
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
      $auth.login({ username: user, password: password })
      .then(retrieveAndStoreUserID)
      .then(() => $scope.modalInstance.close('signed-in'))
      .then(goToProfile)
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
