(function() {
  'use strict';
  function InformationCardLogDiveFormController($scope, $timeout, dsapi, logDiveService, uiPreferencesService) {
    const vm = this;

    // TODO: get these into scope some other way
    vm.site = $scope.$parent.site;
    const icvm = $scope.icvm;
    activate();

    function activate() {
      // Wire up functions
      vm.openDatepicker = openDatepicker;
      vm.submit = submit;

      vm.datepicker = {
        opened: false,
      };

      // Set defaults
      const dt = logDiveService.defaultDateAndTime();
      vm.dive = {
        date: dt.date,
        site: vm.site,
      };
      vm.options = {
        showMeridian: uiPreferencesService.get().clock === '12hr',
      };
    }

    function formatRequest(dive) { // jscs: disable requireCamelCaseOrUpperCaseIdentifiers
      // Build the object that DSAPI expects
      const combinedDateAndTime = logDiveService.combineDateAndTime(dive.date, dive.time);
      console.log('date');
      console.log(dive.date);
      console.log('time');
      console.log(dive.time);
      const request = {
        date: moment(dive.date).format('YYYY-MM-DD'),
        time: dive.time ? moment(dive.time).format('HH:mm') : undefined,
        duration: moment.duration(dive.duration, 'minutes'),
        depth: dive.maximumDepth,
        average_depth: dive.averageDepth,
        comment: dive.comment,
        divesite: dive.site.id,
      };
      console.log('request');
      console.log(request);
      return request;
    } // jscs: enable requireCamelCaseOrUpperCaseIdentifiers

    function openDatepicker() {
      vm.datepicker.opened = true;
    }

    function submit() {
      $scope.logDiveForm.$setSubmitted();
      vm.isSaving = true;
      const request = formatRequest(vm.dive);

      // Bail out early if the form fails client-side validation
      if (!$scope.logDiveForm.$valid) {
        vm.isSaving = false;
        return;
      }

      // We've passed client-side validation; send the data
      dsapi.postDive(request)
      .then((response) => {
        dsapi.getDivesite(vm.site.id)
        .then((response) => {
          // TODO: ensure that the information card shows the updated data
          // when we return
          // Emit an event up to the information card controller
          $scope.$emit('dive-list-updated');

          $timeout(() => {
            // Add a little latency at the end of the chain to make it obvious
            // that we've done something
            console.log('saved; returning');
            vm.isSaving = false;
            icvm.toggleSectionVisibility('defaultSection');
          }, 500);
        });
      })
      .catch((err) => {
        // Catch errors returned from the server (server error or bad request)
        console.error(err);
        vm.isSaving = false;
      });
    }
  }

  InformationCardLogDiveFormController.$inject = [
    '$scope',
    '$timeout',
    'dsapi',
    'logDiveService',
    'uiPreferencesService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardLogDiveFormController', InformationCardLogDiveFormController);

})();
