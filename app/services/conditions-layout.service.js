(function() {
  'use strict';

  function conditionsLayoutService() {
    const weathers = [
      { type: 'clear', wiClass: 'wi-day-sunny', text: 'Clear' },
      { type: 'clouds', wiClass: 'wi-cloud', text: 'Clouds' },
      { type: 'rain', wiClass: 'wi-rain', text: 'Rain' },
      { type: 'fog', wiClass: 'wi-fog', text: 'Fog' },
      { type: 'snow', wiClass: 'wi-snow', text: 'Snow' },
    ];

    const winds = [
      { value: 0, description: 'Calm' },
      { value: 1, description: 'Light air' },
      { value: 2, description: 'Light breeze' },
      { value: 3, description: 'Gentle breeze' },
      { value: 4, description: 'Moderate breeze' },
      { value: 5, description: 'Fresh breeze' },
      { value: 6, description: 'Strong breeze' },
      { value: 7, description: 'High wind' },
      { value: 8, description: 'Gale' },
      { value: 9, description: 'Strong gale' },
      { value: 10, description: 'Storm' },
      { value: 11, description: 'Violent storm' },
      { value: 12, description: 'Hurricane' },
    ];

    return {
      weathers,
      winds,
    };
  }

  angular.module('divesites').factory('conditionsLayoutService', conditionsLayoutService);
})();
