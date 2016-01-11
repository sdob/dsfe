(function () {
  'use strict';
  function LogDiveController($location, $routeParams, $scope, $timeout, $uibModal, dsapi, mapSettings) {
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

      // Wire up functions
      vm.summonCancelEditingModal = summonCancelEditingModal;

      // Retrieve divesite data
      dsapi.getDivesite($routeParams.divesiteId)
      .then((response) => {
        vm.site = response.data;
      });
      console.log(vm.dive.date);
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
      vm.isSaving = true;

      // Build the object that the API expects
      const combinedDateTime = combineDateAndTime(vm.dive.date, vm.dive.time);
      const data = {
        start_time: combinedDateTime.toISOString(),
        duration: moment.duration(vm.dive.duration, 'minutes'),
        depth: vm.dive.maximumDepth,
        average_depth: vm.dive.averageDepth,
        comment: vm.dive.comment,
        divesite: vm.site.id,
      };
      console.log('duration');
      console.log(vm.dive.duration);
      vm.isSaving = false;
      // POST to the API server
      dsapi.postDive(data)
      .then((response) => {
        // A successful post request
        vm.isSaving = false;
        console.log(response);
        //return response;
        // Update the map settings before returning us to the map
        mapSettings.set('center', {
          latitude: response.data.divesite.latitude,
          longitude: response.data.divesite.longitude,
        });
        $location.path('/');
      }, (err) => {
        // TODO: handle server-side errors
        console.log('catching error!');
        console.log(err);
        vm.isSaving = false;
      })
      .catch((response) => {
        console.log(response);
      });
    }


    function summonCancelEditingModal() {
      console.log('summoning cancelling editing');
      $uibModal.open({
        templateUrl: 'views/cancel-editing-modal.html',
        controller: 'CancelEditingModalController',
        controllerAs: 'vm',
      });
    }
  }

  LogDiveController.$inject = [
    '$location',
    '$routeParams',
    '$scope',
    '$timeout',
    '$uibModal',
    'dsapi',
    'mapSettings',
  ];
  angular.module('divesites').controller('LogDiveController', LogDiveController);
})();
