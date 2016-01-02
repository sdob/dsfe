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
     template: '<profile></profile>',
     controller: 'ProfileController',
     controllerAs: 'vm',
   })
   .when('/divesites/:divesiteId', {
     templateUrl: 'views/divesite.html',
   })
   .when('/add-site', {
     template: '<add-site></add-site>',
     controller: 'AddSiteController',
     controllerAs: 'vm',
   })
   .when('/log-dive/:divesiteId', {
     template: '<log-dive></log-dive>',
   })
   .when('/me', {
     template: '<profile></profile>',
     controller: 'OwnProfileController',
     controllerAs: 'vm',
   });
 })
 .constant('API_URL', API_URL)
 .config(($authProvider) => {
   // Send login attempts to our API server
   $authProvider.loginUrl = `${API_URL}api-token-auth/`;
   $authProvider.authToken = 'Token';
 })
 .run(($rootScope) => {
   $rootScope.$on('$routeChangeStart', (event, next, current) => {
     console.log('$routeChangeStart');
   });
 });
})();
