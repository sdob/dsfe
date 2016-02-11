(function() {
  'use strict';

  function commentService(dscomments) {
    const apiCalls = {
      compressor: {
        create: dscomments.postCompressorComment,
        update: dscomments.updateCompressorComment,
        delete: dscomments.deleteCompressorComment,
      },
      divesite: {
        create: dscomments.postDivesiteComment,
        update: dscomments.updateDivesiteComment,
        delete: dscomments.deleteDivesiteComment,
      },
      slipway: {
        create: dscomments.postSlipwayComment,
        update: dscomments.updateSlipwayComment,
        delete: dscomments.deleteSlipwayComment,
      },
    };

    return {
      apiCalls,
    };
  }

  commentService.$inject = [
    'dscomments',
  ];
  angular.module('divesites.informationCard').factory('commentService', commentService);
})();
