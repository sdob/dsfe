(function() {
  'use strict';

  function EditCommentModalController($scope, $timeout, $uibModal, $uibModalInstance, comment, dscomments) {
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
      if (!vm.newText) {
        // If comment text is empty, then make sure we confirm it
        const instance = $uibModal.open({
          // Ugly hack to inline the controller, but we don't seem to be
          // able to get a ConfirmCommentDeletionController here
          controller: function ($uibModalInstance) {
            const vm = this;
            vm.cancel = () => {
              $uibModalInstance.close();
            };
            vm.delete = () => {
              $uibModalInstance.close('confirmed');
            };
          },
          controllerAs: 'vm',
          size: 'sm',
          templateUrl: 'information-card/comment-list/confirm-comment-deletion-modal.template.html',
          windowClass: 'modal-center',
        });
        instance.result.then((reason) => {
          if (reason === 'confirmed') {
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
    'dscomments',
  ];
  angular.module('divesites.informationCard').controller('EditCommentModalController', EditCommentModalController);
})();
