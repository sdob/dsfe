(function() {
  'use strict';
  function ConfirmCommentDeletionModalController($scope, $timeout, $uibModalInstance, comment, dsapi) {
    const vm = this;
    activate();

    function activate() {
      console.log($scope);
      console.log(comment);
      vm.cancel = cancel;
      vm.delete = performDelete;
      vm.comment = comment;
      console.log('confirming with comment');
      console.log(vm.comment);
    }

    function cancel() {
      $uibModalInstance.close();
    }

    function performDelete() {
      vm.isDeleting = true;
      console.log('deleting');
      $uibModalInstance.close('confirmed');
      // We'll move comment deletion functionality to the main comment list controller
      /*
      dsapi.deleteDivesiteComment(vm.comment.id)
      .then((response) => {
        $timeout(() => {
          vm.isDeleting = false;
          $uibModalInstance.close('deleted');
        }, 500);
      })
      .catch((err) => {
        console.error(err);
      });
      console.log('$scope.site');
      console.log($scope.site);
      */
    }
  }

  ConfirmCommentDeletionModalController.$inject = [
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'comment',
    'dsapi',
  ];
  angular.module('divesites.informationCard').controller('ConfirmCommentDeletionModalController', ConfirmCommentDeletionModalController);
})();
