(function() {
  'use strict';
  function LogDiveModalController($scope, $timeout, $uibModal, $uibModalInstance, conditionsLayoutService, dsapi, logDiveService, modalService, site, uiPreferencesService) {
    const vm = this;
    const { weathers, winds } = conditionsLayoutService;

    activate();

    function activate() {
      vm.dismiss = dismiss;
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
      vm.weathers = weathers;
      vm.winds = winds;

      // Set defaults for this dive
      const dt = logDiveService.defaultDateAndTime();
      vm.dive = {
        date: dt.date,
        gasMix: 'air',
        site: vm.site,
      };

      // This flag lets us track whether the user has confirmed that they
      // definitely want to close the modal (since closing without saving
      // will lose any data they've entered)
      let modalCloseConfirmed = false;

      // Register an event listener for when the modal closes, and
      // confirm
      $scope.$on('modal.closing', (e) => {
        // If we've checked with the user that they definitely want to
        // close the modal, then proceed as usual
        if (modalCloseConfirmed) {
          return;
        }
        // Otherwise, cancel closing and pop up a confirmation modal
        e.preventDefault();
        const instance = $uibModal.open({
          controller: 'CancelLoggingModalController',
          controllerAs: 'vm',
          size: 'sm',
          templateUrl: 'information-card/log-dive-modal/cancel-logging-modal.template.html',
          windowClass: 'modal-center',
        });
        // When the confirmation modal closes, check the dismissal reason;
        // if the user definitely wants to cancel, then make it so
        instance.result.then((reason) => {
          if (reason === 'performCancel') {
            // Flag as OK to close, and re-fire the event
            modalCloseConfirmed = true;
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
        // It's OK to close the modal, since we've successfully submitted the
        // information
        modalCloseConfirmed = true;
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
    'dsapi',
    'logDiveService',
    'modalService',
    'site',
    'uiPreferencesService',
  ];
  angular.module('divesites.informationCard').controller('LogDiveModalController', LogDiveModalController);

})();
