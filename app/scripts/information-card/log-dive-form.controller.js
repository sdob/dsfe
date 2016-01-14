(function () {
  'use strict';
  function InformationCardLogDiveFormController($scope, dsapi, logDiveService, uiPreferencesService) {
    const vm = this;
    activate();

    function activate() {
      // Wire up functions 
      vm.submit = submit;

      console.log('$scope: ');
      console.log($scope);
      // TODO: get this into scope some other way
      const site = $scope.$parent.site;

      // Set defaults
      const dt = logDiveService.defaultDateAndTime();
      vm.dive = {
        date: dt.date,
        time: dt.time,
        site: site,
      };
      vm.options = {
        showMeridian: uiPreferencesService.get().clock === '12hr',
      };
    }

    function formatRequest(dive) {
      // Build the object that DSAPI expects
      const combinedDateAndTime = logDiveService.combineDateAndTime(dive.date, dive.time);
      const request = {
        start_time: combinedDateAndTime.toISOString(),
        duration: moment.duration(dive.duration, 'minutes'),
        depth: dive.maximumDepth,
        average_depth: dive.averageDepth,
        comment: dive.comment,
        divesite: dive.site.id,
      };
      return request;
    }

    function submit() {
      $scope.logDiveForm.$setSubmitted();
      vm.isSaving = true;
      console.log('submitting...');
      const request = formatRequest(vm.dive);
      console.log(request);
      // Bail out early if the form fails client-side validation
      if (!$scope.logDiveForm.$valid) {
        console.error('invalid form');
        console.log($scope.logDiveForm.$error);
        console.log($scope.logDiveForm.maximumDepth);
        vm.isSaving = false;
        return;
      }
      // We've passed client-side validation; send the data
      console.log('passed client-side validation');
      dsapi.postDive(request)
      .then((response) => {
        console.log('response from API server:');
        console.log(response.data);
        $timeout(() => {
          vm.isSaving = false;
        }, 500);
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
    'dsapi',
    'logDiveService',
    'uiPreferencesService',
  ];
  angular.module('divesites.informationCard').controller('InformationCardLogDiveFormController', InformationCardLogDiveFormController);

})();
