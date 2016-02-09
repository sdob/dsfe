(function() {
  'use strict';

  function CommentListController($auth, $scope, dscomments) {
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
    'dscomments',
  ];
  angular.module('divesites.informationCard').controller('CommentListController', CommentListController);
})();
