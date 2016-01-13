(function () {
  function InformationCardActionsController($auth, $scope) {
    const vm = this;
    activate();

    function activate() {
      vm.isAuthenticated = $auth.isAuthenticated;
      console.log('actions controller');
      console.log($scope);
    }
  }
  InformationCardActionsController.$inject = ['$auth', '$scope',];
  angular.module('divesites.informationCard').controller('InformationCardActionsController', InformationCardActionsController);
})();
