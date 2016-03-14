(function() {
  'use strict';

  function weatherDescription(conditionsLayoutService) {
    const { weathers } = conditionsLayoutService;
    return (type) => {
      const weather = weathers.filter(x => x.type === type);
      if (weather.length) {
        return weather[0].text;
      }

      // Default to returning undefined
      return undefined;
    };
    // return (level) => winds[level].description;
  }

  weatherDescription.$inject = [
    'conditionsLayoutService',
  ];
  angular.module('divesites').filter('weatherDescription', weatherDescription);
})();
