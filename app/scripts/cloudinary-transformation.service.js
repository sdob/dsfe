(function () {
  'use strict';
  function cloudinaryTransformation() {
    return {
      cropSquare: (imgUrl, dimension) => {
        const a = document.createElement('a');
        a.href= imgUrl;
        if (!a.hostname.endsWith('cloudinary.com')) {
          return '';
        }
        const insertionPoint = imgUrl.indexOf('upload/') + 'upload/'.length;
        return `${imgUrl.substring(0, insertionPoint)}w_${dimension},h_${dimension},c_fill/${imgUrl.substring(insertionPoint)}`;
      },
    };
  }
  angular.module('divesites').factory('cloudinaryTransformation', cloudinaryTransformation);
})();
