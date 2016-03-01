(function() {
  'use strict';
  function LogDiveModalController($scope, $timeout, $uibModalInstance, dsapi, logDiveService, modalService, site, uiPreferencesService) {
    const vm = this;
    activate();

    function activate() {
      // Wire up functions
      vm.dismiss = modalService.dismiss;
      vm.datepicker = {
        opened: false,
      };
      vm.openDatepicker = openDatepicker;
      vm.options = {
        showMeridian: uiPreferencesService.get().clock === '12hr',
      };
      vm.site = site;
      vm.submit = submit;

      const dt = logDiveService.defaultDateAndTime();
      vm.dive = {
        date: dt.date,
        site: vm.site,
      };
    }

    function formatRequest(dive) {
      // Build the object that DSAPI expects
      const request = {
        date: moment(dive.date).format('YYYY-MM-DD'),
        time: dive.time ? moment(dive.time).format('HH:mm') : undefined,
        duration: moment.duration(dive.duration, 'minutes'),
        depth: dive.maximumDepth,
        average_depth: dive.averageDepth,
        comment: dive.comment,
        divesite: vm.site.id,
      };
      return request;
    }

    function openDatepicker() {
      vm.datepicker.opened = true;
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
      dsapi.postDive(request)
      .then((response) => {
        $uibModalInstance.close('logged');
      })
      .catch((err) => {
        vm.isSubmitting = false;
        // Handle 4xx errors
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
