(function () {'use strict';
 angular.module('divesites', ['LocalStorageModule', 'ngRoute', 'uiGmapgoogle-maps'])
 .config(function ($routeProvider) {
   $routeProvider
   .when('/', {
     templateUrl: 'views/main.html',
   });
 });
})();
