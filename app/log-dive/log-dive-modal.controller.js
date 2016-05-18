(function() {
  'use strict';
  function LogDiveModalController($scope, $timeout, $uibModal, $uibModalInstance, conditionsLayoutService, confirmModalService, diveID, dsapi, logDiveService, modalService, site, uiPreferencesService) {
    const { weathers, winds } = conditionsLayoutService;
    const { reasons, summonConfirmModal } = confirmModalService;

    const vm = this;

    // Bind immediately-available variables
    vm.datepicker = {
      opened: false,
    };
    vm.dismiss = dismiss;
    vm.openDatepicker = openDatepicker;
    vm.options = {
      showMeridian: uiPreferencesService.get().clock === '12hr',
    };
    vm.selectWeather = selectWeather;
    vm.selectWind = selectWind;
    vm.setNitrox = setNitrox;
    vm.site = site;
    vm.submit = submit;
    vm.weathers = weathers;
    vm.winds = winds;

    activate();

    function activate() {

      // Set defaults for this dive
      const dt = logDiveService.defaultDateAndTime();
      vm.dive = {
        date: dt.date,
        gasMix: 'air',
        site: vm.site,
      };

      // If we're passed a dive UUID, then retrieve the data from DSAPI and
      // populate the model
      if (diveID !== undefined) {
        console.log('looks like I received a diveID');
        dsapi.getDive(diveID)
        .then((response) => {
          // Format DSAPI response to conform to our Angular model
          const dive = formatResponse(response);
          vm.dive = dive;
          console.log(vm.dive);
        });
        // TODO: Invalid diveIDs will return a 404, and we
        // should handle this
      }

      // This flag lets us track whether the user has confirmed that they
      // definitely want to close the modal (since closing without saving
      // will lose any data they've entered)
      vm.modalCloseConfirmed = false;

      // Register an event listener for when the modal closes, and
      // confirm
      $scope.$on('modal.closing', (e) => {
        console.log($scope.logDiveForm);

        // (a) the user has confirmed that they want to close, or
        // (b) the form hasn't been touched, then just close as usual
        if (vm.modalCloseConfirmed || !$scope.logDiveForm.$dirty) {
          return;
        }

        // Otherwise, cancel closing while we confirm
        e.preventDefault();

        // Open a confirmation modal
        const instance = summonConfirmModal({
          templateUrl: 'log-dive/log-dive-modal/cancel-logging-modal.template.html',
        });

        // When the confirmation modal closes, check the dismissal reason;
        // if the user definitely wants to cancel, then make it so
        instance.result.then((reason) => {
          if (reason === reasons.CONFIRMED) {
            // Flag as OK to close, and re-fire the event
            vm.modalCloseConfirmed = true;
            $uibModalInstance.dismiss();
          }
        });
      });
    }

    // Close the modal (likely causing a confirmation modal to pop up if
    // the user hasn't explicitly indicated that they want to discard info)
    function dismiss() {
      $uibModalInstance.close();
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
        air_temperature: dive.airTemperature,
        cylinder_capacity: vm.dive.cylinderCapacity,
        date: moment(dive.date).format('YYYY-MM-DD'),
        time: dive.time ? moment(dive.time).format('HH:mm') : undefined,
        duration: moment.duration(dive.duration, 'minutes'),
        depth: dive.maximumDepth,
        average_depth: dive.averageDepth,
        comment: dive.comment,
        divesite: vm.site.id,
        // Tank pressure
        pressure_in: dive.pressureIn,
        pressure_out: dive.pressureOut,
        // Gas mix
        gas_mix: formatGasMix(),
        water_temperature: dive.waterTemperature,
        // Weather
        weather: formatWeather(),
        // Wind
        wind: formatWind(),
      };
      console.log('formatted request');
      console.log(request);
      return request;
    }

    function formatResponse(response) {
      const data = response.data;
      console.log('unformatted response data');
      console.log(data);
      const dive = {
        //airTemperature: data.air_temperature ? Number(data.air_temperature) : undefined,
        airTemperature: numberOrUndefined(data.air_temperature),
        averageDepth: data.average_depth ? Number(data.average_depth) : undefined,
        comment: data.comment,
        date: moment(data.date).toDate(),
        cylinderCapacity: data.cylinder_capacity ? Number(data.cylinder_capacity) : undefined,
        duration: moment.duration(data.duration).asMinutes(),
        gasMix: data.gas_mix ? data.gas_mix.mix : undefined,
        maximumDepth: Number(data.depth),
        nitroxO2: data.gas_mix ? data.gas_mix.o2 : undefined,
        pressureIn: data.pressure_in ? Number(data.pressure_in) : undefined,
        pressureOut: data.pressure_out ? Number(data.pressure_out) : undefined,
        // time: data.time ? moment(data.time).toDate() : undefined,
        waterTemperature: data.water_temperature ? Number(data.water_temperature) : undefined,
        weather: getWeather(data.weather),
        wind: getWind(data.wind),
      };
      console.log(dive.date);
      // Timepicker needs a Date object, so we'll just dummy in the information
      // from the date
      if (data.time) {
        const time = moment(data.time, 'HH:mm');
        console.log(time);
        dive.time = moment(dive.date).hours(time.hours()).minutes(time.minutes());
      }

      return dive;

      function getWeather(type) {
        return weathers.filter(w => w.type === type)[0];
      }

      function getWind(value) {
        return winds.filter(w => w.value === value)[0];
      }

      function numberOrUndefined(x) {
        if (x) {
          return Number(x);
        }

        return undefined;
      }
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
      const apiCall = diveID ? (request) => dsapi.updateDive(diveID, request) : dsapi.postDive;
      apiCall(request)
      //dsapi.postDive(request)
      .then((response) => {
        // It's OK to close the modal, since we've successfully submitted the
        // information
        vm.modalCloseConfirmed = true;
        // Close with a 'logged' message
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
    '$uibModal',
    '$uibModalInstance',
    'conditionsLayoutService',
    'confirmModalService',
    'diveID',
    'dsapi',
    'logDiveService',
    'modalService',
    'site',
    'uiPreferencesService',
  ];
  angular.module('divesites.logDive').controller('LogDiveModalController', LogDiveModalController);

})();
