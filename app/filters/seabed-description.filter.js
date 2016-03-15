(function() {
  'use strict';

  function seabedDescription(seabedTypesService) {
    const { seabedTypes } = seabedTypesService;
    return (value) => {
      const seabed = seabedTypes.filter(x => x.value === value);
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
