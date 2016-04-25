(function() {
  'use strict';

  function loadableStatistic() {
    return {
      scope: {
        value: '=',
      },
      templateUrl: 'widgets/loadable-statistic.template.html',
    };
  }

  angular.module('divesites.widgets').directive('loadableStatistic', loadableStatistic);
})();
