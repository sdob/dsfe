(function() {
  'use strict';

  function dsimgService($http, API_URL, cachingService) {

    // Retrieve or create a cache for API calls by this factory
    const imageCache = cachingService.getOrCreateCache('imageCache');

    return {
      API_URL,
      clearSiteHeaderImage,
      deleteSiteImage,
      deleteUserProfileImage,
      formatAsThumbnail,
      getSiteHeaderImage,
      getSiteImages,
      getUserImages,
      getUserProfileImage,
      setSiteHeaderImage,
      updateSiteImage,
    };

    function clearSiteHeaderImage(site) {
      return $http.delete(`${API_URL}/${site.type}s/${site.id}/header_image/`);
    }

    function deleteUserProfileImage(id) {
      return $http.delete(`${API_URL}/users/${id}/profile_image/`);
    }

    function getSiteHeaderImage(site) {
      return $http.get(`${API_URL}/${site.type}s/${site.id}/header_image/`);
    }

    function deleteSiteImage(site, id) {
      return $http.delete(`${API_URL}/${site.type}s/${site.id}/images/${id}/`);
    }

    function getSiteImages(site) {
      return $http.get(`${API_URL}/${site.type}s/${site.id}/images/`);
    }

    function getUserImages(id) {
      return $http.get(`${API_URL}/users/${id}/images/`);
    }

    function getUserProfileImage(id, transformResponse) {
      let transforms = $http.defaults.transformResponse;
      if (transformResponse) {
        transforms = transforms.concat(transformResponse);
      }

      return $http.get(`${API_URL}/users/${id}/profile_image/`, {
        cache: imageCache,
        transformResponse: transforms,
      });
    }

    function setSiteHeaderImage(site, id) {
      return $http.post(`${API_URL}/${site.type}s/${site.id}/header_image/`, { id });
    }

    function updateSiteImage(site, image, data) {
      return $http.patch(`${API_URL}/${site.type}s/${site.id}/images/${image.id}/`, data);
    }

    function formatAsThumbnail(data) {
      console.log('response data: ');
      console.log(data);
      // Acquire the URL for a 60x60 Cloudinary image
      if (data) {
        const thumbnailURL = $.cloudinary.url(data.public_id, {
          height: 60,
          width: 60,
          crop: 'fill',
          gravity: 'face',
        });
        console.log(`returning ${thumbnailURL}`);
        return thumbnailURL;
      }

      return undefined;
    }
  }

  dsimgService.$inject = [
    '$http',
    'API_URL',
    'cachingService',
  ];
  angular.module('divesites.apis').factory('dsimg', dsimgService);
})();
