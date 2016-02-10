(function() {
  'use strict';

  function EditCommentModalController($timeout, $uibModalInstance, comment, dscomments) {
    const vm = this;
    activate();

    function activate() {
      vm.cancel = cancel;
      vm.comment = comment;
      vm.submit = submit;
    }

    function cancel() {
      $uibModal.close('cancelled');
    }

    function submit() {
      console.log('SUBMITTING');
      vm.isSubmitting = true;
      dscomments.updateDivesiteComment(vm.comment.id, vm.comment)
      .then((response) => {
        $timeout(() => {
          $uibModalInstance.close('edited');
        }, 1000);
      })
      .catch((err) => {
        $uibModalInstance.close(err);
      });
    }
  }

  EditCommentModalController.$inject = [
    '$timeout',
    '$uibModalInstance',
    'comment',
    'dscomments',
  ];
  angular.module('divesites.informationCard').controller('EditCommentModalController', EditCommentModalController);
})();
