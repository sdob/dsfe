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
    .when('/add-divesite', {
      template: '<edit-divesite></edit-divesite>',
      controller: 'EditDivesiteController',
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
      template: '<edit-divesite></edit-divesite>',
      controller: 'EditDivesiteController',
      controllerAs: 'vm',
    })
    .when('/edit-slipway/:id', {
      template: '<edit-slipway></edit-slipway>',
      controller: 'EditSlipwayController',
      controllerAs: 'vm',
    })
    .when('/users/:userId', {
      reloadOnSearch: false,
      template: '<profile></profile>',
    })
    .when('/edit-profile', {
      template: '<edit-profile></edit-profile>',
      controller: 'EditProfileController',
      controllerAs: 'vm',
    });
  });
})();
