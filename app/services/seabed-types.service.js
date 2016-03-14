(function() {
  'use strict';

  function seabedTypesService() {
    return {
      seabedTypes: [
        { value: 'Blds', description: 'Boulders' },
        { value: 'Cl', description: 'Clay' },
        { value: 'Co', description: 'Coral' },
        { value: 'M', description: 'Mud' },
        { value: 'S', description: 'Sand' },
      ],
    };
  }

  angular.module('divesites').factory('seabedTypesService', seabedTypesService);
})();
