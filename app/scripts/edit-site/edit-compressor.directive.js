(function() {
  'use strict';
  function editCompressor() {
    return {
      templateUrl: 'views/edit-site/edit-compressor.html',
    };
  }

  angular.module('divesites.editSite').directive('editCompressor', editCompressor);
})();
