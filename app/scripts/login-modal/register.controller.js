(function() {
  'use strict';
  function RegisterController($auth, $scope, $timeout, dsapi, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.isSubmitting = false;
      vm.submit = submit;
    }

    function formatRequest(user) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
      const data = Object.assign({}, user);
      data.full_name = data.fullName;
      delete data.fullName;
      return data;
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function submit() {
      $scope.registerForm.$setSubmitted();
      if (!$scope.registerForm.$valid) {
        return;
      }

      vm.hasError = false;
      vm.isSubmitting = true;
      const data = formatRequest(vm.user);
      console.log('data');
      console.log(data);

      // Sign up
      $auth.signup(data)
      .then((response) => {
        // TODO: Persuade Satellizer that we're logged in now that we have the password
        return $auth.login({ username: data.email, password: data.password });
      })

      // Get the newly-created user's profile from the API server
      .then(dsapi.getOwnProfile)
      .then((response) => {
        // Store the user ID
        localStorageService.set('user', response.data.id);

        // Add some latency to the modal close to make it obvious to the user
        // that the request has been processed
        $timeout(() => {
          vm.isSubmitting = false;
          $scope.modalInstance.close();
        }, 500);
      })
      .catch((err) => {
        vm.isSubmitting = false;
        console.error('error from api server');
        console.error(err);
        vm.hasError = true;
        vm.errorMessage = err.data.message;
      });
    }
  }

  RegisterController.$inject = [
    '$auth',
    '$scope',
    '$timeout',
    'dsapi',
    'localStorageService',
  ];
  angular.module('divesites').controller('RegisterController', RegisterController);
})();
