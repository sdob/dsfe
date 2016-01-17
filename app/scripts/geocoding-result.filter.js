(function () {
  function geocodingResult() {
    const ADMIN_AREA_1 = 'administrative_area_level_1';
    const COUNTRY = 'country';
    return (result) => {
      // The highest-level administrative-area name *should* be the second-last component
      const highestAdminAreaComponent = result.address_components[result.address_components.length - 2];
      const adminArea1Component = result.address_components.filter(x => x.types.indexOf(ADMIN_AREA_1) >= 0)[0];
      // Country result *should* be the last
      const countryComponent = result.address_components.filter(x => x.types.indexOf(COUNTRY) >= 0)[0];
      return `${adminArea1Component.long_name}, ${countryComponent.long_name}`;
    };
  }
  angular.module('divesites').filter('geocodingResult', geocodingResult);
})();
