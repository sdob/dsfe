(function() {
  function divesiteDetails() {
    return {
      templateUrl: 'edit-site/divesite-details.template.html',
    };
  }

  divesiteDetails.$inject = [];
  angular.module('divesites.editSite').directive('divesiteDetails', divesiteDetails);
})();
