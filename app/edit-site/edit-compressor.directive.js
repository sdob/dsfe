(function() {
  'use strict';
  function editCompressor() {
    return {
      templateUrl: 'edit-site/edit-compressor.template.html',
    };
  }

  angular.module('divesites.editSite').directive('editCompressor', editCompressor);
})();
