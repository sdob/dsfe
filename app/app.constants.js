const API_URL = 'http://divesites-api.herokuapp.com';
const IMG_API_URL = 'http://dsimg.herokuapp.com';
angular.module('divesites')
  .constant('API_URL', API_URL)
  .constant('IMG_API_URL', IMG_API_URL)
  .constant('d3', d3)
  .constant('moment', moment);
