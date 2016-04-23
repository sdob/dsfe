(function() {
  'use strict';
  angular.module('divesites.informationCard', [
    'LocalStorageModule',
    'divesites.caching',
    'divesites.constants',
    'divesites.logDive',
    'divesites.reportProblem',
    'divesites.services',
    'divesites.userSettings',
    'satellizer',
    'ui.bootstrap',
  ]);
})();
