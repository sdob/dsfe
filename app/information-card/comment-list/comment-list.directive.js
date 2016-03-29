(function() {
  'use strict';

  function commentList() {
    return {
      controller: 'CommentListController',
      controllerAs: 'vm',
      link,
      scope: {
        comments: '=',
        site: '=',
        userProfileImageUrls: '=',
      },
      templateUrl: 'information-card/comment-list/comment-list.template.html',
    };

    function link(scope, element) {
    }
  }

  commentList.$inject = [
  ];
  angular.module('divesites.informationCard').directive('commentList', commentList);
})();
