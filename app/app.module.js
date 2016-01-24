(function() {
  'use strict';

  const API_URL = '//divesites-api.herokuapp.com';

  angular.module('divesites', [
    'LocalStorageModule',
    'bootstrapLightbox',
    'ngFileUpload',
    'ngRoute',
    'satellizer',
    'uiGmapgoogle-maps',
    'ui.bootstrap',

    /* Feature areas */
    'divesites.editSite',
    'divesites.informationCard',
    'divesites.login',
    'divesites.map',
    'divesites.profile',
  ])
  .config(($routeProvider) => {
    $routeProvider
    .when('/', {
      template: '<map></map>',
      reloadOnSearch: false,
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
    .when('/add-slipway/', {
      template: '<edit-slipway></edit-slipway',
      controller: 'EditSlipwayController',
      controllerAs: 'vm',
    })
    .when('/edit-compressor/:id', {
      template: '<edit-compressor></edit-compressor>',
      controller: 'EditCompressorController',
      controllerAs: 'vm',
    })
    .when('/edit-site/:id', {
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
      controller: 'ProfileController',
      controllerAs: 'vm',
    })
    .when('/divesites/:divesiteId', {
      templateUrl: 'views/divesite.html',
    })
    .when('/log-dive/:divesiteId', {
      template: '<log-dive></log-dive>',
    })
    .when('/upload-divesite-image/:id', {
      template: '<upload-divesite-image></upload-divesite-image>',
      controller: 'UploadDivesiteImageController',
      controllerAs: 'vm',
    })
    .when('/me', {
      template: '<profile></profile>',
      controller: 'OwnProfileController',
      controllerAs: 'vm',
    })
    .when('/me/edit', {
      template: '<edit-profile></edit-profile>',
      controller: 'EditProfileController',
      controllerAs: 'vm',
    });
  })
  .config(($authProvider) => {
    // Send login attempts to our API server
    $authProvider.loginUrl = `${API_URL}/api-token-auth/`;
    $authProvider.signupUrl = `${API_URL}/auth/register`;
    $authProvider.authToken = 'Token';
    $authProvider.tokenName = 'key';

    $authProvider.facebook({
      clientId: '1718633528365627',
      url: `${API_URL}/auth/facebook/`,
    });
    $authProvider.google({
      clientId: '930190391486-htfppm57kf48nf1mr6gmcq9jknmtjkfn.apps.googleusercontent.com',
      url: `${API_URL}/auth/google/`,
    });
  })
  .run(($rootScope) => {
    const cloudName = 'cloud_name';
    $.cloudinary.config()[cloudName] = 'divesites';
    $rootScope.$on('$routeChangeStart', (event, next, current) => {
      console.log('$routeChangeStart');
    });

    // angular-google-maps installs lodash 4.x but uses '_.contains' and
    // '.object (changed to _.includes and _.zipObject respectively in lodash 4.x).
    // This is a little compatibility fix that hopefully won't be needed after
    // angular-google-maps updates. See:
    // http://stackoverflow.com/questions/32711687/angular-google-maps-contains-is-not-a-function-in-chrome
    if (typeof _.contains === 'undefined') {
      _.contains = _.includes;
    }

    if (typeof _.object === 'undefined') {
      _.object = _.zipObject;
    }
  });
})();
