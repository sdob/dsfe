(function() {
  'use strict';

  function CommentListController($auth, $scope, $timeout, $uibModal, commentService, confirmModalService, dscomments, localStorageService) {
    const { reasons, summonConfirmModal } = confirmModalService;
    const vm = this;
    activate();

    function activate() {
      vm.isSubmitting = false;
      vm.comment = {
      };
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.site = $scope.site;
      vm.siteType = $scope.site.type;
      vm.submit = submit;
      vm.summonEditCommentModal = summonEditCommentModal;
      vm.summonConfirmCommentDeletionModal = summonConfirmCommentDeletionModal;
      vm.userID = localStorageService.get('user');

      console.log($scope);

      //vm.apiCalls = commentService.apiCalls[vm.siteType];
      vm.apiCalls = commentService.apiCalls;
      console.log(vm.siteType);
      console.log(vm.apiCalls);
    }

    function submit() {
      const request = {
        text: vm.comment.text,
        [vm.siteType]: $scope.site.id,
      };

      vm.isSubmitting = true;

      vm.apiCalls.create(vm.site, request)
      .then((response) => {
        console.log('successful submit');
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
    }

    function summonConfirmCommentDeletionModal(comment, $index) {
      /*
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
        templateUrl: 'information-card/comment-list/confirm-comment-deletion-modal.template.html',
        windowClass: 'modal-center',
      });
      */
      const instance = summonConfirmModal({
        templateUrl: 'information-card/comment-list/confirm-comment-deletion-modal.template.html',
      });
      instance.result.then((reason) => {
        if (reason === reasons.CONFIRMED) {
          // We can remove the comment from the DOM immediately
          $scope.comments.splice($index, 1);
          // Delete the comment in the background
          vm.apiCalls.delete(vm.site, comment.id);
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
        templateUrl: 'information-card/comment-list/edit-comment-modal.template.html',
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
            vm.apiCalls.update(vm.site, comment.id, comment);
          } else {
            // Empty comments are deleted, optimistically in the DOM and
            // then server-side in the background
            $scope.comments.splice($index, 1);
            vm.apiCalls.delete(vm.site, comment.id);
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
    'confirmModalService',
    'dscomments',
    'localStorageService',
  ];
  angular.module('divesites.informationCard').controller('CommentListController', CommentListController);
})();
