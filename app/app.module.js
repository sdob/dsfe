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
    'divesites.caching',
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
  .run(($location, $rootScope, $uibModalStack, localStorageService) => {
    const cloudName = 'cloud_name';
    $.cloudinary.config()[cloudName] = 'divesites';
    $rootScope.$on('$routeChangeStart', (event, next, current) => {
      // Pause event resolution
      event.preventDefault();

      // If we're heading to a profile page, then check whether it's
      // a logged-in user's own profile page, and redirect accordingly
      if (next.params.userId !== undefined) {
        console.log('Looking for a profile page');
        if (localStorageService.get('user') === next.params.userId) {
          console.log('Looking for own profile page; redirecting to /me');
          return $location.path('/me');
        }
      } else {
        // If not, then proceed with event resolution
        event.defaultPrevented = false;
      }
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
