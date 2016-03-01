(function() {
  'use strict';

  /* Main app module. */
  angular.module('divesites', [
    /* Third-party dependencies */
    'ngAnimate',
    'LocalStorageModule',
    'bootstrapLightbox',
    'infinite-scroll',
    'markdown',
    'ngFileUpload',
    'ngRoute',
    'ngSanitize',
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
    'divesites.aboutUs',
    'divesites.profile',
    'divesites.services',
    'divesites.userSettings',
    'divesites.widgets',
  ])
  .run(($rootScope, $uibModalStack) => {
    const cloudName = 'cloud_name';
    $.cloudinary.config()[cloudName] = 'divesites';
    $rootScope.$on('$routeChangeStart', (event, next, current) => {
      console.log('$routeChangeStart');
    });

    // Intercept $locationChangeStart events and close an existing modal instead.
    // TODO: This isn't a great approach, because it means that we can't navigate
    // out of a modal (any navigation triggers a $locationChangeStart).
    $rootScope.$on('$locationChangeStart', (event) => {
      event.preventDefault();
      const top = $uibModalStack.getTop();
      if (top) {
        $uibModalStack.dismiss(top.key);
      } else {
        event.defaultPrevented = false;
      }
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
