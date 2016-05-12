(function() {
  'use strict';
  angular.module('divesites').config(($routeProvider) => {
    $routeProvider
    .when('/', {
      reloadOnSearch: false,
      template: '<map></map>',
    })
    .when('/about-us', {
      controller: 'AboutUsController',
      controllerAs: 'vm',
      template: '<about-us></about-us>',
    })
    .when('/add-compressor', {
      controller: 'EditCompressorController',
      controllerAs: 'vm',
      template: '<edit-compressor></edit-compressor>',
    })
    .when('/add-divesite', {
      controller: 'EditSiteController',
      controllerAs: 'vm',
      resolve: {
        type: () => 'divesite',
      },
      template: '<edit-divesite></edit-divesite>',
    })
    .when('/add-slipway', {
      controller: 'EditSlipwayController',
      controllerAs: 'vm',
      template: '<edit-slipway></edit-slipway>',
    })
    .when('/edit-compressor/:id', {
      controller: 'EditCompressorController',
      controllerAs: 'vm',
      template: '<edit-compressor></edit-compressor>',
    })
    .when('/edit-divesite/:id', {
      controller: 'EditDivesiteController',
      controllerAs: 'vm',
      template: '<edit-divesite></edit-divesite>',
    })
    .when('/edit-slipway/:id', {
      controller: 'EditSlipwayController',
      controllerAs: 'vm',
      template: '<edit-slipway></edit-slipway>',
    })
    .when('/users/:userId', {
      reloadOnSearch: false,
      template: '<profile></profile>',
    })
    .when('/edit-profile', {
      controller: 'EditProfileController',
      controllerAs: 'vm',
      template: '<edit-profile></edit-profile>',
    });
  });
})();
