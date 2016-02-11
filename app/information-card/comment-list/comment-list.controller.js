(function() {
  'use strict';

  function CommentListController($auth, $scope, $timeout, $uibModal, dscomments, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.isSubmitting = false;
      console.log($scope);
      $scope.userID = localStorageService.get('user');
      vm.comment = {
      };
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.submit = submit;
      vm.summonEditCommentModal = summonEditCommentModal;
      vm.summonConfirmCommentDeletionModal = summonConfirmCommentDeletionModal;
    }

    function submit() {
      vm.isSubmitting = true;
      console.log('submitting!');
      const request = {
        text: vm.comment.text,
        divesite: $scope.site.id,
      };
      console.log(request);
      dscomments.postDivesiteComment(request)
      .then((response) => {
        $scope.$emit('comment-added');
        // Clear the model
        vm.comment = {};
        // Delay the timeout for a while so that users don't
        // repeatedly re-comment
        $timeout(() => {
          vm.isSubmitting = false;
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
      });
      // console.log($scope);
    }

    function summonConfirmCommentDeletionModal(comment, $index) {
      const instance = $uibModal.open({
        controller: 'ConfirmCommentDeletionModalController',
        controllerAs: 'vm',
        resolve: {
          comment: () => comment,
        },
        size: 'sm',
        templateUrl: 'information-card/comment-list/confirm-comment-deletion-modal.html',
        windowClass: 'modal-center',
      });
      instance.result.then((reason) => {
        console.log('confirm modal closed');
        if (reason === 'confirmed') {
          // We can remove the comment from the DOM immediately
          $scope.comments.splice($index, 1);
          // Delete the comment in the background
          dscomments.deleteDivesiteComment(comment.id);
        }
      });
    }

    function summonEditCommentModal(comment, $index) {
      const instance = $uibModal.open({
        controller: 'EditCommentModalController',
        controllerAs: 'vm',
        resolve: {
          comment: () => comment,
        },
        size: 'lg',
        templateUrl: 'information-card/comment-list/edit-comment-modal.html',
      });
      instance.result.then((result) => {
        // If the edit was submitted, then update the DOM optimistically
        // and fire off a server request
        if (result.edited) {
          const { text } = result;
          if (text) {
            // Non-empty comments are edited
            comment.text = text; // update in the DOM
            // Make server request in the background
            dscomments.updateDivesiteComment(comment.id, { text });
          } else {
            // Empty comments are deleted
            $scope.comments.splice($index, 1);
            dscomments.deleteDivesiteComment(comment.id);
          }
          // $scope.$emit('comment-list-updated');
        }
      });
    }
  }

  CommentListController.$inject = [
    '$auth',
    '$scope',
    '$timeout',
    '$uibModal',
    'dscomments',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('CommentListController', CommentListController);
})();
