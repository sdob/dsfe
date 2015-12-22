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
     templateUrl: 'views/profile-view.html',
   })
   .when('/divesites/:divesiteId', {
     templateUrl: 'views/divesite.html',
   });
 });
})();
