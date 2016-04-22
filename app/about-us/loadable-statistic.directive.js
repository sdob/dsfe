(function() {
  'use strict';

  function loadableStatistic() {
    return {
      scope: {
        value: '=',
      },
      templateUrl: 'about-us/loadable-statistic.template.html',
    };
  }

  angular.module('divesites.aboutUs').directive('loadableStatistic', loadableStatistic);
})();
