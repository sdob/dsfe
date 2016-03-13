(function() {
  'use strict';
  function gasMixFilter() {
    return (gas) => {
      if (gas.mix === 'air') {
        return 'Air';
      }

      if (gas.mix === 'nitrox') {
        return `Nitrox ${gas.o2}%`;
      }

      return undefined;
    };
  }

  angular.module('divesites').filter('gasMix', gasMixFilter);
})();
