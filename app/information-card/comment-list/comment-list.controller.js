(function() {
  'use strict';

  function CommentListController($auth, $scope, $timeout, dscomments) {
    const vm = this;
    activate();

    function activate() {
      console.log($scope);
      vm.comment = {
      };
      vm.isAuthenticated = $auth.isAuthenticated;
      vm.submit = submit;
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
        console.log(response.data);
        $scope.$emit('comment-added');
        // Clear the model
        vm.comment = {};
        // Delay the timeout for a while so that users don't
        // repeatedly re-comment
        $timeout(() => {
          vm.isSubmitting = false;
        });
      })
      .catch((err) => {
        console.error(err);
      });
      // console.log($scope);
      //dscomments.postDivesiteComment($scope.commentForm);
    }
  }

  CommentListController.$inject = [
    '$auth',
    '$scope',
    '$timeout',
    'dscomments',
  ];
  angular.module('divesites.informationCard').controller('CommentListController', CommentListController);
})();
