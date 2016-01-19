(function() {
  function divesiteDetails() {
    return {
      templateUrl: 'views/edit-site/divesite-details.html',
    };
  }

  divesiteDetails.$inject = [];
  angular.module('divesites.editSite').directive('divesiteDetails', divesiteDetails);
})();
