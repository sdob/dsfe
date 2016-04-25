(function() {
  'use strict';

  function EditCommentModalController($scope, $timeout, $uibModal, $uibModalInstance, comment, confirmModalService, dscomments) {
    const { reasons, summonConfirmModal } = confirmModalService;
    const vm = this;
    activate();

    function activate() {
      console.log($scope);
      vm.cancel = cancel;
      vm.comment = comment;
      vm.submit = submit;
      vm.newText = comment.text;
    }

    function cancel() {
      $uibModalInstance.close('cancelled');
    }

    function submit() {
      // If comment text is empty, then make sure we confirm it
      if (!vm.newText) {
        const instance = summonConfirmModal({
          templateUrl: 'information-card/comment-list/confirm-comment-deletion-modal.template.html',
        });
        instance.result.then((reason) => {
          if (reason === reasons.CONFIRMED) {
            $uibModalInstance.close({
              edited: true,
              text: vm.newText,
            });
          }
        });
      } else {
        // Dismiss the modal immediately
        $uibModalInstance.close({
          edited: true,
          text: vm.newText,
        });
      }
    }
  }

  EditCommentModalController.$inject = [
    '$scope',
    '$timeout',
    '$uibModal',
    '$uibModalInstance',
    'comment',
    'confirmModalService',
    'dscomments',
  ];
  angular.module('divesites.informationCard').controller('EditCommentModalController', EditCommentModalController);
})();
