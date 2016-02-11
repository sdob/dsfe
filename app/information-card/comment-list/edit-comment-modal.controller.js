(function() {
  'use strict';

  function EditCommentModalController($scope, $timeout, $uibModalInstance, comment, dscomments) {
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
      // Dismiss the modal immediately
      $uibModalInstance.close({
        edited: true,
        text: vm.newText,
      });
    }
  }

  EditCommentModalController.$inject = [
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'comment',
    'dscomments',
  ];
  angular.module('divesites.informationCard').controller('EditCommentModalController', EditCommentModalController);
})();
