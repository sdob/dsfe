(function () {'use strict';
 angular.module('divesites', [
   'LocalStorageModule', 'ngRoute', 'uiGmapgoogle-maps',
   'ui.bootstrap',
 ])
 .config(function ($routeProvider) {
   $routeProvider
   .when('/', {
     templateUrl: 'views/main.html',
   })
   .when('/users/:userId', {
     template: '<profile></profile>'
   })
   .when('/divesites/:divesiteId', {
     templateUrl: 'views/divesite.html',
   });
 });
})();
