(function() {
  'use strict';

  function CommentListController($auth, $scope, $timeout, $uibModal, commentService, dscomments, localStorageService) {
    const vm = this;
    activate();

    function activate() {
      vm.isSubmitting = false;
      console.log($scope);
      $scope.userID = localStorageService.get('user');
      vm.comment = {
      };
      vm.isAuthenticated = $auth.isAuthenticated;
      console.log($scope);
      vm.siteType = $scope.site.type;
      vm.submit = submit;
      vm.summonEditCommentModal = summonEditCommentModal;
      vm.summonConfirmCommentDeletionModal = summonConfirmCommentDeletionModal;

      vm.apiCalls = commentService.apiCalls[vm.siteType];
      console.log(vm.apiCalls);
    }

    function submit() {
      const request = {
        text: vm.comment.text,
        [vm.siteType]: $scope.site.id,
      };

      vm.isSubmitting = true;

      vm.apiCalls.create(request)
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
          comment: () => {
            return comment;
          },
          type: () => {
            return vm.siteType;
          },
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
          vm.apiCalls.delete(comment.id);
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
            vm.apiCalls.update(comment.id);
          } else {
            // Empty comments are deleted, optimistically in the DOM and
            // then server-side in the background
            $scope.comments.splice($index, 1);
            vm.apiCalls.delete(comment.id);
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
    'commentService',
    'dscomments',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('CommentListController', CommentListController);
})();
