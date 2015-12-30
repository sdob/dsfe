(function () {'use strict';
 const API_URL = 'http://localhost:8000/';
 angular.module('divesites', [
   'LocalStorageModule', 'ngRoute', 'uiGmapgoogle-maps',
   'ui.bootstrap', 'satellizer'
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
   })
   .when('/add-site', {
     template: '<add-site></add-site>',
   })
   .when('/log-dive/:divesiteId', {
     template: '<log-dive></log-dive>',
   });
 })
 .constant('API_URL', API_URL)
 .config(($authProvider) => {
   // Send login attempts to our API server
   $authProvider.loginUrl = `${API_URL}api-token-auth/`;
 })
 ;
})();
