(function() {
  'use strict';
  angular.module('divesites').config(($routeProvider) => {
    $routeProvider
    .when('/', {
      template: '<map></map>',
      reloadOnSearch: false,
    })
    .when('/about-us', {
      template: '<about-us></about-us>',
      controller: 'AboutUsController',
      controllerAs: 'vm',
    })
    .when('/add-compressor', {
      template: '<edit-compressor></edit-compressor>',
      controller: 'EditCompressorController',
      controllerAs: 'vm',
    })
    .when('/add-site', {
      template: '<edit-site></edit-site>',
      controller: 'EditSiteController',
      controllerAs: 'vm',
    })
    .when('/add-slipway', {
      template: '<edit-slipway></edit-slipway>',
      controller: 'EditSlipwayController',
      controllerAs: 'vm',
    })
    .when('/edit-compressor/:id', {
      template: '<edit-compressor></edit-compressor>',
      controller: 'EditCompressorController',
      controllerAs: 'vm',
    })
    .when('/edit-divesite/:id', {
      template: '<edit-site></edit-site>',
      controller: 'EditSiteController',
      controllerAs: 'vm',
    })
    .when('/edit-slipway/:id', {
      template: '<edit-slipway></edit-slipway>',
      controller: 'EditSlipwayController',
      controllerAs: 'vm',
    })
    .when('/users/:userId', {
      template: '<profile></profile>',
    })
    .when('/divesites/:divesiteId', {
      templateUrl: 'views/divesite.html',
    })
    .when('/log-dive/:divesiteId', {
      template: '<log-dive></log-dive>',
    })
    .when('/me', {
      template: '<own-profile></own-profile>',
    })
    .when('/me/edit', {
      template: '<edit-profile></edit-profile>',
      controller: 'EditProfileController',
      controllerAs: 'vm',
    });
  });
})();
