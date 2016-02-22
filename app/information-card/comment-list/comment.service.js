(function() {
  'use strict';

  function commentService(dscomments) {
    const apiCalls = {
      create: dscomments.postSiteComment,
      retrieve: dscomments.getSiteComments,
      update: dscomments.updateSiteComment,
      delete: dscomments.deleteSiteComment,
      /*
      compressor: {
        create: dscomments.postCompressorComment,
        retrieve: dscomments.getCompressorComments,
        update: dscomments.updateCompressorComment,
        delete: dscomments.deleteCompressorComment,
      },
      divesite: {
        create: dscomments.postDivesiteComment,
        retrieve: dscomments.getDivesiteComments,
        update: dscomments.updateDivesiteComment,
        delete: dscomments.deleteDivesiteComment,
      },
      slipway: {
        create: dscomments.postSlipwayComment,
        retrieve: dscomments.getSlipwayComments,
        update: dscomments.updateSlipwayComment,
        delete: dscomments.deleteSlipwayComment,
      },
      */
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
