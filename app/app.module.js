(function() {
  'use strict';

  angular.module('divesites', [
    'LocalStorageModule',
    'bootstrapLightbox',
    'ngFileUpload',
    'ngRoute',
    'satellizer',
    'uiGmapgoogle-maps',
    'ui.bootstrap',

    /* Feature areas */
    'divesites.constants',
    'divesites.editSite',
    'divesites.informationCard',
    'divesites.login',
    'divesites.map',
    'divesites.navigationBar',
    'divesites.profile',
    'divesites.widgets',
  ])
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
