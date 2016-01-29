(function() {
  function aboutUs() {
    return {
      templateUrl: 'about-us/about-us.html',
    };
  }

  aboutUs.$inject = [
  ];
  angular.module('divesites.aboutUs').directive('aboutUs', aboutUs);
})();
