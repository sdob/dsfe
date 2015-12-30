(function () {
  'use strict';
  function LogDiveController($routeParams, $scope, $timeout, dsapi) {
    const vm = this;
    activate();

    function activate() {
      console.log('LogDiveController.activate()');
      vm.checkForError = checkForError;
      vm.dive = {
        date: new Date(),
        time: new Date(),
      };
      vm.options = {
        showMeridian: true,
      };
      vm.saveButton = {
        disabled: false,
        text: 'Save',
      };
      vm.settings = {
        maxDate: moment()
      };
      vm.submit = submit;

      dsapi.getDivesite($routeParams.divesiteId)
      .then((response) => {
        vm.site = response.data;
      });
    }

    function checkForError(form, formElement) {
      return formElement.$error.required && (form.$submitted || formElement.$touched);
    }

    function combineDateAndTime(date, time) {
      const year = moment(date).year();
      const month = moment(date).month();
      const day = moment(date).date();
      const hour = moment(time).hour();
      const minute = moment(time).minute();
      const combined = moment([year, month, day, hour, minute]);
      return combined;
    }

    function submit() {
      console.log('logDive.submit()');
      //vm.disableSaveButton = true;
      console.log($scope.logDiveForm);
      if ($scope.logDiveForm.$invalid) {
        console.log('form is invalid; returning');
        return;
      }
      $scope.logDiveForm.$setSubmitted();
      vm.saveButton.disabled = true;
      vm.saveButton.text = ' ';
      $timeout(() => {
        console.log('unsetting disabled');
        vm.saveButton.disabled = false;
        vm.saveButton.text = 'Save';
      }, 2000);
      const combinedDateTime = combineDateAndTime(vm.dive.date, vm.dive.time);
      // Build the object that the API expects
      const data = {
        start_time: combinedDateTime.toISOString(),
        duration: vm.dive.duration,
        depth: vm.dive.maximumDepth,
        average_depth: vm.dive.averageDepth,
        comment: vm.dive.comment,
        divesite: vm.site.id,
      };
      console.log(data);
    }
  }

  LogDiveController.$inject = ['$routeParams', '$scope', '$timeout', 'dsapi'];
  angular.module('divesites').controller('LogDiveController', LogDiveController);
})();
