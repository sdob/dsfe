(function() {
  'use strict';
  function LogDiveModalController($scope, $timeout, $uibModalInstance, dsapi, logDiveService, modalService, site, uiPreferencesService) {
    const vm = this;

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

    activate();

    function activate() {
      vm.weathers = weathers;
      vm.winds = winds;
      // Wire up functions
      vm.dismiss = modalService.dismiss;
      vm.datepicker = {
        opened: false,
      };
      vm.openDatepicker = openDatepicker;
      vm.options = {
        showMeridian: uiPreferencesService.get().clock === '12hr',
      };
      vm.selectWeather = selectWeather;
      vm.selectWind = selectWind;
      vm.setNitrox = setNitrox;
      vm.site = site;
      vm.submit = submit;

      // Set defaults for this dive
      const dt = logDiveService.defaultDateAndTime();
      vm.dive = {
        date: dt.date,
        gasMix: 'air',
        site: vm.site,
      };
    }

    function formatGasMix() {
      const obj = {
        mix: vm.dive.gasMix,
      };
      // If the mix is Nitrox, add the O2 content
      if (vm.dive.gasMix === 'nitrox') {
        obj.o2 = vm.dive.nitroxO2;
      }

      return obj;
    }

    function formatRequest(dive) {
      // Build the object that DSAPI expects
      const request = {
        cylinder_capacity: vm.dive.cylinderCapacity,
        date: moment(dive.date).format('YYYY-MM-DD'),
        time: dive.time ? moment(dive.time).format('HH:mm') : undefined,
        duration: moment.duration(dive.duration, 'minutes'),
        depth: dive.maximumDepth,
        average_depth: dive.averageDepth,
        comment: dive.comment,
        divesite: vm.site.id,
        air_temperature: dive.airTemperature,
        water_temperature: dive.waterTemperature,
        // Tank pressure
        pressure_in: dive.pressureIn,
        pressure_out: dive.pressureOut,
        // Gas mix
        gas_mix: formatGasMix(),
        // Weather
        weather: formatWeather(),
        // Wind
        wind: formatWind(),
      };
      return request;
    }

    function formatWeather() {
      if (vm.dive.weather) {
        return vm.dive.weather.type;
      }

      return undefined;
    }

    function formatWind() {
      if (vm.dive.wind) {
        return vm.dive.wind.value;
      }

      return undefined;
    }

    function openDatepicker() {
      vm.datepicker.opened = true;
    }

    function selectWeather(weather) {
      // console.log(weather);
      if (weather) {
        console.log(`selecting weather as ${weather.type}`);
        vm.dive.weather = weather;
      } else {
        delete vm.dive.weather;
      }
    }

    function selectWind(wind) {
      if (wind) {
        vm.dive.wind = wind;
      } else {
        delete vm.dive.wind;
      }
    }

    function setNitrox(isNitrox) {
      // Set the gas mix to Nitrox when focusing the O2 input,
      // even if the user hasn't used the radio button
      if (isNitrox) {
        vm.dive.gasMix = 'nitrox';
        vm.dive.nitroxO2 = vm.dive.nitroxO2 || 21;
      } else {
        delete vm.dive.nitroxO2;
      }
    }

    function submit() {
      $scope.logDiveForm.$setSubmitted();
      // Bail out early if the form is invalid
      if (!$scope.logDiveForm.$valid) {
        vm.isSaving = false;
        return;
      }

      vm.isSubmitting = true;
      const request = formatRequest(vm.dive);
      console.log('sending request');
      console.log(request);
      vm.isSubmitting = false;
      dsapi.postDive(request)
      .then((response) => {
        $uibModalInstance.close('logged');
      })
      .catch((err) => {
        vm.isSubmitting = false;
        // Handle 4xx (client) errors
        if (err.status >= 400 && err.status < 500) {
          console.error(err);
          Object.keys(err.data).forEach((k) => {
            if (logDiveForm.hasOwnProperty(k)) {
              $scope.logDiveForm[k].$error.serverMessage = err.data[k][0];
            }
          });
        } else {
          // TODO: handle 5xx errors
          console.error(err);
        }
      });
    }
  }

  LogDiveModalController.$inject = [
    '$scope',
    '$timeout',
    '$uibModalInstance',
    'dsapi',
    'logDiveService',
    'modalService',
    'site',
    'uiPreferencesService',
  ];
  angular.module('divesites.informationCard').controller('LogDiveModalController', LogDiveModalController);

})();
