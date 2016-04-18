(function() {
  'use strict';
  function SignInController($auth, $location, $scope,  dsapi, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.login = login;
      vm.submit = submit;
      vm.user = {
      };
    }

    function closeModal() {
      $scope.modalInstance.close('signed-in');
    }

    function goToProfile() {
      $location.path(`/users/${localStorageService.get('user')}`);
    }

    function handleLoginError(err) {
      // TODO: explain to the user that we couldn't log in
      console.error(err);
    }

    function login(provider) {
      // Set isLoggingIn status (to show the user that we're working)
      $scope.status.isLoggingIn = true;
      $auth.authenticate(provider)
      .then(retrieveAndStoreUserID)
      .then(closeModal)
      .then(goToProfile)
      .catch(handleLoginError);
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
