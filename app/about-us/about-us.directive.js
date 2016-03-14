(function() {
  function aboutUs() {
    return {
      templateUrl: 'about-us/about-us.template.html',
    };
  }

  aboutUs.$inject = [
  ];
  angular.module('divesites.aboutUs').directive('aboutUs', aboutUs);
})();
