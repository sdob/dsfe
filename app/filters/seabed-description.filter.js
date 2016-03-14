(function() {
  'use strict';

  function seabedDescription(seabedTypesService) {
    const { seabedTypes } = seabedTypesService;
    return (s) => {
      const seabed = seabedTypes.filter(x => x.value === s.value);
      if (seabed.length) {
        return seabed[0].description;
      }

      return undefined;
    };
  }

  seabedDescription.$inject = [
    'seabedTypesService',
  ];
  angular.module('divesites').filter('seabedDescription', seabedDescription);
})();
