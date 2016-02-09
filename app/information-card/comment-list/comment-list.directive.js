(function() {
  'use strict';

  function commentList() {
    return {
      controller: 'CommentListController',
      controllerAs: 'vm',
      scope: {
        comments: '=',
        site: '=',
      },
      templateUrl: 'information-card/comment-list/comment-list.html',
    };
  }

  commentList.$inject = [
  ];
  angular.module('divesites.informationCard').directive('commentList', commentList);
})();
