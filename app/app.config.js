(function() {
  angular.module('divesites').config(($authProvider, API_URL, FACEBOOK_CLIENT_ID, GOOGLE_CLIENT_ID, GOOGLE_MAPS_API_KEY, LightboxProvider, cloudinaryProvider, uiGmapGoogleMapApiProvider) => {
    // Send login attempts to our API server
    $authProvider.loginUrl = `${API_URL}/auth/login/`;
    $authProvider.signupUrl = `${API_URL}/auth/register`;
    $authProvider.authToken = 'Token';
    $authProvider.tokenName = 'key';

    // Configure browser-side Facebook authentication
    $authProvider.facebook({
      clientId: FACEBOOK_CLIENT_ID,
      url: `${API_URL}/auth/facebook/`,
    });

    // Configure browser-side Google authentication
    $authProvider.google({
      clientId: GOOGLE_CLIENT_ID,
      url: `${API_URL}/auth/google/`,
    });

    /* Configure Bootstrap lightbox */

    // scale all images up
    LightboxProvider.fullScreenMode = true;
    // use custom template
    LightboxProvider.templateUrl = 'templates/lightbox.html';

    /* Configure Google Maps */
    uiGmapGoogleMapApiProvider.configure({
      key: GOOGLE_MAPS_API_KEY,
    });

    /* Configure cloudinary_angular */
    cloudinaryProvider
    .set('cloud_name', 'divesites');
  });
})();
